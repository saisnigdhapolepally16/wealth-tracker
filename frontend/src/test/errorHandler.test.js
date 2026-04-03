import { describe, it, expect, vi } from 'vitest';
import { handleApiError } from '../utils/errorHandler';

describe('handleApiError', () => {
  const mockSetError = vi.fn();

  beforeEach(() => {
    mockSetError.mockClear();
    // Mock console.error
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle network error', () => {
    const error = {
      request: {},
      message: 'Network Error'
    };

    const result = handleApiError(error, mockSetError);

    expect(mockSetError).toHaveBeenCalledWith('Network error - please check your connection');
    expect(result).toBe('Network error - please check your connection');
    expect(console.error).toHaveBeenCalledWith('API Error:', error);
  });

  it('should handle 400 status', () => {
    const error = {
      response: {
        status: 400,
        data: { message: 'Bad Request' }
      }
    };

    handleApiError(error, mockSetError);

    expect(mockSetError).toHaveBeenCalledWith('Bad Request');
  });

  it('should handle 401 status', () => {
    const error = {
      response: {
        status: 401,
        data: {}
      }
    };

    handleApiError(error, mockSetError);

    expect(mockSetError).toHaveBeenCalledWith('Authentication required');
  });

  it('should handle 404 status', () => {
    const error = {
      response: {
        status: 404,
        data: {}
      }
    };

    handleApiError(error, mockSetError);

    expect(mockSetError).toHaveBeenCalledWith('Resource not found');
  });

  it('should handle validation errors array', () => {
    const error = {
      response: {
        status: 400,
        data: {
          errors: ['Email is required', 'Password too short']
        }
      }
    };

    handleApiError(error, mockSetError);

    expect(mockSetError).toHaveBeenCalledWith('Email is required, Password too short');
  });

  it('should handle validation errors object', () => {
    const error = {
      response: {
        status: 400,
        data: {
          errors: {
            email: 'Invalid email',
            password: 'Too short'
          }
        }
      }
    };

    handleApiError(error, mockSetError);

    expect(mockSetError).toHaveBeenCalledWith('Invalid email, Too short');
  });

  it('should handle generic error', () => {
    const error = new Error('Something went wrong');

    handleApiError(error, mockSetError);

    expect(mockSetError).toHaveBeenCalledWith('Something went wrong');
  });

  it('should handle error without response or request', () => {
    const error = {
      message: 'Unknown error'
    };

    handleApiError(error, mockSetError);

    expect(mockSetError).toHaveBeenCalledWith('Unknown error');
  });
});