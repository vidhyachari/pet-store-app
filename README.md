# 🐾 Furpawtique - Pet Store Application

**Made with ❤️ for pets and their humans**

A modern, full-stack pet store application with an AI-powered chatbot assistant. Built with React, Node.js, and SQLite, featuring a beautiful UI and intelligent shopping experience.

## ✨ Features

### 🛍️ **Shopping Experience**
- **Product Categories**: Toys, Food, and Grooming services
- **Interactive Product Cards**: Beautiful product displays with images and descriptions
- **Shopping Cart**: Add items to cart with real-time quantity tracking
- **Search Functionality**: Search through products with a modern search bar
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🤖 **AI-Powered Chatbot Assistant**
- **PawPrompt**: Intelligent chatbot that helps customers find products
- **RAG (Retrieval-Augmented Generation)**: Knowledge base integration with ChromaDB
- **Natural Language Processing**: Ask questions about products in plain English
- **Stock Checking**: Real-time inventory queries
- **Cart Integration**: Add items to cart directly through chat
- **Product Recommendations**: Get suggestions based on pet type (dog/cat)
- **Knowledge Base**: Access to breed info, care guides, feeding guides, and grooming services
- **Source Attribution**: Responses include source information from documentation

### 🎨 **Modern UI/UX**
- **Beautiful Design**: Clean, modern interface with pet-themed styling
- **Smooth Animations**: Engaging user interactions
- **Icon Integration**: React Icons for enhanced visual appeal
- **Responsive Layout**: Optimized for all screen sizes

## 🏗️ Architecture

### Frontend (React + Vite)
- **React 19**: Latest React features and performance optimizations
- **Vite**: Fast development server and build tool
- **React Router**: Client-side routing
- **Context API**: State management for shopping cart
- **CSS Modules**: Scoped styling

### Backend (Node.js + Express)
- **Express.js**: RESTful API server
- **SQLite**: Lightweight database for product storage
- **CORS**: Cross-origin resource sharing enabled
- **Modular Routes**: Organized API endpoints for each product category

### AI Chatbot (Python + Flask)
- **Flask**: Lightweight web framework
- **OpenAI GPT-4**: Advanced language model for natural conversations
- **Function Calling**: Structured API for database operations
- **Real-time Integration**: Seamless connection with frontend
- **ChromaDB**: Vector database for knowledge base storage
- **RAG System**: Retrieval-Augmented Generation for factual responses
- **Embedding Functions**: OpenAI text-embedding-3-small for semantic search

## 🔐 Security

**Important Security Notes:**
- Never commit your OpenAI API key to version control
- The `.env` file is automatically ignored by git
- Always use environment variables for sensitive configuration
- Keep your API keys secure and rotate them regularly
- The `.chroma` directory contains the knowledge base and should not be committed to version control

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- npm or yarn
- OpenAI API key

### Getting the Code
**For the latest RAG integration version:**
```bash
# Clone the repository
git clone <repository-url>
cd pet-store-app

# Switch to the RAG integration branch
git checkout v2-rag-chromadb

# OR pull the specific tag
git checkout v2.0.0-rag-chromadb
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pet-store-app
   ```

2. **Install Root Dependencies**
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

5. **Install Chatbot Dependencies**
   ```bash
   cd ../chatbot
   pip install flask flask-cors openai chromadb python-dotenv
   ```

6. **Set up Environment Variables**
   ```bash
   # Create .env file in chatbot directory
   cd chatbot
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   echo "CHROMA_OPENAI_API_KEY=your_openai_api_key_here" >> .env
   ```
   
   **Important:** Replace `your_openai_api_key_here` with your actual OpenAI API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

7. **Set up Knowledge Base**
   ```bash
   cd ../scripts
   python3 ingest_kb.py
   ```
   
   This will:
   - Create a ChromaDB knowledge base in the `.chroma/` directory
   - Process all markdown files from the `docs/` folder
   - Generate embeddings using OpenAI's text-embedding-3-small model
   - Index 83+ chunks of text for RAG retrieval
   
   **Note:** You'll be prompted for your OpenAI API key if not set in environment variables.

8. **Initialize Database**
   ```bash
   cd ../backend
   npm run seed
   ```

### Running the Application

**Start all services with a single command:**
```bash
npm run dev
```

This will start:
- **Frontend** on http://localhost:5173
- **Backend API** on http://localhost:3000  
- **Chatbot Server** on http://localhost:5001

**Open your browser and navigate to** `http://localhost:5173`

---

**Alternative: Start services individually**
If you prefer to run services separately:

1. **Backend Server**
   ```bash
   cd backend
   npm start
   ```

2. **Chatbot Server**
   ```bash
   cd chatbot
   python chatbot_server.py
   ```

3. **Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

## 📁 Project Structure

```
pet-store-app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── assets/         # Images and static assets
│   │   └── App.jsx         # Main application component
│   └── package.json
├── backend/                 # Node.js API server
│   ├── routes/             # API route handlers
│   ├── database.js         # Database configuration
│   ├── seed.js            # Database seeding script
│   └── app.js             # Express server setup
├── chatbot/                # AI chatbot server
│   ├── chatbot_server.py   # Flask chatbot application
│   └── retriever.py        # RAG knowledge base retriever
├── scripts/                # Utility scripts
│   └── ingest_kb.py        # Knowledge base ingestion script
├── docs/                   # Documentation files for knowledge base
│   ├── breed_info.md       # Dog and cat breed information
│   ├── care_guides.md      # Pet care guides
│   ├── feeding_guides.md   # Feeding and nutrition guides
│   ├── grooming_services.md # Grooming service details
│   ├── product_catalog.md  # Product information
│   └── faq.md             # Frequently asked questions
└── public/                 # Static assets
```

## 🛠️ API Endpoints

### Backend API (Port 3000)
- `GET /api/toys` - Get all toy products
- `GET /api/food` - Get all food products  
- `GET /api/grooming` - Get all grooming services

### Chatbot API (Port 5001)
- `POST /api/chat` - Chat with AI assistant

## 🗄️ Database Schema

### Toys Table
- `id` (INTEGER, PRIMARY KEY)
- `name` (TEXT, NOT NULL)
- `type` (TEXT, CHECK: 'dog' or 'cat')
- `description` (TEXT)
- `image_url` (TEXT)
- `price` (REAL)
- `stock` (INTEGER, DEFAULT: 10)

### Food Table
- `id` (INTEGER, PRIMARY KEY)
- `name` (TEXT, NOT NULL)
- `animal` (TEXT, CHECK: 'dog' or 'cat')
- `brand` (TEXT)
- `description` (TEXT)
- `image_url` (TEXT)
- `price` (REAL)
- `stock` (INTEGER, DEFAULT: 10)

### Grooming Services Table
- `id` (INTEGER, PRIMARY KEY)
- `name` (TEXT, NOT NULL)
- `description` (TEXT)
- `image_url` (TEXT)
- `price` (REAL)

## 🤖 Chatbot Features

The AI chatbot (PawPrompt) can:
- **Answer questions** about products and services
- **Check stock levels** for specific items
- **List products** by animal type (dog/cat)
- **Add items to cart** through natural conversation
- **Provide breed information** from comprehensive knowledge base
- **Share care and feeding guides** with source attribution
- **Offer grooming advice** based on documented services
- **Answer FAQs** with factual, sourced responses

### Example Chatbot Interactions:
- "How much stock do you have of Sir Chews-a-Lot?"
- "Add 2 Bark Knight toys to my cart"
- "What grooming services do you offer?"
- "Tell me about Labrador Retriever breeds"
- "What feeding tips do you have for puppies?"
- "How should I care for my cat's coat?"

## 🎯 Key Features in Detail

### Shopping Cart
- Real-time cart updates
- Quantity management
- Visual cart badge with item count
- Persistent cart state using React Context

### Product Display
- Category-based filtering (Toys, Food, Grooming)
- Beautiful product cards with images
- Price and stock information
- Add to cart functionality

### Search & Navigation
- Global search bar
- Tab-based category navigation
- Responsive header with logo

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Backend:**
```bash
npm start        # Start production server
npm run dev      # Start with nodemon (development)
npm run seed     # Seed database with sample data
```

## 🧠 Knowledge Base Management

### Adding New Documentation
To add new information to the knowledge base:

1. **Add markdown files** to the `docs/` folder
2. **Update the ingest script** in `scripts/ingest_kb.py` to include new files:
   ```python
   docs += load("docs/your_new_file.md", "category_name")
   ```
3. **Re-run ingestion**:
   ```bash
   cd scripts
   python3 ingest_kb.py
   ```

### Troubleshooting Ingestion
- **API Key Issues**: Ensure `CHROMA_OPENAI_API_KEY` or `OPENAI_API_KEY` is set
- **File Not Found**: Check that markdown files exist in the `docs/` folder
- **Permission Errors**: Ensure write access to create the `.chroma/` directory
- **Memory Issues**: Large files may need to be split into smaller chunks

### Knowledge Base Contents
The current knowledge base includes:
- **Breed Information**: Detailed profiles of dog and cat breeds
- **Care Guides**: Comprehensive pet care instructions
- **Feeding Guides**: Nutrition and feeding recommendations
- **Grooming Services**: Detailed service descriptions
- **Product Catalog**: Product information and details
- **FAQ**: Frequently asked questions and answers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏷️ Version Information

**Current Version:** v2.0.0-rag-chromadb
- **Branch:** `v2-rag-chromadb`
- **Tag:** `v2.0.0-rag-chromadb`
- **Features:** RAG integration with ChromaDB, enhanced UI with gradient theme

**Previous Version:** v1.0.0
- **Branch:** `main`
- **Features:** Basic chatbot without RAG integration

## 🙏 Acknowledgments

- React team for the amazing framework
- OpenAI for the GPT-4 integration
- ChromaDB for vector database capabilities
- The pet-loving community for inspiration

---

