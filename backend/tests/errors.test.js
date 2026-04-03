import { ValidationError, NotFoundError, DatabaseError, AuthenticationError, AuthorizationError } from '../src/utils/errors.js';

describe('Custom Error Classes', () => {
  test('ValidationError should have correct properties', () => {
    const error = new ValidationError('Invalid input', { field: 'email' });
    expect(error.message).toBe('Invalid input');
    expect(error.name).toBe('ValidationError');
    expect(error.statusCode).toBe(400);
    expect(error.details).toEqual({ field: 'email' });
  });

  test('NotFoundError should have correct properties', () => {
    const error = new NotFoundError('Resource not found');
    expect(error.message).toBe('Resource not found');
    expect(error.name).toBe('NotFoundError');
    expect(error.statusCode).toBe(404);
  });

  test('NotFoundError should use default message', () => {
    const error = new NotFoundError();
    expect(error.message).toBe('Resource not found');
  });

  test('DatabaseError should have correct properties', () => {
    const error = new DatabaseError('Connection failed');
    expect(error.message).toBe('Connection failed');
    expect(error.name).toBe('DatabaseError');
    expect(error.statusCode).toBe(500);
  });

  test('AuthenticationError should have correct properties', () => {
    const error = new AuthenticationError('Invalid credentials');
    expect(error.message).toBe('Invalid credentials');
    expect(error.name).toBe('AuthenticationError');
    expect(error.statusCode).toBe(401);
  });

  test('AuthorizationError should have correct properties', () => {
    const error = new AuthorizationError('Access denied');
    expect(error.message).toBe('Access denied');
    expect(error.name).toBe('AuthorizationError');
    expect(error.statusCode).toBe(403);
  });
});