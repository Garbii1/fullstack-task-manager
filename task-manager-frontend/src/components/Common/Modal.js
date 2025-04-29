// src/components/Common/Modal.js
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css'; // We'll create this CSS file next

// Get the element to mount the portal into (or create one)
const modalRoot = document.getElementById('modal-root') || document.createElement('div');
if (!document.getElementById('modal-root')) {
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
}

function Modal({ isOpen, onClose, title, children }) {

    // Effect to handle Escape key press for closing the modal
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose(); // Call the onClose prop function
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Optional: Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        // Cleanup function
        return () => {
            document.removeEventListener('keydown', handleEscape);
             // Restore body scroll
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]); // Re-run effect if isOpen or onClose changes

    // Don't render anything if the modal is not open
    if (!isOpen) {
        return null;
    }

    // Render the modal using a portal
    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose} role="presentation">
            {/* Stop propagation prevents closing modal when clicking inside the content */}
            <div className="modal-container" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div className="modal-header">
                     {/* Use the title prop for the h2, provide accessible id */}
                     {title && <h2 id="modal-title" className="modal-title">{title}</h2>}
                    <button
                        onClick={onClose}
                        className="modal-close-btn"
                        aria-label="Close modal" // Accessibility label
                    >
                        × {/* Simple 'X' character */}
                    </button>
                </div>
                <div className="modal-content">
                    {children} {/* Render the content passed as children */}
                </div>
            </div>
        </div>,
        modalRoot // Mount the portal content into the modalRoot element
    );
}

export default Modal;