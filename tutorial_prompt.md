# Tutorial: Build a React ToDo App with a Modern Backend

## Objective

Build a full-stack "ToDo" application with a modern React frontend and a Node.js/Express backend API. By the end, you will have:
- A responsive React UI styled with Tailwind CSS
- A REST API built with Express (in-memory storage)
- Full CRUD operations (list, add, toggle complete, delete)
- A unified dev workflow to run frontend and backend concurrently

## Final App Preview
- View ToDos
- Add a ToDo
- Mark complete/incomplete
- Delete a ToDo

---

## Prerequisites
- Node.js 18+ and npm (or pnpm/yarn)
- Basic knowledge of JavaScript (ES6+), React hooks (`useState`, `useEffect`), and CLI

---

## Tech Choices and Project Structure
While earlier tutorials often used Create React App, modern best practice is to use Vite for faster dev and smaller builds. We'll use:
- React (via Vite) for the frontend
- Tailwind CSS for styling
- Express for the backend API
- Concurrently to run both servers together

Project structure (after setup):
```
react_api_tutorial/
  client/           # React (Vite)
  server/           # Express API
  package.json      # Root scripts to run both concurrently
  README.md         # Optional
```

---

## Step 1: Initialize the Project
From your workspace root, create the project and subprojects.

```bash
# Create project folder
mkdir -p react_api_tutorial && cd react_api_tutorial

# Initialize a root package.json to hold shared scripts
npm init -y

# Create React app (Vite)
npm create vite@latest client -- --template react

# Create backend folder
mkdir server && cd server
npm init -y
npm i express cors uuid
npm i -D nodemon

# Add server scripts
npm pkg set scripts.start="node index.js"
npm pkg set scripts.dev="nodemon --watch . --ext js,json --signal SIGINT index.js"
cd ..

# Add root dev script to run both servers together
npm i -D concurrently
npm pkg set scripts.dev="concurrently \"npm --prefix server run dev\" \"npm --prefix client run dev\""
```

---

## Step 2: Build the Express API (Backend)
Create `server/index.js` and implement an in-memory ToDo API.

```javascript
// server/index.js
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

/** In-memory store */
let todos = [
  { id: uuidv4(), text: 'Learn React', completed: false },
  { id: uuidv4(), text: 'Build a ToDo app', completed: true },
];

/** Routes */
// GET /api/todos - list all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// POST /api/todos - create a new todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Text is required' });
  }
  const newTodo = { id: uuidv4(), text: text.trim(), completed: false };
  todos.unshift(newTodo);
  res.status(201).json(newTodo);
});

// PUT /api/todos/:id - update a todo (toggle completed or edit text)
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });

  if (typeof text !== 'undefined') {
    const newText = String(text).trim();
    if (!newText) return res.status(400).json({ message: 'Text cannot be empty' });
    todos[idx].text = newText;
  }
  if (typeof completed !== 'undefined') {
    todos[idx].completed = Boolean(completed);
  }
  res.json(todos[idx]);
});

// DELETE /api/todos/:id - delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const before = todos.length;
  todos = todos.filter(t => t.id !== id);
  if (todos.length === before) return res.status(404).json({ message: 'Not found' });
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
```

Quick test with curl:
```bash
curl http://localhost:4000/api/todos | jq
```

---

## Step 3: Set Up React + Tailwind (Frontend)
Install dependencies and configure Tailwind.

```bash
cd client
npm i
npm i axios
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js` content paths:
```js
// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Replace `src/index.css` with Tailwind directives:
```css
/* client/src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Optional base styles */
:root { color-scheme: light dark; }
```

Ensure `src/main.jsx` imports the stylesheet (Vite template already does):
```jsx
// client/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## Step 4: Frontend API Helper and Components
Create a small API helper and three components: `AddTodoForm`, `TodoItem`, and `TodoList`.

API helper:
```javascript
// client/src/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

export async function fetchTodos() {
  const { data } = await api.get('/todos');
  return data;
}

export async function createTodo(text) {
  const { data } = await api.post('/todos', { text });
  return data;
}

export async function updateTodo(id, payload) {
  const { data } = await api.put(`/todos/${id}`, payload);
  return data;
}

export async function deleteTodo(id) {
  await api.delete(`/todos/${id}`);
}
```

AddTodoForm:
```jsx
// client/src/components/AddTodoForm.jsx
import { useState } from 'react';

export default function AddTodoForm({ onAdd }) {
  const [text, setText] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    await onAdd(text.trim());
    setText('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
        placeholder="Add a new task..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        type="submit"
        className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        Add
      </button>
    </form>
  );
}
```

TodoItem:
```jsx
// client/src/components/TodoItem.jsx
export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2 shadow-sm">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          className="h-4 w-4"
        />
        <span className={todo.completed ? 'line-through text-gray-400' : ''}>
          {todo.text}
        </span>
      </label>
      <button
        onClick={() => onDelete(todo)}
        className="rounded bg-rose-600 px-3 py-1 text-white hover:bg-rose-700"
      >
        Delete
      </button>
    </li>
  );
}
```

TodoList:
```jsx
// client/src/components/TodoList.jsx
import TodoItem from './TodoItem.jsx';

export default function TodoList({ todos, onToggle, onDelete }) {
  if (!todos.length) {
    return (
      <p className="text-center text-gray-500">No tasks yet. Add your first task above.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />)
      )}
    </ul>
  );
}
```

Update `App.jsx` to wire it all together:
```jsx
// client/src/App.jsx
import { useEffect, useState } from 'react';
import AddTodoForm from './components/AddTodoForm.jsx';
import TodoList from './components/TodoList.jsx';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api.js';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchTodos();
        if (!cancelled) setTodos(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load todos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function handleAdd(text) {
    try {
      const newTodo = await createTodo(text);
      setTodos(prev => [newTodo, ...prev]);
    } catch (err) {
      console.error(err);
      setError('Failed to add todo');
    }
  }

  async function handleToggle(todo) {
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });
      setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    } catch (err) {
      console.error(err);
      setError('Failed to update todo');
    }
  }

  async function handleDelete(todo) {
    try {
      await deleteTodo(todo.id);
      setTodos(prev => prev.filter(t => t.id !== todo.id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete todo');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-xl space-y-6 p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">ToDo</h1>
          <span className="text-sm text-gray-500">Full-stack demo</span>
        </header>

        <AddTodoForm onAdd={handleAdd} />

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && (
          <div className="rounded border border-amber-300 bg-amber-50 p-3 text-amber-700">
            {error}
          </div>
        )}

        <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
      </div>
    </div>
  );
}
```

---

## Step 5: Run Frontend and Backend Together
From the project root (`react_api_tutorial`):

```bash
# Terminal 1: start both via root script
npm run dev

# Alternatively, run separately in two terminals:
# Backend
npm --prefix server run dev
# Frontend
npm --prefix client run dev
```

- Express API: `http://localhost:4000`
- React app (Vite): typically `http://localhost:5173`

Open the React app and interact with ToDos. Network requests should hit the API.

---

## Step 6: Testing the API Manually (Optional)
Use curl to verify endpoints.

```bash
# List todos
curl -s http://localhost:4000/api/todos | jq

# Create todo
curl -s -X POST http://localhost:4000/api/todos \
  -H 'Content-Type: application/json' \
  -d '{"text":"Write documentation"}' | jq

# Toggle completion (replace ID)
curl -s -X PUT http://localhost:4000/api/todos/REPLACE_ID \
  -H 'Content-Type: application/json' \
  -d '{"completed": true}' | jq

# Delete todo (replace ID)
curl -s -X DELETE http://localhost:4000/api/todos/REPLACE_ID -i
```

---

## Styling Notes and Tailwind Tips
- Use `container mx-auto max-w-xl` for centered layouts
- Use `space-y-*` for vertical spacing between elements
- Use conditional classes for completed items (e.g., `line-through text-gray-400`)

---

## Common Pitfalls and Fixes
- CORS errors: Ensure `cors()` middleware is applied in Express and the frontend uses the correct base URL.
- Port conflicts: If 4000 or 5173 is in use, change ports or stop the conflicting process.
- Empty text validation: API returns 400 if `text` is missing/empty.

---

## Bonus Features (Ideas to Extend)
- Edit ToDos: Add an inline edit mode in `TodoItem` and send `PUT` with new `text`.
- Filters: Add local state/filter UI for All, Active, Completed.
- Persistence: Swap in-memory array for a database (e.g., MongoDB or PostgreSQL). With MongoDB, consider Mongoose models; with Postgres, consider Prisma.
- Auth: Add JWT login; scope todos by `userId`.

---

## Appendix: Express Endpoint Summary
- `GET /api/todos` → List all todos
- `POST /api/todos` → Create `{ text }`
- `PUT /api/todos/:id` → Update `{ text?, completed? }`
- `DELETE /api/todos/:id` → Remove a todo

You now have a complete, modern full-stack ToDo app. Experiment with the bonus features to continue learning!
