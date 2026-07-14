import React from 'react';

function ExperienceSection({ experience }) {
  return (
    <div className="experience-timeline">
      {experience.jobs.map((job, jobIdx) => (
        <div key={jobIdx} className="timeline-job-block">
          <div className="timeline-badge"></div>
          
          <div className="job-info-header">
            <h4 className="timeline-company">{job.company}</h4>
            <div className="timeline-meta">
              <span className="timeline-role">{job.role}</span>
              <span className="timeline-period">{job.period}</span>
            </div>
          </div>

          <div className="job-details-content">
            {/* Tech Stack Banner */}
            {job.techStack && (
              <div className="job-tech-stack">
                <span className="tech-stack-label">技術開發棧:</span> {job.techStack}
              </div>
            )}

            {/* Bullets List */}
            <ul className="job-bullets-list">
              {job.bullets.map((bullet, bulletIdx) => (
                <li key={bulletIdx} className="job-bullet-item">{bullet}</li>
              ))}
            </ul>

            {/* Video Demo (Optional) */}
            {job.videoDemo && (
              <div className="project-video-container">
                <div className="video-label-row">
                  <span className="spec-label video-label">🎬 成品展示 (Demo Video)</span>
                  <a
                    href={job.videoDemo.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-open-link"
                  >
                    ↗ 在新分頁開啟
                  </a>
                </div>
                <div className="video-embed-wrapper">
                  <iframe
                    src={job.videoDemo.embedUrl}
                    title={job.videoDemo.label}
                    allow="autoplay"
                    allowFullScreen
                    className="video-embed-frame"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Job Level Store Links (Optional) */}
            {job.links && job.links.length > 0 && (
              <div className="project-links-container">
                <span className="links-label">專案連結:</span>
                <div className="store-links">
                  {job.links.map((link, linkIdx) => (
                    <a
                      key={linkIdx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`store-badge-classic ${link.platform}`}
                    >
                      {link.platform === 'android' ? (
                        <span>▶ {link.label}</span>
                      ) : link.platform === 'ios' ? (
                        <span>🍎 {link.label}</span>
                      ) : (
                        <span>🌐 {link.label}</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExperienceSection;
