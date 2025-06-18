import React from 'react';
import './ContactHostModal.css';

const ContactHostModal = ({ host, onClose }) => {
  if (!host) return null;

  const handleWhatsAppClick = () => {
    const message = `Hello ${host.name}, I'm interested in your property.`;
    const whatsappUrl = `https://wa.me/${host.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailClick = () => {
    const subject = 'Inquiry about your property';
    const body = `Hello ${host.name},\n\nI'm interested in your property and would like to know more details.\n\nBest regards,`;
    const mailtoUrl = `mailto:${host.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleSMSClick = () => {
    const message = `Hello ${host.name}, I'm interested in your property.`;
    const smsUrl = `sms:${host.phone.replace(/\D/g, '')}?body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
  };

  const handleCallClick = () => {
    const callUrl = `tel:${host.phone.replace(/\D/g, '')}`;
    window.location.href = callUrl;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="host-contact-header">
          <img src={host.image} alt={host.name} className="host-contact-image" />
          <div className="host-contact-info">
            <h2>{host.name}</h2>
            <p className="host-status">{host.status}</p>
            <p className="member-since">Member since {host.memberSince}</p>
          </div>
        </div>

        <div className="contact-details">
          <div className="contact-section">
            <h3>Contact Information</h3>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <span>{host.phone}</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>{host.email}</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-clock"></i>
              <span>Response time: {host.responseTime}</span>
            </div>
          </div>

          <div className="contact-section">
            <h3>Languages Spoken</h3>
            <div className="languages-list">
              {host.languages.map((language, index) => (
                <span key={index} className="language-tag">{language}</span>
              ))}
            </div>
          </div>

          <div className="contact-section">
            <h3>Host Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{host.rating}</span>
                <span className="stat-label">Rating</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{host.reviews}</span>
                <span className="stat-label">Reviews</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{host.responseRate}%</span>
                <span className="stat-label">Response Rate</span>
              </div>
            </div>
          </div>

          <div className="contact-section">
            <h3>About the Host</h3>
            <p className="host-description">{host.description}</p>
          </div>
        </div>

        <div className="contact-actions">
          <div className="contact-buttons-grid">
            <button className="whatsapp-button" onClick={handleWhatsAppClick}>
              <i className="fab fa-whatsapp"></i> WhatsApp
            </button>
            <button className="sms-button" onClick={handleSMSClick}>
              <i className="fas fa-sms"></i> SMS
            </button>
            <button className="call-button" onClick={handleCallClick}>
              <i className="fas fa-phone"></i> Call
            </button>
            <button className="email-button" onClick={handleEmailClick}>
              <i className="fas fa-envelope"></i> Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactHostModal; 