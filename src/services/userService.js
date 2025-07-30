const bcrypt = require("bcrypt");
const User = require("../models/User");
const { validateUserInput, sanitizeUserInput } = require("../utils/validators");
const { ValidationException, NotFoundException, UnauthorizedException } = require("../exceptions");
const { SALT_ROUNDS, ERROR_MESSAGES, VALIDATION_MESSAGES } = require("../constants");


const register = async (name, email, password) => {
    const errors = validateUserInput({ name, email, password });
    if (Object.keys(errors).length > 0) {
        throw new ValidationException(ERROR_MESSAGES.VALIDATION_FAILED, errors);
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
        throw new ValidationException(ERROR_MESSAGES.ACCOUNT_EXISTS, {
            email: VALIDATION_MESSAGES.EMAIL_EXISTS
        });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    return user.toSafeObject();
};

const login = async (email, password) => {

    const errors = validateUserInput({email, password}, true);
    if (Object.keys(errors).length > 0) {
        throw new ValidationException(ERROR_MESSAGES.VALIDATION_FAILED, errors);
    }

    const user = await User.findByEmail(email);
    if (!user) {
        throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND, {
            email: VALIDATION_MESSAGES.EMAIL_NOT_FOUND
        });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS, {
            password: VALIDATION_MESSAGES.PASSWORD_INCORRECT
        });
    }

    return user;
};

const getUserByEmail = async (email) => {
    const user = await User.findByEmail(email);
    if (!user) {
        throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND, {
            email: VALIDATION_MESSAGES.EMAIL_NOT_FOUND
        });
    }
    return user.toSafeObject();
};

module.exports = {
    register,
    login,
    getUserByEmail
};