# -*- coding: utf-8 -*-
import sqlite3
import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
from retriever import retrieve_context

# Load environment variables from .env file
load_dotenv()

# Set the API key from environment variable if available
if "OPENAI_API_KEY" in os.environ and "CHROMA_OPENAI_API_KEY" not in os.environ:
    os.environ["CHROMA_OPENAI_API_KEY"] = os.environ["OPENAI_API_KEY"]

# If still not set, prompt user for API key
if "CHROMA_OPENAI_API_KEY" not in os.environ:
    api_key = input("Please enter your OpenAI API key: ").strip()
    os.environ["CHROMA_OPENAI_API_KEY"] = api_key

# System prompt for the chatbot
SYSTEM_PROMPT = """You are PawPrompt, a helpful pet store assistant.
- Prefer facts from CONTEXT when answering.
- If context is missing, say you're unsure instead of guessing.
- For health/symptom questions add: "This is educational info, not a substitute for a veterinarian."
- When using external facts, include a short source note like (Source: ASPCA) or (Source: AKC) if the line originates from known orgs.
- If the user asks to add items or check stock, use the provided tools.
"""

# Initialize
app = Flask(__name__)
CORS(app)

try:
    api_key = os.getenv('OPENAI_API_KEY') or os.getenv('CHROMA_OPENAI_API_KEY')
    if not api_key:
        raise ValueError("OpenAI API key not found in environment variables")
    client = OpenAI(api_key=api_key)
except (TypeError, ValueError) as e:
    exit(f"❌ {e}")

# --- Define Local Functions ---
def get_stock_from_db(item_name):
    print("Checking stock for: {}".format(item_name))
    conn = None
    try:
        conn = sqlite3.connect('../backend/petstore.db')
        cursor = conn.cursor()
        query = "SELECT name, stock FROM toys WHERE name LIKE ? UNION SELECT name, stock FROM food WHERE name LIKE ?"
        cursor.execute(query, ('%{}%'.format(item_name), '%{}%'.format(item_name)))
        result = cursor.fetchone()
        if result:
            return json.dumps({"item_name": result[0], "stock": result[1]})
        else:
            return json.dumps({"error": "Item '{}' not found.".format(item_name)})
    except Exception as e:
        print("Database error: {}".format(e))
        return json.dumps({"error": "Database query failed."})
    finally:
        # THIS IS THE FIX: Connection is now closed here, at the very end.
        if conn:
            conn.close()

def get_products_by_category(animal_type):
    print("Getting products for category: {}".format(animal_type))
    conn = None
    try:
        conn = sqlite3.connect('../backend/petstore.db')
        cursor = conn.cursor()
        query = "SELECT name FROM toys WHERE type LIKE ? UNION SELECT name FROM food WHERE animal LIKE ?;"
        cursor.execute(query, ('%{}%'.format(animal_type), '%{}%'.format(animal_type)))
        results = cursor.fetchall()
        if results:
            product_names = [row[0] for row in results]
            return json.dumps({"products": product_names})
        else:
            return json.dumps({"error": "No products found for '{}'.".format(animal_type)})
    except Exception as e:
        print("Database error: {}".format(e))
        return json.dumps({"error": "Database query failed."})
    finally:
        # THIS IS THE FIX: Connection is now closed here, at the very end.
        if conn:
            conn.close()

def get_grooming_services():
    print("Getting grooming services")
    conn = None
    try:
        conn = sqlite3.connect('../backend/petstore.db')
        cursor = conn.cursor()
        query = "SELECT name, description, price FROM grooming_services;"
        cursor.execute(query)
        results = cursor.fetchall()
        if results:
            services = [{"name": row[0], "description": row[1], "price": row[2]} for row in results]
            return json.dumps({"services": services})
        else:
            return json.dumps({"error": "No grooming services found."})
    except Exception as e:
        print("Database error: {}".format(e))
        return json.dumps({"error": "Database query failed."})
    finally:
        if conn:
            conn.close()

def add_item_to_cart(item_name, quantity=1):
    print("Adding {} of {} to cart.".format(quantity, item_name))
    conn = None
    try:
        conn = sqlite3.connect('../backend/petstore.db')
        cursor = conn.cursor()
        # Search in toys, food, and grooming services tables for the item
        query = "SELECT name, price FROM toys WHERE name LIKE ? UNION SELECT name, price FROM food WHERE name LIKE ? UNION SELECT name, price FROM grooming_services WHERE name LIKE ?"
        cursor.execute(query, ('%{}%'.format(item_name), '%{}%'.format(item_name), '%{}%'.format(item_name)))
        result = cursor.fetchone()
        
        if result:
            return json.dumps({
                "success": True, 
                "item_name": result[0], 
                "quantity": quantity,
                "price": result[1] if result[1] else 0
            })
        else:
            return json.dumps({
                "success": True, 
                "item_name": item_name, 
                "quantity": quantity,
                "price": 0
            })
    except Exception as e:
        print("Database error: {}".format(e))
        return json.dumps({
            "success": True, 
            "item_name": item_name, 
            "quantity": quantity,
            "price": 0
        })
    finally:
        if conn:
            conn.close()

# --- Describe Functions to AI Model ---
tools = [
    { "type": "function", "function": { "name": "get_stock_from_db", "description": "Get the current stock quantity for a specific toy or food item.", "parameters": { "type": "object", "properties": { "item_name": { "type": "string", "description": "The name of the item."}}, "required": ["item_name"],},},},
    { "type": "function", "function": { "name": "get_products_by_category", "description": "Get a list of all products for a given animal category.", "parameters": { "type": "object", "properties": { "animal_type": { "type": "string", "description": "The type of animal.", "enum": ["dog", "cat"]}}, "required": ["animal_type"],},},},
    { "type": "function", "function": { "name": "get_grooming_services", "description": "Get a list of all available grooming services with their descriptions and prices.", "parameters": { "type": "object", "properties": {}, "required": [],},},},
    { "type": "function", "function": { "name": "add_item_to_cart", "description": "Adds a specified quantity of an item to the user's shopping cart.", "parameters": { "type": "object", "properties": { "item_name": {"type": "string", "description": "The name of the item to add."}, "quantity": {"type": "integer", "description": "The number of items to add. Defaults to 1."}}, "required": ["item_name"],},},},
]

# RAG Message building
def build_messages(user_msg: str, context: str):
    """Build messages with system prompt and context for RAG"""
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "system", "content": f"CONTEXT:\n{context or '(no relevant context)'}"},
        {"role": "user",   "content": user_msg},
    ]

# --- Main API Route ---
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    messages = data.get('messages')
    if not messages:
        return jsonify({"error": "No messages provided"}), 400

    try:
        # Get the user's message (last message in the conversation)
        user_message = messages[-1]['content'] if messages else ""
        
        # Retrieve relevant context from RAG knowledge base
        context = retrieve_context(user_message, k=4)
        
        # Build messages with system prompt and context
        rag_messages = build_messages(user_message, context)
        
        # Add conversation history (excluding the last user message since it's in rag_messages)
        conversation_history = messages[:-1] if len(messages) > 1 else []
        
        # Combine conversation history with RAG messages
        all_messages = conversation_history + rag_messages
        
        first_response = client.chat.completions.create( model="gpt-4", messages=all_messages, tools=tools, tool_choice="auto" )
        response_message = first_response.choices[0].message
        tool_calls = response_message.tool_calls

        if tool_calls:
            available_functions = { "get_stock_from_db": get_stock_from_db, "get_products_by_category": get_products_by_category, "get_grooming_services": get_grooming_services, "add_item_to_cart": add_item_to_cart, }
            
            tool_call = tool_calls[0]
            function_name = tool_call.function.name
            function_to_call = available_functions[function_name]
            function_args = json.loads(tool_call.function.arguments)
            function_response = function_to_call(**function_args)
            
            all_messages.append(response_message)
            all_messages.append(
                { "tool_call_id": tool_call.id, "role": "tool", "name": function_name, "content": function_response, }
            )

            second_response = client.chat.completions.create( model="gpt-4", messages=all_messages, )
            final_response_content = second_response.choices[0].message.content

            # --- THIS IS THE NEW PART ---
            # If the action was adding to cart, include details in the response
            if function_name == 'add_item_to_cart':
                # Parse the function response to get price information
                function_response_data = json.loads(function_response)
                return jsonify({
                    'response': final_response_content,
                    'action_details': {
                        'action': 'add_to_cart',
                        'item': {
                            'name': function_response_data.get('item_name'),
                            'quantity': function_response_data.get('quantity', 1),
                            'price': function_response_data.get('price', 0)
                        }
                    }
                })
            # --- END OF NEW PART ---

            return jsonify({'response': final_response_content})
        else:
            return jsonify({'response': response_message.content})

    except Exception as e:
        print("An error occurred: {}".format(e))
        return jsonify({"response": "Sorry, I'm having trouble connecting to my AI brain right now."}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)