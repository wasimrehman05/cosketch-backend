const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: "users"
});


userSchema.statics.register = async function (name, email, password) {
    const errors = {};

    name = name?.trim();
    email = email?.trim().toLowerCase();

    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    else if (!validator.isEmail(email)) errors.email = "Invalid email address";

    if (!password) errors.password = "Password is required";
    else if (!validator.isLength(password, { min: 6 })) {
        errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length > 0) {
        const error = new Error("Required fields are missing or invalid. Please try again.");
        error.statusCode = 400;
        error.details = errors;
        throw error;
    }

    const existingUser = await this.findOne({ email });
    if (existingUser) {
        const error = new Error("An account with this email already exists. Please log in.");
        error.statusCode = 400;
        error.details = { email: "User already exists" };
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return await this.create({ name, email, password: hashedPassword });
};


userSchema.statics.login = async function (email, password) {
    const errors = {};

    email = email?.trim().toLowerCase();

    if (!email) errors.email = "Email is required";
    else if (!validator.isEmail(email)) errors.email = "Invalid email address";

    if (!password) errors.password = "Password is required";
    else if (!validator.isLength(password, { min: 6 })) {
        errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length > 0) {
        const error = new Error("Required fields are missing or invalid. Please try again.");
        error.statusCode = 400;
        error.details = errors;
        throw error;
    }

    const user = await this.findOne({ email });
    if (!user) {
        const error = new Error("User account not found. Please register first.");
        error.statusCode = 404;
        error.details = { email: "Email not found" };
        throw error;
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
        const error = new Error("Invalid credentials. Please try again.");
        error.statusCode = 401;
        error.details = { password: "Password is incorrect" };
        throw error;
    }

    return user;
}

userSchema.methods.userDetails = function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    }
}

module.exports = mongoose.model("User", userSchema);