import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Sparkles, Music, Volume2, ArrowRight, Waves } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Mic size={32} />,
      title: "AI-Powered Separation",
      desc: "Uses Demucs state-of-the-art model",
      color: "#ffe6f0"
    },
    {
      icon: <Volume2 size={32} />,
      title: "Remove All Noise",
      desc: "Horns, sirens, music, dogs, drilling",
      color: "#e6fff0"
    },
    {
      icon: <Music size={32} />,
      title: "Preserve Speech",
      desc: "100% natural conversation kept",
      color: "#e8f4f8"
    },
    {
      icon: <Sparkles size={32} />,
      title: "No Artifacts",
      desc: "Clean, natural sounding results",
      color: "#f0ffe6"
    }
  ];

  return (
    <div className="landing-page">
      <section className="hero">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
        
        <div className="hero-content">
          <div className="badge">
            <Waves size={16} />
            <span>Demucs AI</span>
          </div>
          
          <h1 className="hero-title">
            Separate Speech from
            <span className="gradient-text"> Any Noise</span>
          </h1>
          
          <p className="hero-subtitle">
            Upload your audio and let our AI isolate crystal-clear speech 
            while removing background music, traffic, sirens, and more.
          </p>
          
          <button className="cta-button" onClick={() => navigate('/app')}>
            <span>Start Separating</span>
            <ArrowRight size={20} />
          </button>
        </div>
        
        <div className="hero-visual">
          <div className="audio-card original">
            <div className="waveform-preview noisy">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
            <span className="label">Original + Noise</span>
          </div>
          
          <div className="arrow-divider">→</div>
          
          <div className="audio-card cleaned">
            <div className="waveform-preview clean">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
            <span className="label">Clean Speech</span>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">How It Works</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ backgroundColor: feature.color }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="steps-section">
        <h2 className="section-title">Simple 3-Step Process</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number" style={{ background: '#ffe6f0' }}>1</div>
            <h3>Upload Audio</h3>
            <p>Drag & drop or select your audio file</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number" style={{ background: '#e8f4f8' }}>2</div>
            <h3>AI Processing</h3>
            <p>Demucs separates speech from noise</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number" style={{ background: '#e6fff0' }}>3</div>
            <h3>Download Clean</h3>
            <p>Get your isolated speech audio</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>Powered by Demucs AI • Built with React & Flask</p>
      </footer>
    </div>
  );
};

export default LandingPage;