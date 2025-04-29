const express = require('express');
    const dotenv = require('dotenv');
    const cors = require('cors');
    const http = require('http'); // Required for Socket.IO
    const { Server } = require("socket.io"); // Socket.IO server class
    const connectDB = require('./config/db');
    const taskRoutes = require('./routes/taskRoutes');
    const authRoutes = require('./routes/authRoutes');

    // Load env vars
    dotenv.config();

    // Connect to database
    connectDB();

    const app = express();

    // Body parser middleware
    app.use(express.json());

    // CORS middleware - Use environment variable for origin
    const corsOptions = {
      origin: process.env.CORS_ORIGIN || '*', // Default to allow all if not set
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true // Allow cookies if needed for future sessions/auth methods
    };
    app.use(cors(corsOptions));
    console.log(`CORS enabled for origin: ${corsOptions.origin}`); // Log CORS setting


    // --- Socket.IO Setup ---
    const server = http.createServer(app); // Create HTTP server from Express app
    const io = new Server(server, { // Attach Socket.IO to the HTTP server
        cors: corsOptions // Use the same CORS options for Socket.IO
    });

    // Make io accessible in controllers (important!)
    app.set('socketio', io);

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Handle potential custom events here if needed (e.g., joining rooms)

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
    // --- End Socket.IO Setup ---


    // Mount routers
    app.use('/api/auth', authRoutes); // Mount auth routes
    app.use('/api/tasks', taskRoutes); // Mount task routes

    // Simple route for testing server is up
    app.get('/', (req, res) => {
      res.send('Task Manager API is running...');
    });

    // Basic Error Handling Middleware (Optional but Recommended)
    app.use((err, req, res, next) => {
      console.error("Unhandled Error:", err.stack);
      res.status(500).send({ success: false, message: 'Something broke!' });
    });


    const PORT = process.env.PORT || 5000;

    // Start the server using the http server instance, not the Express app directly
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.error(`Error: ${err.message}`);
      // Close server & exit process (optional)
      // server.close(() => process.exit(1));
    });