import React, { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default calendar styles
import './CalendarView.css'; // Custom calendar styles override/extension
import { format, parseISO } from 'date-fns';

function CalendarView({ tasks, onTaskClick }) {
  const [currentDate, setCurrentDate] = useState(new Date()); // Date currently viewed/selected

  // Memoize the tasks mapped by date for efficient lookup
  const tasksByDate = useMemo(() => {
    const map = new Map();
    tasks.forEach(task => {
      if (task.deadline) {
        try {
            // Ensure deadline is parsed correctly (handle potential timezone issues if necessary)
            const deadlineDate = parseISO(task.deadline);
            // Use a normalized date string (YYYY-MM-DD) as the key
            const dateKey = format(deadlineDate, 'yyyy-MM-dd');

            if (map.has(dateKey)) {
              map.get(dateKey).push(task);
            } else {
              map.set(dateKey, [task]);
            }
        } catch (e) {
            console.error("Error parsing date for task:", task.title, task.deadline, e);
        }
      }
    });
    return map;
  }, [tasks]); // Recalculate only when tasks change

  // Function to render content for each calendar tile (day)
  const tileContent = ({ date, view }) => {
     // Only add markers in the month view
    if (view === 'month') {
      const dateKey = format(date, 'yyyy-MM-dd');
      const tasksForDay = tasksByDate.get(dateKey);

      if (tasksForDay && tasksForDay.length > 0) {
         // Simple dot marker for days with tasks
         return <div className="task-marker"></div>;
         // Alternative: Show count
         // return <div className="task-marker-count">{tasksForDay.length}</div>;
      }
    }
    return null; // No extra content for other views or days without tasks
  };

  // Function to add class names to tiles
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateKey = format(date, 'yyyy-MM-dd');
            if (tasksByDate.has(dateKey)) {
                return 'day-with-tasks'; // Add class for styling
            }
        }
        return null;
    };


  // Get tasks for the currently selected date
   const selectedDateKey = format(currentDate, 'yyyy-MM-dd');
   const tasksForSelectedDay = tasksByDate.get(selectedDateKey) || [];


  return (
    <div className="calendar-view-container card">
      <h2>Task Calendar</h2>
      <div className="calendar-wrapper">
         <Calendar
            onChange={setCurrentDate} // Update state when a date is clicked
            value={currentDate}
            tileContent={tileContent} // Render markers
            tileClassName={tileClassName} // Add custom classes
            className="task-calendar" // Add class for specific styling
         />
      </div>

       {/* Display tasks for the selected day */}
        <div className="selected-day-tasks">
            <h3>Tasks for {format(currentDate, 'MMMM d, yyyy')}</h3>
            {tasksForSelectedDay.length > 0 ? (
                <ul className="selected-tasks-list">
                    {tasksForSelectedDay.map(task => (
                        <li key={task._id} className="selected-task-item" onClick={() => onTaskClick(task)}>
                           <span className={`priority-dot priority-${task.priority}`}></span>
                            {task.title}
                            <span className="task-status-badge">{task.status}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted">No tasks due on this day.</p>
            )}
        </div>

    </div>
  );
}

export default CalendarView;