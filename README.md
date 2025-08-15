# CodeStash

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-blue)](https://codestash-demo.vercel.app/)

> **A modern, AI-powered code snippet manager designed for programmers and developers.**

## Overview

CodeStash is a sophisticated utility tool built to solve the common problem developers face: **organizing and quickly finding code snippets**. Whether you're a competitive programmer storing algorithm templates, a full-stack developer maintaining utility functions, or a student learning new concepts, CodeStash provides an intelligent, searchable repository for all your code snippets and notes.

As developers, we constantly encounter useful code snippets, algorithms, and solutions that we want to save for future reference. Traditional note-taking apps lack the specialized features needed for code management, while generic bookmark managers can't search through code content effectively. CodeStash bridges this gap by providing intelligent code search using AI embeddings, organized stash system with tagging and categorization, and real-time synchronization across devices.

## Key Features

### Code Snippet Management
- Create and organize code snippets with mixed content (code + text)
- Tag-based categorization system
- Pin important stashes for quick access
- Real-time search across all content

### AI-Powered Search
- Vector-based search using Google's Gemini AI embeddings
- Search in descriptions or within code content
- MongoDB Atlas Vector Search for lightning-fast queries
- Semantic understanding of code and natural language

## Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[CodeMirror](https://codemirror.net/)** - Code editor with syntax highlighting

### Backend & Database
- **[MongoDB Atlas](https://www.mongodb.com/atlas)** - Vector embeddings storage
  - **Vector Search Index** - AI-powered semantic search capabilities
  - **Aggregation Pipeline** - Complex search queries
- **[Firebase](https://firebase.google.com/)**
  - **Firestore** - Primary document database for user data and stashes
  - **Authentication** - Google OAuth integration
  - **Storage** - File and image uploads

### AI & Search
- **[Google Gemini AI](https://ai.google.dev/)** - Text embedding generation
  - **embedding-001 model** - Converting text to high-dimensional vectors
  - **Semantic search** - Understanding context and meaning
- **Vector Search Architecture**
  - Embeddings stored in MongoDB with vector indices
  - Real-time embedding generation for new content
  - Similarity search using cosine distance

### Caching & Performance
- **[Redis](https://redis.io/)** - High-performance caching layer
  - **Search result caching** - Reduced API calls and faster responses
  - **Session management** - User state persistence
  - **Rate limiting** - API protection
- **[ioredis](https://github.com/luin/ioredis)** - Redis client with cluster support

### DevOps & Deployment
- **[Docker](https://www.docker.com/)** - Containerization
  - Multi-service orchestration with docker-compose
  - Redis container with RedisInsight for monitoring
  - Development environment isolation
- **[Vercel](https://vercel.com/)** - Production deployment and hosting
- **Environment Management** - Secure configuration handling

## Live Demo

Experience CodeStash in action: **[https://codestash-demo.vercel.app/](https://codestash-demo.vercel.app/)**

## Requirements

### System Requirements
- **Node.js** >= 18.0.0
- **npm** or **yarn** package manager
- **Docker** (optional, for local Redis)

### Environment Variables
Create a `.env.local` file with the following variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google AI (Gemini)
GOOGLE_AI_API_KEY=your_google_ai_api_key

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_VSEARCH_INDEX=stash_vector_index

# Redis (optional for caching)
REDIS_URL=redis://localhost:6379
```

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/awesohame/CodeStash.git
cd CodeStash
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Set Up Environment
- Copy `.env.example` to `.env.local`
- Fill in your configuration values
- Set up Firebase project with Firestore and Authentication
- Create MongoDB Atlas cluster with Vector Search index
- Get Google AI API key from Google AI Studio

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### 5. Optional: Run with Docker
For local Redis development:
```bash
docker-compose up -d
```

This starts:
- Redis server on port `6379`
- RedisInsight on port `8001` for monitoring
