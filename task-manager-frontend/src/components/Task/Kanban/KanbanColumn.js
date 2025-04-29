import React from 'react';
        import { Droppable, Draggable } from 'react-beautiful-dnd';
        import TaskItem from '../TaskItem';
        import './KanbanColumn.css'; // Create this CSS file

        function KanbanColumn({ status, tasks, onEdit, onDelete }) {
          return (
            // Each column is a Droppable area
            <Droppable droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`kanban-column ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                >
                  <h3 className="kanban-column-title">{status} ({tasks.length})</h3>
                  <div className="kanban-column-tasks">
                    {tasks.map((task, index) => (
                       // Each task is a Draggable item
                       <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(providedDraggable, snapshotDraggable) => (
                          <div
                             ref={providedDraggable.innerRef}
                             {...providedDraggable.draggableProps}
                             {...providedDraggable.dragHandleProps} // The handle to grab for dragging
                             style={{
                                 ...providedDraggable.draggableProps.style,
                                 // Add visual feedback when dragging (optional)
                                 // backgroundColor: snapshotDraggable.isDragging ? 'lightblue' : 'inherit',
                             }}
                             className="kanban-task-wrapper" // Wrapper for styling/margins
                           >
                            <TaskItem
                              task={task}
                              onEdit={onEdit}
                              onDelete={onDelete}
                              isDraggable={true} // Add specific styles or behavior if needed
                             />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {/* Placeholder element provided by react-beautiful-dnd */}
                    {provided.placeholder}
                  </div>
                   {tasks.length === 0 && !snapshot.isDraggingOver && (
                       <p className="empty-column-message text-muted">Drag tasks here</p>
                   )}
                </div>
              )}
            </Droppable>
          );
        }

        export default KanbanColumn;