const validator = require("validator");
const { VALIDATION_MESSAGES, PASSWORD_MIN_LENGTH } = require("../constants");

const validateUserInput = ({ name, email, password }, isLogin = false) => {
    const errors = {};

    if (!isLogin) {
        name = name && typeof name === 'string' ? name.trim() : '';

        if (!name) {
            errors.name = VALIDATION_MESSAGES.NAME_REQUIRED;
        } else if (name.length < 2) {
            errors.name = 'Name must be at least 2 characters long';
        } else if (name.length > 50) {
            errors.name = 'Name cannot exceed 50 characters';
        }
    }

    email = email && typeof email === 'string' ? email.trim() : '';
    if (!email) {
        errors.email = VALIDATION_MESSAGES.EMAIL_REQUIRED;
    } else if (!validator.isEmail(email)) {
        errors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
    }

    password = password && typeof password === 'string' ? password : '';
    if (!password) {
        errors.password = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
    } else if (password.length < PASSWORD_MIN_LENGTH) {
        errors.password = VALIDATION_MESSAGES.PASSWORD_TOO_SHORT;
    }

    return errors;
};

const sanitizeUserInput = ({ name, email, password }) => {
    return {
        name: name ? name.trim() : '',
        email: email ? email.trim().toLowerCase() : '',
        password: password || ''
    };
};

module.exports = { 
    validateUserInput,
    sanitizeUserInput
};
