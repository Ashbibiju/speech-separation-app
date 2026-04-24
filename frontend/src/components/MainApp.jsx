import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Upload, Download, Play, Pause, Loader2, ArrowLeft, Volume2, Mic, SkipBack, SkipForward } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MainApp.css';

const AudioPlayer = ({ src, label, color, fileName }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleCanPlay = () => setIsLoaded(true);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);

    audio.load();

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolume = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const vol = parseFloat(e.target.value);
    audio.volume = vol;
    setVolume(vol);
  };

  const skip = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
  };

  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player-wrapper" style={{ borderColor: color }}>
      <div className="player-label" style={{ background: color }}>
        {label}
        {fileName && <span className="file-name"> - {fileName}</span>}
      </div>
      
      <audio ref={audioRef} src={src} preload="auto" />
      
      <div className="player-controls">
        <button className="control-btn skip" onClick={() => skip(-10)} disabled={!isLoaded}>
          <SkipBack size={20} />
        </button>
        
        <button 
          className="control-btn play-pause" 
          onClick={togglePlay}
          style={{ background: color, opacity: isLoaded ? 1 : 0.5 }}
          disabled={!isLoaded}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        
        <button className="control-btn skip" onClick={() => skip(10)} disabled={!isLoaded}>
          <SkipForward size={20} />
        </button>
      </div>

      <div className="seek-container">
        <span className="time-display">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="seek-slider"
          disabled={!isLoaded}
          style={{ 
            background: `linear-gradient(to right, ${color} 0%, ${color} ${progressPercent}%, #e0e0e0 ${progressPercent}%, #e0e0e0 100%)`
          }}
        />
        <span className="time-display">{formatTime(duration)}</span>
      </div>

      <div className="volume-container">
        <Volume2 size={16} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolume}
          className="volume-slider"
        />
      </div>

      {!isLoaded && <div className="loading-indicator">Loading audio...</div>}

      {label.includes("Cleaned") && (
        <a href={src} download className="download-btn-player">
          <Download size={16} />
          <span>Download</span>
        </a>
      )}
    </div>
  );
};

const MainApp = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const audioFile = acceptedFiles[0];
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      setFile(audioFile);
      setOriginalUrl(url);
      setResult(null);
      setError(null);
      setLogs([]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': ['.wav', '.mp3', '.m4a', '.ogg', '.flac'] },
    multiple: false
  });

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    setLogs(['📤 Uploading audio...']);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/process', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000
      });

      if (response.data.success) {
        setResult(response.data);
        setLogs(prev => [...prev, '✅ Processing complete!', ...response.data.logs.split('\n')]);
      } else {
        throw new Error(response.data.error);
      }
    } catch (err) {
      setError(err.message || 'Processing failed');
      setLogs(prev => [...prev, `❌ Error: ${err.message}`]);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
    };
  }, [originalUrl]);

  return (
    <div className="main-app">
      <header className="app-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <div className="app-title">
          <Mic size={24} />
          <span>Speech Separation</span>
        </div>
        <div className="spacer"></div>
      </header>

      <div className="app-container">
        <div className="upload-section">
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}>
            <input {...getInputProps()} />
            <div className="dropzone-content">
              {file ? (
                <>
                  <Volume2 size={48} color="#a8e6cf" />
                  <p className="filename">{file.name}</p>
                  <span className="filesize">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </>
              ) : (
                <>
                  <Upload size={48} color="#ffd6e7" />
                  <p>Drop audio here or click to browse</p>
                  <span className="formats">WAV, MP3, M4A, OGG, FLAC</span>
                </>
              )}
            </div>
          </div>

          {file && !processing && !result && (
            <button className="process-btn" onClick={handleProcess}>
              <span>✨ Separate Speech</span>
            </button>
          )}
        </div>

        {processing && (
          <div className="processing-card">
            <div className="processing-header">
              <Loader2 className="spinner" size={24} />
              <h3>AI Processing...</h3>
            </div>
            <div className="console-logs">
              {logs.map((log, i) => <div key={i} className="log-line">{log}</div>)}
              <div className="typing-indicator">▋</div>
            </div>
          </div>
        )}

        {error && <div className="error-card"><p>❌ {error}</p></div>}

        {result && (
          <div className="results-card">
            <div className="results-header">
              <div className="success-badge">✅ Separation Complete</div>
            </div>

            <div className="audio-comparison">
              <AudioPlayer 
                src={originalUrl}
                label="Original Audio"
                color="#ffd6e7"
                fileName={file?.name}
              />
              <AudioPlayer 
                src={`http://localhost:5000${result.audio_url}`}
                label="Cleaned Speech"
                color="#a8e6cf"
              />
            </div>

            {result.plot_url && (
              <div className="visualization-card">
                <h4>📊 Analysis Visualization</h4>
                <img src={`http://localhost:5000${result.plot_url}`} alt="Analysis" />
              </div>
            )}

            <div className="full-logs">
              <h4>📝 Processing Logs</h4>
              <pre>{result.logs}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainApp;