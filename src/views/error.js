export default (id, response, options) => ({
  id,
  success: false,
  payload: options.payload || response.internalError.payload,
  message: options.message || response.internalError.message,
  content: options.content || {},
  timestamp: new Date(),
});
