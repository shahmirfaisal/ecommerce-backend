exports.errorHandler = (next, message, status = 500) => {
  const error = new Error(message);
  error.status = status;
  next(error);
};
