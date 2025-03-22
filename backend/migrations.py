from flask_migrate import Migrate
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///dev.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Import models after initializing db
from models import User, Resume, Context, ChatHistory

@app.cli.command("create-tables")
def create_tables():
    """Create all tables."""
    db.create_all()
    print("Tables created.")

@app.cli.command("drop-tables")
def drop_tables():
    """Drop all tables."""
    db.drop_all()
    print("Tables dropped.")

@app.cli.command("add-password-hash")
def add_password_hash_column():
    """Add password_hash column to users table."""
    # This is just a command to guide manual execution
    # The actual migration should be done via Flask-Migrate
    print("To add the password_hash column, run the following commands:")
    print("1. flask db init  # if migrations folder doesn't exist")
    print("2. flask db migrate -m 'Add password_hash column to users'")
    print("3. flask db upgrade")
    print("This will add the password_hash column to the users table.")

@app.cli.command("add-chat-history")
def add_chat_history_table():
    """Add chat_histories table for storing user chat logs."""
    print("To add the chat_histories table, run the following commands:")
    print("1. flask db migrate -m 'Add chat_histories table'")
    print("2. flask db upgrade")
    print("This will create the chat_histories table in the database.")

if __name__ == '__main__':
    app.run(debug=True) 