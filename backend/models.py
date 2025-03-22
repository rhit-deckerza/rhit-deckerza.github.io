from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid
import json
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

def generate_uuid():
    return str(uuid.uuid4())

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=True)  # Nullable for backward compatibility
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    resumes = db.relationship('Resume', backref='user', lazy=True, cascade='all, delete-orphan')
    contexts = db.relationship('Context', backref='user', lazy=True, cascade='all, delete-orphan')
    
    @property
    def password(self):
        # Password getter should raise an error
        raise AttributeError('password is not a readable attribute')
    
    @password.setter
    def password(self, password):
        # Hash password when it's set
        self.password_hash = generate_password_hash(password)
    
    def verify_password(self, password):
        # Return True if password matches the hash
        if self.password_hash:
            return check_password_hash(self.password_hash, password)
        return False
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }

class Resume(db.Model):
    __tablename__ = 'resumes'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)  # JSON string of resume data
    version = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def set_content(self, content_dict):
        self.content = json.dumps(content_dict)
    
    def get_content(self):
        return json.loads(self.content)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'content': self.get_content(),
            'version': self.version,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Context(db.Model):
    __tablename__ = 'contexts'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    summary = db.Column(db.Text, nullable=True)  # Text summary of context
    structure = db.Column(db.Text, nullable=True)  # JSON string of file structure
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_structure(self, structure_dict):
        self.structure = json.dumps(structure_dict)
    
    def get_structure(self):
        if self.structure:
            return json.loads(self.structure)
        return None
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'summary': self.summary,
            'structure': self.get_structure(),
            'created_at': self.created_at.isoformat()
        } 