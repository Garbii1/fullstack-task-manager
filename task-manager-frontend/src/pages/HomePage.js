// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // We'll create this CSS file next

function HomePage() {
  return (
    <div className="homepage-container">
      <header className="hero-section">
        <h1>Welcome to TaskMaster Pro</h1>
        <p className="subtitle">Organize your life, one task at a time.</p>
        <p>
          The ultimate solution for managing your personal and professional tasks
          efficiently. Stay organized, meet deadlines, and boost your productivity.
        </p>
        <div className="cta-buttons">
          <Link to="/register" className="btn btn-primary btn-lg">Get Started for Free</Link>
          <Link to="/login" className="btn btn-secondary btn-lg">Login</Link>
        </div>
      </header>

      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>✅ Task Management</h3>
            <p>Easily create, update, categorize, and delete your tasks.</p>
          </div>
          <div className="feature-item">
            <h3>🎨 Kanban Board</h3>
            <p>Visualize your workflow with a drag-and-drop Kanban interface.</p>
          </div>
          <div className="feature-item">
            <h3>📅 Calendar View</h3>
            <p>See your tasks and deadlines on an interactive calendar.</p>
          </div>
          <div className="feature-item">
            <h3>🚦 Priority & Status</h3>
            <p>Set priorities (High, Medium, Low) and track progress.</p>
          </div>
          <div className="feature-item">
            <h3>🔄 Real-time Sync</h3>
            <p>Updates happen instantly across all your logged-in devices.</p>
          </div>
          <div className="feature-item">
            <h3>🌙 Dark Mode</h3>
            <p>Switch between light and dark themes for comfortable viewing.</p>
          </div>
           <div className="feature-item">
            <h3>📱 Responsive Design</h3>
            <p>Works beautifully on desktop, tablet, and mobile devices.</p>
          </div>
           <div className="feature-item">
            <h3>🔒 Secure Authentication</h3>
            <p>Your tasks are private and protected with JWT authentication.</p>
          </div>
        </div>
      </section>

      <section className="final-cta-section">
        <h2>Ready to Get Organized?</h2>
        <Link to="/register" className="btn btn-primary btn-lg">Sign Up Now</Link>
      </section>
    </div>
  );
}

export default HomePage;