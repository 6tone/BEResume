import React, { useState, useEffect } from 'react';
import { resumeData } from './data/resumeData';
import { personalInfo } from './data/personalInfo';
import ExperienceSection from './components/ExperienceSection';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="resume-layout-container">
      {/* Premium Classic Header */}
      <header className="resume-header">
        <div className="header-meta-left">
          <h1 className="user-name">{personalInfo.name || personalInfo.title}</h1>
          {personalInfo.name && personalInfo.title && (
            <h2 className="user-title" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>
              {personalInfo.title}
            </h2>
          )}
          <p className="user-subtitle">
            <span className="status-indicator"></span>
            Uptime: {resumeData.systemInfo.uptime} | {personalInfo.location || resumeData.systemInfo.location}
          </p>
        </div>

        <div className="header-meta-right">
          <div className="contact-ports">
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="contact-port-link">
                <span className="port-label">EMAIL</span> {personalInfo.email}
              </a>
            )}
            {personalInfo.github && (
              <a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="contact-port-link">
                <span className="port-label">GITHUB</span> {personalInfo.github}
              </a>
            )}
          </div>

          <button className="theme-switcher-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? (
              <span>🌙 DARK_MODE</span>
            ) : (
              <span>☀️ LIGHT_MODE</span>
            )}
          </button>
        </div>
      </header>

      {/* Main Grid: Left (70%) and Right (30%) columns */}
      <div className="resume-grid">
        {/* Left Column - Main Details */}
        <main className="resume-main-col">
          {/* Section 01: Summary */}
          <section className="classic-section">
            <h3 className="classic-section-title">個人簡介 (System Overview)</h3>
            <p className="classic-overview-text">{resumeData.overview.summary}</p>
          </section>

          {/* Section 02: Work Experience */}
          <section className="classic-section">
            <h3 className="classic-section-title">工作經歷 (Execution History)</h3>
            <ExperienceSection experience={resumeData.experience} />
          </section>
        </main>

        {/* Right Column - Side Parameters */}
        <aside className="resume-side-col">
          {/* Section 03: Skills Specifications */}
          <section className="classic-section">
            <h3 className="classic-section-title">技術規格 (Skills)</h3>
            <div className="skills-stack-list">
              {resumeData.skills.categories.map((category, idx) => (
                <div key={idx} className="side-skill-card">
                  <h5>{category.name.split(' (')[0]}</h5>
                  <div className="side-tag-list">
                    {category.items.map((item, itemIdx) => (
                      <span key={itemIdx} className="side-tag-chip">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 04: Automation Tools */}
          <section className="classic-section">
            <h3 className="classic-section-title">自動化與輔助系統</h3>
            <div className="side-tools-list">
              {resumeData.automationTools.tools.map((tool, idx) => (
                <div key={idx} className="side-tool-card">
                  <h6>{tool.name}</h6>
                  <p className="tool-desc-short">{tool.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {/* Footer */}
      <footer className="resume-footer">
        <div className="footer-left">
          <span className="footer-copy">
            © {new Date().getFullYear()} {personalInfo.name || '後端工程師'} · Built with React
          </span>
        </div>
        <div className="footer-actions">
          {personalInfo.github && (
            <a
              href={`https://${personalInfo.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link-btn github-btn"
            >
              <span className="footer-btn-icon">⌥</span> GitHub
            </a>
          )}
          <button
            className="footer-link-btn print-btn"
            onClick={() => window.print()}
            aria-label="列印 / 下載 PDF"
          >
            <span className="footer-btn-icon">⎙</span> 下載 PDF
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
