from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os
import uuid
import sys
import io
import contextlib
import traceback

# Add current directory to path to import process
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route('/')
def health():
    return jsonify({"status": "Speech Separation API Running"})

@app.route('/process', methods=['POST'])
def process_audio():
    print("=" * 70)
    print("📥 RECEIVED UPLOAD REQUEST")
    print("=" * 70)
    
    try:
        if 'file' not in request.files:
            print("❌ ERROR: No file in request.files")
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']
        print(f"📄 File received: {file.filename}")
        
        if file.filename == '':
            print("❌ ERROR: Empty filename")
            return jsonify({"error": "No file selected"}), 400
        
        # Save uploaded file
        file_id = str(uuid.uuid4())[:8]
        input_path = os.path.join(UPLOAD_FOLDER, f"{file_id}_{file.filename}")
        output_path = os.path.join(OUTPUT_FOLDER, f"cleaned_{file_id}.wav")
        
        print(f"💾 Saving to: {input_path}")
        file.save(input_path)
        print(f"✅ File saved successfully")
        
        # Import process module here to catch import errors
        try:
            from process import speech_separation_demucs
            print("✅ Process module imported successfully")
        except Exception as import_err:
            print(f"❌ IMPORT ERROR: {str(import_err)}")
            traceback.print_exc()
            return jsonify({
                "success": False,
                "error": f"Failed to import processing module: {str(import_err)}"
            }), 500
        
        # Capture console output
        console_output = io.StringIO()
        logs_list = []
        
        print("🚀 STARTING PROCESSING...")
        
        with contextlib.redirect_stdout(console_output):
            try:
                # Call your exact function
                y_cleaned, sr, generated_plot = speech_separation_demucs(
                    input_path, 
                    output_file=output_path,
                    verbose=True,
                    show_plot=True
                )
                print("✅ Processing function completed")
            except Exception as proc_err:
                print(f"❌ PROCESSING ERROR: {str(proc_err)}")
                traceback.print_exc()
                raise proc_err
        
        logs = console_output.getvalue()
        print(f"📝 Logs captured: {len(logs)} characters")
        
        # Check if output file was created
        if not os.path.exists(output_path):
            print(f"❌ ERROR: Output file not created at {output_path}")
            return jsonify({
                "success": False,
                "error": "Processing failed - output file not created",
                "logs": logs
            }), 500
        
        print(f"✅ Output file created: {output_path}")
        
        # Check if plot was generated
        actual_plot_path = None
        if generated_plot and os.path.exists(generated_plot):
            # Move plot to outputs folder with correct name
            plot_filename = f"plot_{file_id}.png"
            plot_dest = os.path.join(OUTPUT_FOLDER, plot_filename)
            os.rename(generated_plot, plot_dest)
            actual_plot_path = f"/download/{plot_filename}"
            print(f"✅ Plot saved: {plot_dest}")
        
        # Cleanup input file
        if os.path.exists(input_path):
            os.remove(input_path)
            print(f"🗑️ Input file cleaned up")
        
        print("=" * 70)
        print("✅ REQUEST COMPLETED SUCCESSFULLY")
        print("=" * 70)
        
        return jsonify({
            "success": True,
            "message": "Processing complete",
            "logs": logs,
            "audio_url": f"/download/cleaned_{file_id}.wav",
            "plot_url": actual_plot_path,
            "file_id": file_id
        })
        
    except Exception as e:
        error_msg = str(e)
        error_trace = traceback.format_exc()
        print(f"❌ UNEXPECTED ERROR: {error_msg}")
        print(error_trace)
        
        # Cleanup on error
        try:
            if os.path.exists(input_path):
                os.remove(input_path)
        except:
            pass
        
        return jsonify({
            "success": False,
            "error": error_msg,
            "traceback": error_trace,
            "logs": console_output.getvalue() if 'console_output' in locals() else ""
        }), 500

@app.route('/download/<filename>')
def download_file(filename):
    file_path = os.path.join(OUTPUT_FOLDER, filename)
    print(f"📥 Download request: {filename}")
    
    if os.path.exists(file_path):
        print(f"✅ Serving file: {file_path}")
        return send_file(file_path, as_attachment=True)
    
    print(f"❌ File not found: {file_path}")
    return jsonify({"error": "File not found"}), 404

if __name__ == '__main__':
    print("🚀 Starting Speech Separation API...")
    print(f"📁 Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")
    print(f"📁 Output folder: {os.path.abspath(OUTPUT_FOLDER)}")
    app.run(debug=True, host='0.0.0.0', port=5000)