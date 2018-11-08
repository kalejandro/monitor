const CSRF_TOKEN_KEY = 'XSRF-TOKEN';

export const getCsrfToken = () => {
  const result = document.cookie.match(getRegex(CSRF_TOKEN_KEY));

  if (result) {
    return result[2];
  }
};

const getRegex = (key) => new RegExp('(^| )' + key + '=([^;]+)');
