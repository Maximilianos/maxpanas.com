/**
 * Catch any api response with non-success
 * status codes and force throw them as
 * errors. Useful in fetch promise chains
 *
 * @param response
 * @returns {*}
 */
export default function throwErrorResponse(response) {
  if (response.status >= 200 && response.status < 300) return response;

  const error = new Error(response.statusText);
  error.response = response;

  throw error;
}
