export default (id, message, options) => ({
  id,
  success: true,
  payload: options.payload || message.success.payload,
  message: options.message || message.success.message,
  content: options.content || {},
  timestamp: new Date(),
});
