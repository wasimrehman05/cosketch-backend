const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const { connectToDatabase } = require("./src/config/db");
const userRoutes = require("./src/routes/userRoute");
const canvasRoutes = require("./src/routes/CanvasRoute");
const errorHandler = require("./src/middleware/errorHandler");
const requestLogger = require("./src/middleware/requestLogger");
const { REQUEST_SIZE_LIMIT } = require("./src/constants");
const { generalLimiter } = require("./src/middleware/rateLimiter");

const app = express();
const PORT = process.env.PORT || 3001;


if (process.env.NODE_ENV === "production") {
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", process.env.FRONTEND_URL],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
            }
        },
        hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
    }));
} else {
    app.use(helmet());
}

app.use(generalLimiter);

app.use(cors());
app.use(express.json({ limit: REQUEST_SIZE_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: REQUEST_SIZE_LIMIT }));

app.use(requestLogger);

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/canvas", canvasRoutes);

app.use(errorHandler);

const startServer = async () => {
    try {
        await connectToDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();