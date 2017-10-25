export default (id, payload, message, options) => ({
  id,
  success: true,
  payload: options.payload || payload.success,
  message: options.message || message.success,
  content: options.content || {},
  timestamp: new Date(),
});
