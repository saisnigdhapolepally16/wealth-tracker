import { jest } from '@jest/globals';
import { errorHandler } from '../src/middleware/errorHandler.js';
import { ValidationError, NotFoundError, DatabaseError, AuthenticationError, AuthorizationError } from '../src/utils/errors.js';

describe('Error Handler Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      path: '/test',
      method: 'GET'
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  test('should handle ValidationError', () => {
    const error = new ValidationError('Invalid data', { field: 'email' });

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid data',
      details: { field: 'email' }
    });
  });

  test('should handle NotFoundError', () => {
    const error = new NotFoundError('User not found');

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'User not found'
    });
  });

  test('should handle AuthenticationError', () => {
    const error = new AuthenticationError('Invalid token');

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid token'
    });
  });

  test('should handle AuthorizationError', () => {
    const error = new AuthorizationError('Access denied');

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Access denied'
    });
  });

  test('should handle Mongoose ValidationError', () => {
    const error = new Error('Validation failed');
    error.name = 'ValidationError';
    error.errors = {
      email: { message: 'Email is required' },
      password: { message: 'Password too short' }
    };

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Validation error',
      errors: ['Email is required', 'Password too short']
    });
  });

  test('should handle JWT errors', () => {
    const error = new Error('Invalid token');
    error.name = 'JsonWebTokenError';

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid token'
    });
  });

  test('should handle TokenExpiredError', () => {
    const error = new Error('Token expired');
    error.name = 'TokenExpiredError';

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token expired'
    });
  });

  test('should handle generic errors', () => {
    const error = new Error('Something went wrong');
    error.statusCode = 422;

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(422);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Something went wrong'
    });
  });

  test('should default to 500 for unknown errors', () => {
    const error = new Error('Unknown error');

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Unknown error'
    });
  });
});