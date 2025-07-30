const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = '1d';
const PASSWORD_MIN_LENGTH = 6;

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 100;
const REQUEST_SIZE_LIMIT = '10mb';

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

const ERROR_MESSAGES = {
    VALIDATION_FAILED: 'Validation failed',
    ACCOUNT_EXISTS: 'Account already exists',
    USER_NOT_FOUND: 'User account not found',
    INVALID_CREDENTIALS: 'Invalid credentials',
    TOKEN_REQUIRED: 'Bearer token is required',
    INVALID_TOKEN: 'Invalid token',
    TOKEN_EXPIRED: 'Token expired',
    INTERNAL_ERROR: 'Internal server error'
};

const VALIDATION_MESSAGES = {
    NAME_REQUIRED: 'Name is required',
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Invalid email address',
    EMAIL_EXISTS: 'Email already registered',
    EMAIL_NOT_FOUND: 'Email not found',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_TOO_SHORT: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    PASSWORD_INCORRECT: 'Incorrect password'
};

module.exports = {
    SALT_ROUNDS,
    JWT_EXPIRES_IN,
    PASSWORD_MIN_LENGTH,
    RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MAX_REQUESTS,
    REQUEST_SIZE_LIMIT,
    HTTP_STATUS,
    ERROR_MESSAGES,
    VALIDATION_MESSAGES
}; 