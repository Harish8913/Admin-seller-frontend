# Admin-seller-frontend

# Frontend Project

A modern frontend application built with Node.js and npm.

---

# Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (Recommended: v18.x or later)
- **npm** (Comes with Node.js)
- **Server is running**

Verify your installation:

```bash
node -v
npm -v
```

---

# Getting Started

Follow the steps below to set up the project on your local machine.

---

## 1. Clone the Repository

```bash
git clone <repository-url>
```

Navigate into the project directory:

```bash
cd <project-folder>
```

Example:

```bash
git clone https://github.com/your-org/frontend.git

cd frontend
```

---

## 2. Install Dependencies

Install all required packages:

```bash
npm install
```

or

```bash
npm i
```

This command downloads all dependencies listed in `package.json`.

---

> **Note:** If your project does not require environment variables, you can skip this step.

---

# Running the Development Server

Start the local development server:

```bash
npm run dev
```

Once started, open your browser and navigate to:

```
http://localhost:5173
```

(or the URL displayed in the terminal)

The application supports:

- Hot Module Replacement (HMR)
- Automatic reload on file changes
- Fast development builds

To stop the development server:

```
CTRL + C
```

---

# Building for Production

Generate an optimized production build:

```bash
npm run build
```

This command:

- Optimizes the application
- Minifies JavaScript
- Compresses assets
- Creates the production build

The generated files will be available inside:

```
dist/
```

---

# Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

This serves the contents of the `dist` folder locally.

---

# Available Scripts

| Command | Description |
|----------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Create production build |

---

# Troubleshooting

## Dependencies are not installing

Delete the existing dependencies and reinstall:

```bash
rm -rf node_modules
rm package-lock.json

npm install
```

---

## Development server is not starting

Verify:

- Node.js version is compatible.
- Dependencies are installed.
- The required port is not already in use.

---

## Build fails

Try the following:

```bash
npm install

npm run build
```

If the issue persists:

- Check TypeScript/JavaScript errors.
- Check ESLint errors.

---

# Coding Guidelines

- Follow the existing project structure.
- Use meaningful component names.
- Keep components reusable.
- Write clean and readable code.
- Run lint checks before committing changes.

---

# Git Workflow

Before pushing your changes:

```bash
git pull origin <branch-name>

git checkout -b feature/<feature-name>

git add .

git commit -m "Add feature"

git push origin feature/<feature-name>
```

Create a Pull Request after pushing your branch.

---

# Additional Notes

- Always pull the latest changes before starting new work.
- Never commit sensitive information such as API keys or secrets.
- Do not commit the `.env` file unless explicitly required.
- Ensure the project builds successfully before creating a Pull Request.

---

# Tech Stack

- React
- Vite
- JavaScript / TypeScript
- npm
- ESLint

---

## Quick Start

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project
cd <project-folder>

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build


You're now ready to start developing! 🚀
