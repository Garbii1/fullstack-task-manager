import React from 'react';
        import { DragDropContext } from 'react-beautiful-dnd';
        import KanbanColumn from './KanbanColumn';
        import './KanbanBoard.css'; // Create this CSS file

        function KanbanBoard({ tasks, statuses, onDragEnd, onEdit, onDelete }) {

          // Group tasks by status
          const columns = statuses.reduce((acc, status) => {
            acc[status] = tasks.filter(task => task.status === status);
            return acc;
          }, {});


          return (
            // Wrap the board in the DragDropContext
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="kanban-board">
                {statuses.map(status => (
                  <KanbanColumn
                    key={status}
                    status={status} // Pass the status name as droppableId and title
                    tasks={columns[status] || []} // Pass tasks for this column
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </DragDropContext>
          );
        }

        export default KanbanBoard;