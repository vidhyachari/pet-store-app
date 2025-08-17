# chatbot/retriever.py
import os
import chromadb
from chromadb.utils import embedding_functions

# Set the API key from environment variable if available
if "OPENAI_API_KEY" in os.environ and "CHROMA_OPENAI_API_KEY" not in os.environ:
    os.environ["CHROMA_OPENAI_API_KEY"] = os.environ["OPENAI_API_KEY"]

# If still not set, prompt user for API key
if "CHROMA_OPENAI_API_KEY" not in os.environ:
    api_key = input("Please enter your OpenAI API key: ").strip()
    os.environ["CHROMA_OPENAI_API_KEY"] = api_key

client = chromadb.PersistentClient(path="../.chroma")
emb = embedding_functions.OpenAIEmbeddingFunction(model_name="text-embedding-3-small")
kb = client.get_or_create_collection(name="petstore_kb", embedding_function=emb)

def retrieve_context(query: str, k: int = 4):
    res = kb.query(query_texts=[query], n_results=k)
    docs  = res.get("documents", [[]])[0]
    metas = res.get("metadatas", [[]])[0]
    return "\n".join(f"[{m['source']}] {d}" for d,m in zip(docs, metas))
