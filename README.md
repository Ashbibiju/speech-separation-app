# 🎧 Speech Separation App (Demucs AI)

This project is a full-stack web application that separates speech from noisy audio using an AI model (Demucs).

## 🚀 Features
- Upload audio files (wav/mp3)
- AI-powered speech separation
- Removes noise (music, sirens, background sounds)
- Outputs clean speech
- Generates waveform + spectrogram visualization

---

## 🧱 Tech Stack

### Backend
- Python (Flask)
- Demucs (AI model)
- Librosa, Torch, Scipy

### Frontend
- React.js
- CSS (custom styling)

---

## 📂 Project Structure
speech-separation-app/
│
├── app.py # Flask backend API
├── process.py # Speech separation logic (Demucs)
│
├── frontend files:
│ ├── App.jsx
│ ├── index.js
│ ├── index.html
│ ├── App.css
│ ├── index.css
│
├── uploads/ # Temporary uploaded files (ignored)
├── outputs/ # Processed results (ignored)
│
├── requirements.txt
├── README.md

---

## ⚙️ Setup Instructions

### 1. Clone repository


git clone https://github.com/Ashbibiju/speech-separation-app.git

cd speech-separation-app


---

### 2. Backend Setup

Create virtual environment:


python3 -m venv venv
source venv/bin/activate


Install dependencies:


pip install -r requirements.txt


Run backend:


python app.py


Server will start at:

http://localhost:5000


---

### 3. Frontend Setup


npm install
npm start


---

## 📡 API Endpoint

### POST `/process`

Upload audio file:

- Input: audio file
- Output:
  - cleaned audio
  - logs
  - optional plot

---

## 🧠 How It Works

The system uses **Demucs AI model** to:
- Separate vocals (speech)
- Remove all other sounds
- Apply post-processing for clarity

---

## 📸 Output

- Cleaned `.wav` file
- Visualization plot (waveform + spectrogram)

---

## ⚠️ Notes

- Processing may take 1–2 minutes (CPU)
- GPU improves speed
- Large files may take longer

---

## 👨‍💻 Author

Ashbibiju
