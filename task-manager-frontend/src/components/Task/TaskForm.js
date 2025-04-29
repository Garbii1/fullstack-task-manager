import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { format } from 'date-fns'; // For formatting date input

// Define options arrays directly in the component or import from a config file
const CATEGORY_OPTIONS = ['Personal', 'Work', 'Hobby', 'Other'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];
const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Completed'];

function TaskForm({ onSubmitSuccess, initialData = null, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CATEGORY_OPTIONS[0], // Default category
    priority: PRIORITY_OPTIONS[1], // Default priority
    status: STATUS_OPTIONS[0],     // Default status
    deadline: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData; // Check if we are editing

  // Populate form if initialData is provided (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || CATEGORY_OPTIONS[0],
        priority: initialData.priority || PRIORITY_OPTIONS[1],
        status: initialData.status || STATUS_OPTIONS[0],
        // Format date for input type="date" (YYYY-MM-DD)
        deadline: initialData.deadline ? format(new Date(initialData.deadline), 'yyyy-MM-dd') : '',
      });
    } else {
        // Reset form when switching from edit to add mode
        setFormData({
            title: '', description: '', category: CATEGORY_OPTIONS[0],
            priority: PRIORITY_OPTIONS[1], status: STATUS_OPTIONS[0], deadline: '',
        });
    }
     setError(''); // Clear errors when initialData changes or form resets
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Task title is required.');
      return;
    }

    setLoading(true);

    // Prepare data for API (remove empty deadline if not set)
    const taskData = { ...formData };
    if (!taskData.deadline) {
      delete taskData.deadline; // Don't send empty string, let backend handle null/undefined
    }


    try {
      let response;
      if (isEditing) {
        // Update existing task
        response = await api.put(`/tasks/${initialData._id}`, taskData);
      } else {
        // Create new task
        response = await api.post('/tasks', taskData);
      }

      if (response.data.success) {
        onSubmitSuccess(response.data.data); // Pass the created/updated task back
         // Reset form only if creating, not editing (handled by useEffect for editing)
        if (!isEditing) {
            setFormData({
                title: '', description: '', category: CATEGORY_OPTIONS[0],
                priority: PRIORITY_OPTIONS[1], status: STATUS_OPTIONS[0], deadline: '',
            });
        }
      } else {
        setError(response.data.message || `Failed to ${isEditing ? 'update' : 'create'} task.`);
      }
    } catch (err) {
      console.error('Task form error:', err);
      setError(err.response?.data?.message || `An error occurred while ${isEditing ? 'updating' : 'creating'} the task.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label htmlFor="title">Task Title <span style={{ color: 'red' }}>*</span></label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          maxLength={100}
          placeholder="e.g., Finish project proposal"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={500}
          placeholder="Add more details about the task (optional)"
        />
      </div>

      {/* Use Grid or Flexbox for better layout of selects/date */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-md)' }}>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange}>
              {CATEGORY_OPTIONS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
              {PRIORITY_OPTIONS.map(pri => <option key={pri} value={pri}>{pri}</option>)}
            </select>
          </div>

          {/* Status might be primarily controlled by Kanban, but allow setting it here too */}
          {isEditing && ( // Only show status dropdown when editing, or maybe always? Decide UX.
            <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange}>
                {STATUS_OPTIONS.map(stat => <option key={stat} value={stat}>{stat}</option>)}
                </select>
            </div>
          )}


          <div className="form-group">
            <label htmlFor="deadline">Deadline</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
               min={format(new Date(), 'yyyy-MM-dd')} // Optional: prevent past dates
            />
          </div>
      </div>


      <div className="form-actions" style={{ marginTop: 'var(--spacing-lg)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-sm)' }}>
         {/* Show Cancel button only when editing */}
         {isEditing && onCancel && (
            <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={loading}>
                Cancel
            </button>
         )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : (isEditing ? 'Update Task' : 'Add Task')}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;