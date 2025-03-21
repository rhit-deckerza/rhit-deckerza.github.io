from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
import uuid
import tempfile
import zipfile
import shutil
from werkzeug.utils import secure_filename

import zip_context_script

# Base directory for all file operations
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
# Create output directory if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["100 per minute"]
)

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

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)
