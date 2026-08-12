const createHttpError = require('http-errors');

const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    return next(createHttpError(400, result.error.issues[0].message));
  }
  req[source] = result.data;
  next();
};

module.exports = validate;