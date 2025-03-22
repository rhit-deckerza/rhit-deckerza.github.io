import os
import io
import zipfile
import PyPDF2
from docx import Document

MAX_FILE_SIZE_BYTES = 2_000_000  # ~2 MB
TEXT_EXTENSIONS = {
    ".txt", ".py", ".js", ".ts", ".jsx", ".tsx", ".html", ".htm", ".css",
    ".scss", ".c", ".cpp", ".h", ".hpp", ".java", ".cs", ".json", ".xml",
    ".yaml", ".yml", ".md", ".sh", ".rb", ".go", ".rs", ".php"
}

def read_text_file(file_bytes):
    try:
        text = file_bytes.decode("utf-8", errors="replace")
        return text.strip() if text else None
    except UnicodeDecodeError:
        try:
            text = file_bytes.decode("latin-1", errors="replace")
            return text.strip() if text else None
        except:
            return None

def extract_docx_text(file_bytes):
    f = io.BytesIO(file_bytes)
    document = Document(f)
    full_text = []
    for para in document.paragraphs:
        full_text.append(para.text)
    return "\n".join(full_text)

def extract_pdf_text(file_bytes):
    text = []
    with io.BytesIO(file_bytes) as pdf_buffer:
        reader = PyPDF2.PdfReader(pdf_buffer)
        for page_num in range(len(reader.pages)):
            page_text = reader.pages[page_num].extract_text()
            if page_text:
                text.append(page_text)
    return "\n".join(text)

def count_lines(text: str) -> int:
    if not text:
        return 0
    return len(text.splitlines())

def process_zip_and_generate_context(zip_file_path):
    output_lines = []
    structure_info = []

    with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
        zip_contents = zip_ref.infolist()
        zip_contents.sort(key=lambda x: x.filename)

        for item in zip_contents:
            depth = item.filename.count('/')
            indent = "  " * depth

            # We'll build a record for JSON
            item_record = {
                "filename": item.filename,
                "is_dir": item.is_dir(),
                "file_size": item.file_size,
                "line_count": 0,  # Initialize line count
                "omitted_due_to_size": False,
                "text_extracted": None,
                "note": "",
            }

            if item.is_dir():
                directory_note = f"{indent}Directory: {item.filename}"
                output_lines.append(directory_note)
                item_record["note"] = "Directory"
            else:
                file_note = f"{indent}File: {item.filename}"
                output_lines.append(file_note)

                if item.file_size > MAX_FILE_SIZE_BYTES:
                    size_note = f"{indent}  Omitted due to size ({item.file_size} bytes)."
                    output_lines.append(size_note)
                    item_record["omitted_due_to_size"] = True
                    item_record["note"] = f"Omitted due to size ({item.file_size} bytes)"
                    structure_info.append(item_record)
                    continue

                try:
                    file_bytes = zip_ref.read(item.filename)
                except Exception as e:
                    error_note = f"{indent}  Could not read file: {str(e)}"
                    output_lines.append(error_note)
                    item_record["note"] = f"Error reading file: {e}"
                    structure_info.append(item_record)
                    continue

                _, file_extension = os.path.splitext(item.filename)
                file_extension = file_extension.lower()

                extracted_text = None
                if file_extension in TEXT_EXTENSIONS:
                    extracted_text = read_text_file(file_bytes)
                elif file_extension == ".pdf":
                    try:
                        extracted_text = extract_pdf_text(file_bytes)
                    except Exception as e:
                        output_lines.append(f"{indent}  Failed to parse PDF: {str(e)}")
                        item_record["note"] = f"Failed to parse PDF: {str(e)}"
                elif file_extension == ".docx":
                    try:
                        extracted_text = extract_docx_text(file_bytes)
                    except Exception as e:
                        output_lines.append(f"{indent}  Failed to parse DOCX: {str(e)}")
                        item_record["note"] = f"Failed to parse DOCX: {str(e)}"

                if extracted_text:
                    item_record["line_count"] = count_lines(extracted_text)
                    item_record["text_extracted"] = extracted_text
                else:
                    item_record["note"] = "No text extracted (unsupported format or empty)."

            structure_info.append(item_record)

    summary_text = "\n".join(output_lines)
    return summary_text, structure_info
