import React from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns'; // For relative dates
import './TaskItem.css'; // Create this CSS file

function TaskItem({ task, onEdit, onDelete, isDraggable = false, ...draggableProps }) {
  if (!task) return null; // Handle case where task might be temporarily undefined

   const { _id, title, description, category, priority, status, deadline, createdAt } = task;

   // Calculate time ago for creation date
   const timeAgo = createdAt ? formatDistanceToNow(parseISO(createdAt), { addSuffix: true }) : '';
   // Format deadline for display
   const formattedDeadline = deadline ? new Date(deadline).toLocaleDateString() : 'No deadline';
   // Check if deadline is past
   const isPastDeadline = deadline && new Date(deadline) < new Date();


   // Conditional style for past deadlines
   const deadlineStyle = {
       color: isPastDeadline ? 'var(--error-color)' : 'inherit',
       fontWeight: isPastDeadline ? 'bold' : 'normal',
   };

  return (
    <div className={`task-item card ${isDraggable ? 'draggable' : ''}`} {...draggableProps}>
      <div className="task-item-header">
         <h4 className="task-title">{title}</h4>
         <span className={`priority-badge priority-${priority}`}>{priority}</span>
      </div>

      {description && <p className="task-description text-muted">{description}</p>}

      <div className="task-item-details">
         <span><strong>Category:</strong> {category}</span>
         <span><strong>Status:</strong> {status}</span>
         <span style={deadlineStyle}><strong>Deadline:</strong> {formattedDeadline}</span>
         <span className="text-muted task-created-date">Created {timeAgo}</span>
      </div>


      <div className="task-item-actions">
        <button onClick={() => onEdit(task)} className="btn btn-secondary btn-sm">Edit</button>
        <button onClick={() => onDelete(_id)} className="btn btn-danger btn-sm">Delete</button>
      </div>
    </div>
  );
}

export default TaskItem;