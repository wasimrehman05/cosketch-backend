const express = require("express");
const app = express();
require("dotenv").config();

const { connectToDatabase } = require("./src/config/db");
const { userRoutes } = require("./src/routes/userRoutes");

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoutes);


connectToDatabase();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});