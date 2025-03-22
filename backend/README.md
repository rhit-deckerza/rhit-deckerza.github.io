# Backend for Resume Builder

This backend provides REST API services for the Resume Builder application, featuring user authentication and context processing functionality.

## Features

- **User Authentication**: Register and login functionality with JWT-based authentication
- **Resume Data Management**: Store and retrieve resume data (future implementation)
- **Context Processing**: Upload and process ZIP files to generate context summaries

## Getting Started

### Prerequisites

- Python 3.7+
- Flask
- SQLAlchemy

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
pip install -r requirements.txt
```

### Setting up the Database

Initialize the database and apply migrations:

```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

Add the password field to existing database:

```bash
flask db migrate -m "Add password hash column"
flask db upgrade
```

### Running the Server

```bash
flask run --host=0.0.0.0 --port=8080
```

Or using Gunicorn for production:

```bash
gunicorn app:app
```

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new user
  - Request body: `{ "email": "user@example.com", "password": "securepassword" }`
  - Response: `{ "message": "User registered successfully!", "token": "jwt_token", "user": {...} }`

- **POST /api/auth/login**: Login with credentials
  - Request body: `{ "email": "user@example.com", "password": "securepassword" }`
  - Response: `{ "message": "Login successful!", "token": "jwt_token", "user": {...} }`

- **GET /api/user**: Get user profile (requires authentication)
  - Headers: `Authorization: Bearer jwt_token`
  - Response: `{ "user": {...} }`

### Context Processing

- **POST /upload-zip**: Upload a ZIP file for processing
  - Form data: `file` (ZIP file)
  - Response: `{ "download_id": "uuid", "message": "File processed successfully" }`

- **GET /download-context/<download_id>**: Download processed context
  - Response: Text file download

## Authentication Design

The authentication system uses JWT (JSON Web Tokens) for user authentication:

1. When a user registers or logs in, the server generates a JWT token containing the user's ID
2. This token is returned to the client, which stores it in localStorage
3. For subsequent authenticated requests, the client includes the token in the Authorization header
4. The server verifies the token and identifies the user before processing the request

### Security Considerations

- Passwords are securely hashed using Werkzeug's password hashing utilities
- JWTs expire after 30 days (configurable)
- Rate limiting is applied to authentication endpoints to prevent brute force attacks

## Deployment

The application is configured to be deployed on Fly.io. See the `fly.toml` and `Dockerfile` for deployment configuration.

### Environment Variables

- `SECRET_KEY`: JWT signing key (required in production)
- `DATABASE_URL`: Database connection string
- `PORT`: Port to run the server on

## Development

To run the application in development mode:

```bash
export FLASK_APP=app.py
export FLASK_ENV=development
flask run
``` 