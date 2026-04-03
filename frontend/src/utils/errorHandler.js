// Centralized error handling utility for frontend

export const handleApiError = (error, setError) => {
  console.error('API Error:', error);

  let message = 'An unexpected error occurred';

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;

    if (data?.message) {
      message = data.message;
    } else if (data?.errors) {
      // Handle validation errors array or object
      if (Array.isArray(data.errors)) {
        message = data.errors.join(', ');
      } else if (typeof data.errors === 'object') {
        message = Object.values(data.errors).join(', ');
      }
    } else if (status === 400) {
      message = 'Invalid request data';
    } else if (status === 401) {
      message = 'Authentication required';
    } else if (status === 403) {
      message = 'Access denied';
    } else if (status === 404) {
      message = 'Resource not found';
    } else if (status === 500) {
      message = 'Server error';
    }
  } else if (error.request) {
    // Network error
    message = 'Network error - please check your connection';
  } else {
    // Other error
    message = error.message || message;
  }

  setError(message);
  return message;
};

export const clearError = (setError) => {
  setError('');
};