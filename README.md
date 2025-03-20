# Resume Builder with AI Assistant

This application provides a professional resume builder with AI assistance. It allows you to create, edit, and download your resume in PDF format.

## Features

- Edit resume content in JSON format with real-time preview
- Chat with an AI assistant for resume improvement suggestions
- Download your resume as a PDF
- Format bullet points with bold text

## Text Formatting

You can add bold text to your resume bullet points by using double asterisks `**` around the text you want to emphasize.

Example:

```json
"bullets": [
  "Developed a **scalable web application** using React and Node.js.",
  "Increased team productivity by **35%** through implementation of CI/CD pipelines."
]
```

This will render as:
- Developed a **scalable web application** using React and Node.js.
- Increased team productivity by **35%** through implementation of CI/CD pipelines.

## Development

This project is built with React and Vite. To run the development server:

```bash
npm install
npm run dev
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
