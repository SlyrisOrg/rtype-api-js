export default (id, payload, message, options) => ({
  id,
  success: false,
  payload: options.payload || payload.internalError,
  message: options.message || message.internalError,
  content: options.content || {},
  timestamp: new Date(),
});
