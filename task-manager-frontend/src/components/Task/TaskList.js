import React from 'react';
        import TaskItem from './TaskItem';

        function TaskList({ tasks, onEdit, onDelete }) {

          if (!tasks || tasks.length === 0) {
            return <p className="text-center text-muted">No tasks in this view.</p>;
          }

          return (
            <div className="task-list">
              {/* Optional: Add sorting/filtering controls here later */}
              {tasks.map(task => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          );
        }

        export default TaskList;