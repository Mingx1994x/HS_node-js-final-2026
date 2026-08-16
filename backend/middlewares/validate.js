const createHttpError = require('http-errors');

const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    return next(createHttpError(400, result.error.issues[0].message));
  }
  req[source] = result.data;
  next();
};

const validateQuery = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    return next(createHttpError(400, result.error.issues[0].message));
  }
  next();
}

module.exports = { validate, validateQuery };