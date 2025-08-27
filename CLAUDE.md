# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack React ToDo tutorial project that demonstrates modern web development practices using:

- **Frontend**: Interactive HTML tutorial with JavaScript for progress tracking, dark mode, and quiz functionality
- **Tutorial Content**: Complete tutorial for building a React + Express ToDo app with:
  - React (Vite) frontend with Tailwind CSS
  - Express.js API backend with in-memory storage
  - Full CRUD operations for todo management

## Project Structure

```
react_api_tutorial/
├── tutorial.html          # Main tutorial webpage with interactive elements
├── tutorial.css           # Styling with CSS custom properties (light/dark theme)
├── tutorial.js            # Tutorial interactivity (progress tracking, quizzes, dark mode)
├── tutorial_prompt.md     # Tutorial content in markdown format
├── react_api_tutorial.code-workspace  # VS Code workspace configuration
```

## Key Features

### Tutorial Website (`tutorial.html`)
- Interactive step-by-step tutorial with progress tracking
- Dark/light mode toggle with localStorage persistence  
- Quiz questions with validation and progress tracking
- Code copying functionality for tutorial snippets
- Responsive design with sidebar navigation

### Tutorial Content Architecture
- **Step-by-step sections**: Each with completion checkboxes
- **Interactive quizzes**: Multiple choice questions with immediate feedback
- **Problem sections**: Short answer validation against expected responses
- **Progress tracking**: localStorage-based state management across browser sessions

## Tutorial Stack Information

The tutorial teaches building:
- **Frontend**: React (via Vite) + Tailwind CSS + Axios for API calls
- **Backend**: Express.js + CORS + UUID for todo management
- **Development**: Concurrently for running both servers, Nodemon for backend auto-reload

## Code Conventions

- Uses CSS custom properties for theming in `:root` and `.light` selectors
- JavaScript uses IIFE pattern with localStorage-based state management
- HTML uses semantic structure with ARIA attributes for accessibility
- Responsive CSS Grid layout (sidebar + main content)

## Running the Tutorial

Since this is a static tutorial website, simply open `tutorial.html` in a browser to view the interactive tutorial. The tutorial teaches users how to build a separate React+Express project.