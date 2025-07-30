const { ValidationException } = require("../exceptions");
const { validateUserInput } = require("../utils/validators");

const validateRegistration = (req, res, next) => {
    try {
        const { name, email, password } = req.body || {};
        const errors = validateUserInput({ name, email, password });
        
        if (Object.keys(errors).length > 0) {
            throw new ValidationException("Validation failed", errors);
        }
        
        next();
    } catch (error) {
        next(error);
    }
};

const validateLogin = (req, res, next) => {
    try {
        const { email, password } = req.body || {};
        const errors = validateUserInput({ email, password }, true);
        
        if (Object.keys(errors).length > 0) {
            throw new ValidationException("Validation failed", errors);
        }
        
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    validateRegistration,
    validateLogin
}; 