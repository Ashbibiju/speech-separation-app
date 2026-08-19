# Speech Separation App (Demucs AI)

A full-stack web application that separates speech from noisy audio using an AI model (Demucs).

## Features

- Upload audio files (WAV/MP3)
- AI-powered speech separation
- Removes noise (music, sirens, background sounds)
- Outputs clean speech
- Generates waveform and spectrogram visualization

## Tech Stack

### Backend
- Python (Flask)
- Demucs (AI model)
- Librosa, Torch, SciPy

### Frontend
- React.js
- CSS (custom styling)

## Project Structure

```
speech-separation-app/
│
├── app.py                # Flask backend API
├── process.py             # Speech separation logic (Demucs)
│
├── frontend files:
│   ├── App.jsx
│   ├── index.js
│   ├── index.html
│   ├── App.css
│   ├── index.css
│
├── uploads/                # Temporary uploaded files (ignored)
├── outputs/                # Processed results (ignored)
│
├── requirements.txt
├── README.md
```

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/Ashbibiju/speech-separation-app.git
cd speech-separation-app
```

### 2. Backend Setup

Create a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend:

```bash
python app.py
```

The server will start at:

```
http://localhost:5000
```

### 3. Frontend Setup

```bash
npm install
npm start
```

## API Endpoint

### POST `/process`

Upload an audio file for processing.

- **Input**: audio file
- **Output**:
  - Cleaned audio
  - Logs
  - Optional plot

## How It Works

The system uses the Demucs AI model to:

- Separate vocals (speech) from the input audio
- Remove all other sounds
- Apply post-processing for clarity

## Output

- Cleaned `.wav` file
- Visualization plot (waveform and spectrogram)

## Notes

- Processing may take 1–2 minutes on CPU
- GPU improves processing speed
- Larger files may take longer to process

## Author

Ashbibiju
