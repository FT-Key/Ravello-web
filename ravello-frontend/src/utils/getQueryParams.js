// src/utils/getQueryParams.js

export const getQueryParams = (search = window.location.search) => {
  const params = new URLSearchParams(search);
  const result = {};

  for (const [key, value] of params.entries()) {
    result[key] = decodeURIComponent(value);
  }

  return result;
};
