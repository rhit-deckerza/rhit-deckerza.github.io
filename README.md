# Resume Builder with Chat State Persistence

This project provides a resume builder web application with chat assistant functionality and state persistence across sessions.

## Features

- Resume creation and editing with JSON input
- AI-powered assistant to help with resume editing and questions
- User authentication system (registration and login)
- Chat state persistence across sessions for logged-in users
- Auto-saving functionality
- Multiple resume versions support

## Frontend Setup

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the project root with the following variables:

```
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_OPENAI_API_ENDPOINT=https://api.openai.com/v1/chat/completions
VITE_API_URL=http://localhost:8080
```

5. Start the development server:

```bash
npm run dev
```

## Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install backend dependencies:

```bash
pip install -r requirements.txt
```

3. Initialize and migrate the database:

```bash
export FLASK_APP=app.py
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

4. Start the backend server:

```bash
flask run --host=0.0.0.0 --port=8080
```

## Using Chat State Persistence

1. Register a new account or log in with existing credentials:
   - Click the "Login to Save Online" button in the top-right corner
   - Enter email and password
   - Click "Login" or "Sign Up"

2. Once logged in, any chat messages in the AI assistant panel will automatically be saved to your account on the server.

3. Chat state will be preserved even if you:
   - Close the browser and return later
   - Log in from a different device
   - Switch between resume versions

4. The system provides a fallback to localStorage if there are server issues, ensuring your chat history is always preserved.

## Deployment

The application is configured for deployment on Fly.io. Make sure to set the appropriate environment variables for the production environment.

## API Documentation

### Chat History Endpoints

- `GET /api/chat/:resumeId` - Get chat history for a specific resume
- `POST /api/chat/:resumeId` - Save chat history for a specific resume

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user account
- `POST /api/auth/login` - Log in with existing credentials
- `GET /api/user` - Get current user information (requires authentication)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Resume Builder with AI Assistant

This application provides a professional resume builder with AI assistance. It allows you to create, edit, and download your resume in PDF format.

## Features

- **JSON Resume Editor**: Edit your resume in JSON format with syntax highlighting and error detection
- **Real-time Preview**: See changes reflected immediately in a professional resume layout
- **AI Resume Assistant**: Get suggestions and improvements for your resume through natural language interaction
- **Context File Upload**: Upload additional files like job descriptions to provide context for AI suggestions
- **Diff View**: Review AI suggestions side-by-side with your current resume before applying changes
- **PDF Export**: Download your resume as a professionally formatted PDF
- **Dark Mode**: Toggle between light and dark editor themes for comfortable editing

## Setup and Configuration

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file based on `.env.example` and add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_OPENAI_API_ENDPOINT=https://api.openai.com/v1/chat/completions
   ```
4. Start the development server with `npm run dev`

## Using Context Files

The Resume Builder allows you to upload context files that can help the AI provide better suggestions:

1. Click the "Upload File" button in the JSON Editor section
2. Select one or more text files (like job descriptions, cover letters, etc.)
3. Toggle file inclusion with the visibility icon
4. Remove files with the delete icon
5. Files will be included in AI prompts when you ask for resume improvements

Maximum file size: 5MB per file

## AI Integration

The app uses OpenAI's API to analyze and suggest improvements to your resume. The AI can:
- Add more impactful bullet points
- Improve wording and structure
- Organize skills and experiences
- Provide tailored suggestions based on your resume content

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
