from flask import Flask, request, jsonify, send_from_directory, make_response
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
import uuid
import tempfile
import zipfile
import shutil
from werkzeug.utils import secure_filename
import requests
from dotenv import load_dotenv

import zip_context_script

# Base directory for all file operations
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
# Create output directory if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

app = Flask(__name__)
CORS(app, 
     resources={r"/*": {"origins": ["http://localhost:5173", "https://zacharydecker.com"]}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Modify the rate limiter to exempt OPTIONS requests
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["100 per minute"]
)

# Load environment variables from .env file
load_dotenv()

# Get OpenAI API key from environment variable
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# Routes
@app.route('/upload-zip', methods=['POST'])
@limiter.limit("10 per minute")  # Limit uploads to 10 per minute per IP
def upload_zip():
    """
    Endpoint to upload and process a zip file.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # Create temp directory
    temp_dir = tempfile.mkdtemp()
    zip_path = os.path.join(temp_dir, secure_filename(file.filename))
    
    try:
        file.save(zip_path)
        
        # Check if it's a valid zip
        try:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                # Extract to a subdirectory
                extract_dir = os.path.join(temp_dir, "extracted")
                os.makedirs(extract_dir, exist_ok=True)
                zip_ref.extractall(extract_dir)
        except zipfile.BadZipFile:
            return jsonify({"error": "Invalid ZIP file"}), 400
        
        # Process the extracted files
        download_id = str(uuid.uuid4())
        summary_text, structure_info = zip_context_script.process_zip_and_generate_context(zip_path)
        
        # Save the summary text to a file
        output_filename = f"context_summary_{download_id}.txt"
        with open(os.path.join(OUTPUT_DIR, output_filename), "w", encoding="utf-8") as f:
            f.write(summary_text)
        
        return jsonify({
            "downloadId": download_id,
            "structure": structure_info,
            "message": "File processed successfully"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)

@app.route("/download-context/<download_id>", methods=["GET"])
@limiter.limit("30 per minute")  # Limit downloads to 30 per minute per IP
def download_context(download_id):
    """
    Endpoint to download the summary text file by the given ID.
    """
    output_filename = f"context_summary_{download_id}.txt"
    
    if os.path.exists(os.path.join(OUTPUT_DIR, output_filename)):
        return send_from_directory(OUTPUT_DIR, output_filename, as_attachment=True)
    else:
        return jsonify({"error": "File not found"}), 404

@app.route('/api/openai-proxy', methods=['POST'])
@limiter.limit("30 per minute")  # Adjust rate limits as needed
def openai_proxy():
    """
    Proxy endpoint for OpenAI API calls to keep API key on server side
    """
    if not OPENAI_API_KEY:
        return jsonify({"error": "OpenAI API key not configured on server"}), 500
        
    try:
        # Get request data
        request_data = request.json
        
        # Forward the request to OpenAI API
        openai_response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {OPENAI_API_KEY}"
            },
            json=request_data
        )
        
        # Return OpenAI's response directly
        return openai_response.json(), openai_response.status_code
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/extract-text', methods=['POST', 'OPTIONS'])
@limiter.limit("20 per minute")  # Limit uploads to 20 per minute per IP
def extract_text():
    """
    Endpoint to extract text from a single file using the same utilities as the zip context script
    """
    # Handle OPTIONS request explicitly
    if request.method == 'OPTIONS':
        return '', 200
        
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # Create temp directory
    temp_dir = tempfile.mkdtemp()
    file_path = os.path.join(temp_dir, secure_filename(file.filename))
    
    try:
        file.save(file_path)
        
        # Get file extension and determine processing method
        _, file_extension = os.path.splitext(file.filename)
        file_extension = file_extension.lower()
        
        file_bytes = open(file_path, 'rb').read()
        extracted_text = None
        note = "No text extracted (unsupported format or empty)"
        
        # Use the same extraction logic from zip_context_script
        if file_extension in zip_context_script.TEXT_EXTENSIONS:
            extracted_text = zip_context_script.read_text_file(file_bytes)
        elif file_extension == ".pdf":
            try:
                extracted_text = zip_context_script.extract_pdf_text(file_bytes)
            except Exception as e:
                note = f"Failed to parse PDF: {str(e)}"
        elif file_extension == ".docx":
            try:
                extracted_text = zip_context_script.extract_docx_text(file_bytes)
            except Exception as e:
                note = f"Failed to parse DOCX: {str(e)}"
        
        # Prepare the response
        result = {
            "filename": file.filename,
            "file_size": os.path.getsize(file_path),
            "line_count": zip_context_script.count_lines(extracted_text) if extracted_text else 0,
            "text_extracted": extracted_text,
            "note": note
        }
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)

# Add a global OPTIONS handler
@app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
@app.route('/<path:path>', methods=['OPTIONS'])
def options_handler(path):
    # Flask-CORS will handle the CORS headers, we just need to return an empty response
    return '', 200

@app.after_request
def after_request(response):
    # Let Flask-CORS handle the CORS headers
    return response

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)
