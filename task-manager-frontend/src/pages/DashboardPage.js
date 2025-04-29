// src/pages/DashboardPage.js
import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import api from '../services/api';
import TaskForm from '../components/Task/TaskForm';
import TaskList from '../components/Task/TaskList';
import KanbanBoard from '../components/Task/Kanban/KanbanBoard';
import CalendarView from '../components/Calendar/CalendarView';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Modal from '../components/Common/Modal'; // Import the Modal component
import { useAuth } from '../hooks/useAuth';

// Define status columns for Kanban and filtering
const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Completed'];

// Connect to Socket.IO server
const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

function DashboardPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('kanban'); // 'list', 'kanban', 'calendar'
    const { user } = useAuth(); // Get logged in user info

    // --- State for Edit Modal ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [taskToEditInModal, setTaskToEditInModal] = useState(null);
    // --- End Modal State ---

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/tasks');
            if (response.data.success) {
                setTasks(response.data.data);
            } else {
                setError('Failed to fetch tasks.');
            }
        } catch (err) {
            console.error('Fetch tasks error:', err);
            setError(err.response?.data?.message || 'An error occurred while fetching tasks.');
            if (err.response?.status === 401) {
                // Handle unauthorized (e.g., redirect via AuthContext or show message)
                 console.error("Unauthorized fetch. Token might be invalid or missing.");
            }
        } finally {
            setLoading(false);
        }
    }, []); // No dependencies needed if api instance handles token

    // Initial fetch
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // --- Modal Control Functions ---
    const openEditModal = (task) => {
        setTaskToEditInModal(task);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setTaskToEditInModal(null); // Clear the task when closing
    };
    // --- End Modal Control ---


    // Socket.IO event listeners
    useEffect(() => {
        // Listen for new tasks
        socket.on('taskCreated', (newTask) => {
            console.log('Socket received taskCreated:', newTask);
            if (newTask.user === user?._id) {
                 // Add to the beginning for immediate visibility, sort if needed elsewhere
                setTasks((prevTasks) => [newTask, ...prevTasks.filter(t => t._id !== newTask._id)]);
            }
        });

        // Listen for updated tasks
        socket.on('taskUpdated', (updatedTask) => {
            console.log('Socket received taskUpdated:', updatedTask);
            if (updatedTask.user === user?._id) {
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === updatedTask._id ? updatedTask : task
                    )
                );
                 // If the task being edited in the modal was updated externally,
                 // update the form data within the modal as well (or close it)
                 if (taskToEditInModal?._id === updatedTask._id) {
                     // Option 1: Update the task in the modal state
                     // setTaskToEditInModal(updatedTask);
                     // Option 2: Close the modal as external change might conflict
                     // closeEditModal();
                     // Option 3 (Chosen): Keep modal open, user can cancel or overwrite
                     console.log("Task being edited was updated externally.");
                 }
            }
        });

        // Listen for deleted tasks
        socket.on('taskDeleted', (deletedTaskData) => {
            console.log('Socket received taskDeleted:', deletedTaskData);
             if (deletedTaskData.user === user?._id) {
                setTasks((prevTasks) =>
                    prevTasks.filter((task) => task._id !== deletedTaskData._id)
                );
                 // If the task being edited in the modal was deleted, close the modal
                 if (taskToEditInModal?._id === deletedTaskData._id) {
                    closeEditModal();
                 }
             }
        });

        // Clean up listeners on component unmount
        return () => {
            socket.off('taskCreated');
            socket.off('taskUpdated');
            socket.off('taskDeleted');
        };
     // Add taskToEditInModal._id to dependencies to ensure cleanup/reattach logic runs if modal task changes
    }, [user?._id, taskToEditInModal?._id]);


    // --- Task Action Handlers ---

    // Called when the TOP-LEVEL form (Add Task) submits successfully
    const handleTaskCreated = (newTask) => {
        // Optimistic update handled by socket 'taskCreated' event
        console.log('Task created via form, waiting for socket update:', newTask);
        // No need to manually add here if socket listener works correctly
        // Optionally clear the form fields manually if TaskForm doesn't reset itself
    };

    // Called when the MODAL form (Edit Task) submits successfully
    const handleTaskUpdated = (updatedTask) => {
        // Optimistic update handled by socket 'taskUpdated' event
         console.log('Task updated via modal form, waiting for socket update:', updatedTask);
        closeEditModal(); // Close the modal on successful update
    };

    const handleTaskDeleted = async (taskId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this task?');
        if (!confirmDelete) return;

        // Close modal if the task being deleted is the one open for editing
         if (taskToEditInModal?._id === taskId) {
            closeEditModal();
         }

        try {
            const response = await api.delete(`/tasks/${taskId}`);
            if (response.data.success) {
                // Optimistic update handled by socket 'taskDeleted' event
                 console.log('Task deleted via API, waiting for socket update.');
            } else {
                setError(response.data.message || 'Failed to delete task.');
            }
        } catch (err) {
            console.error('Delete task error:', err);
            setError(err.response?.data?.message || 'An error occurred while deleting task.');
        }
    };

    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return; // No change or dropped outside
        }

        const taskId = draggableId;
        const newStatus = destination.droppableId;
        const taskToUpdate = tasks.find(task => task._id === taskId);

        if (!taskToUpdate || taskToUpdate.status === newStatus) {
             console.log("Status unchanged or task not found, skipping update.");
            return;
        }

        // Optimistic UI Update
        const updatedTaskOptimistic = { ...taskToUpdate, status: newStatus };
        setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? updatedTaskOptimistic : task));

        // API Call
        try {
            const response = await api.put(`/tasks/${taskId}`, { status: newStatus });
            if (!response.data.success) {
                console.error("Failed to update task status:", response.data.message);
                setError(response.data.message || 'Failed to update task status.');
                 // Revert optimistic update
                setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? taskToUpdate : task));
            } else {
                 console.log("Task status updated successfully via API, waiting for socket update.");
                  // Socket 'taskUpdated' should handle the final sync
            }
        } catch (err) {
            console.error('Error updating task status via drag:', err);
            setError(err.response?.data?.message || 'An error occurred while updating task status.');
             // Revert optimistic update
            setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? taskToUpdate : task));
        }
    };

    // --- End Task Action Handlers ---


    return (
        <div className="dashboard">
            <h1>{user?.username}'s Tasks</h1>

            {error && <div className="error-message">{error}</div>}

            {/* --- Top-Level Add Task Form --- */}
            <div className="task-form-section card">
                <h2>Add New Task</h2>
                <TaskForm
                    // No initialData here, it's always for adding
                    onSubmitSuccess={handleTaskCreated}
                    // No onCancel needed unless we add a specific reset button
                />
            </div>

            {/* --- View Mode Toggle Buttons --- */}
            <div className="view-toggle" style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
                <button
                    onClick={() => setViewMode('list')}
                    className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ marginRight: 'var(--spacing-sm)'}}
                > List View </button>
                <button
                    onClick={() => setViewMode('kanban')}
                    className={`btn ${viewMode === 'kanban' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ marginRight: 'var(--spacing-sm)'}}
                > Kanban Board </button>
                <button
                    onClick={() => setViewMode('calendar')}
                    className={`btn ${viewMode === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
                > Calendar View </button>
            </div>

            {/* --- Content Area (based on View Mode) --- */}
            {loading ? (
                <LoadingSpinner />
            ) : tasks.length === 0 ? (
                <p className="text-center text-muted">No tasks found. Add one above!</p>
            ) : (
                <>
                    {viewMode === 'list' && (
                        <TaskList
                            tasks={tasks}
                            onEdit={openEditModal} // Use modal opener for editing
                            onDelete={handleTaskDeleted}
                        />
                    )}
                    {viewMode === 'kanban' && (
                        <KanbanBoard
                            tasks={tasks}
                            statuses={STATUS_OPTIONS}
                            onDragEnd={handleDragEnd}
                            onEdit={openEditModal} // Use modal opener for editing
                            onDelete={handleTaskDeleted}
                        />
                    )}
                    {viewMode === 'calendar' && (
                        <CalendarView
                            tasks={tasks}
                            onTaskClick={openEditModal} // Use modal opener for editing
                        />
                    )}
                </>
            )}

            {/* --- Edit Task Modal --- */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                title={taskToEditInModal ? `Edit Task` : 'Edit Task'} // Simplified title or add task title
            >
                {/* Render TaskForm inside the modal ONLY when taskToEditInModal exists */}
                {taskToEditInModal && (
                    <TaskForm
                        initialData={taskToEditInModal}
                        onSubmitSuccess={handleTaskUpdated} // Handler for successful modal update
                        onCancel={closeEditModal} // Allow form's cancel button to close modal
                    />
                )}
            </Modal>

        </div>
    );
}

export default DashboardPage;