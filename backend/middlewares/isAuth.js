const createHttpError = require("http-errors");

const AppDataSource = require("../db/data-source");
const { verifyJWT } = require("../utils/jwtTools");

const userRepository = AppDataSource.getRepository('User');
const isAuth = async (req, _res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return next(createHttpError(401, '請先登入'))
  }

  const token = auth.split(" ")[1];
  const decoded = await verifyJWT(token);

  const user = await userRepository.findOneBy({ id: decoded.id });

  if (!user) {
    return next(createHttpError(401, '無效的 token'));
  }

  req.user = user;

  next();
}

module.exports = { isAuth }