const createHttpError = require("http-errors");
const { verifyJWT } = require("../utils/jwtTools");

const isAuth = async (req, _res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return next(createHttpError(401, '請先登入'))
  }

  const token = auth.split(" ")[1];
  const decoded = await verifyJWT(token);

  req.user = decoded;

  next();
}

module.exports = { isAuth }