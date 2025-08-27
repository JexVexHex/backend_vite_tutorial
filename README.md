# React + Express Full-Stack ToDo Tutorial

An interactive web-based tutorial that teaches you how to build a modern full-stack ToDo application using React, Express.js, and Tailwind CSS.

## 🎯 What You'll Learn

- Build a responsive React UI with Vite and Tailwind CSS
- Create a REST API with Express.js and in-memory storage
- Implement full CRUD operations (Create, Read, Update, Delete)
- Set up a unified development workflow with concurrently
- Handle CORS, form validation, and error states
- Modern JavaScript patterns and React hooks

## 🚀 Features

### Interactive Tutorial
- **Step-by-step guidance** with progress tracking
- **Interactive quizzes** to test your understanding  
- **Code snippets** with one-click copying
- **Dark/Light mode** toggle
- **Progress persistence** across browser sessions
- **Responsive design** that works on all devices

### Final Project Stack
- **Frontend**: React (Vite) + Tailwind CSS + Axios
- **Backend**: Express.js + CORS + UUID
- **Development**: Concurrently + Nodemon for hot reload

## 📋 Prerequisites

- Node.js 18+ and npm (or pnpm/yarn)
- Basic knowledge of JavaScript (ES6+)
- Familiarity with React hooks (`useState`, `useEffect`)
- Command line basics

## 🏁 Getting Started

1. **Clone or download** this repository
2. **Open `tutorial.html`** in your web browser
3. **Follow the interactive tutorial** step by step
4. **Complete the quizzes** to reinforce your learning

That's it! The tutorial will guide you through creating a separate React+Express project from scratch.

## 📁 Project Structure

```
react_api_tutorial/
├── tutorial.html              # Main interactive tutorial
├── tutorial.css               # Styling with dark/light themes
├── tutorial.js                # Progress tracking and interactivity
├── tutorial_prompt.md         # Tutorial content in markdown
├── react_api_tutorial.code-workspace  # VS Code workspace
└── README.md                  # This file
```

## 🎨 Tutorial Highlights

### Modern Development Practices
- **Vite** instead of Create React App for faster builds
- **Tailwind CSS** for utility-first styling  
- **Express.js** with middleware for CORS and JSON parsing
- **Axios** for clean API integration
- **UUID** for unique identifiers

### Full-Stack Architecture
```
┌─────────────────┐    HTTP     ┌─────────────────┐
│   React App     │ ◄────────► │   Express API   │
│  (Port 5173)    │   Axios     │   (Port 4000)   │
│                 │             │                 │
│ • Tailwind CSS  │             │ • CORS enabled  │
│ • Form handling │             │ • JSON parsing  │
│ • State mgmt    │             │ • In-memory DB  │
└─────────────────┘             └─────────────────┘
```

## 🎓 Learning Path

1. **Project Setup** - Initialize React with Vite and Express server
2. **Backend API** - Build REST endpoints with Express
3. **Frontend Setup** - Configure React with Tailwind CSS  
4. **Components** - Create reusable React components
5. **Integration** - Connect frontend to backend with Axios
6. **Testing** - Manual API testing with curl

## 🔧 Advanced Features Covered

- **Error handling** and user feedback
- **Form validation** on both client and server
- **Optimistic UI updates** for better UX
- **Clean component architecture** with props
- **Modern async/await** patterns
- **CSS Grid** and **Flexbox** layouts

## 🚀 Bonus Ideas

The tutorial includes suggestions for extending the project:

- **Edit todos inline** with PUT requests
- **Filter todos** by status (All/Active/Completed)
- **Persist data** with MongoDB or PostgreSQL
- **Add authentication** with JWT tokens
- **Deploy** to production platforms

## 🤝 Contributing

This tutorial is designed to be educational and accessible. If you find issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## 📄 License

MIT License - feel free to use this tutorial for educational purposes.

---

**Ready to build your first full-stack React app?** Open `tutorial.html` and let's get started! 🎉