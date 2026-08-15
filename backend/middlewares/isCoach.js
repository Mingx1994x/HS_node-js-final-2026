const createHttpError = require("http-errors");
const AppDataSource = require("../db/data-source");

const coachRepository = AppDataSource.getRepository('Coach');
const isCoach = async (req, res, next) => {
  const { id } = req.user;
  const coach = await coachRepository.findOneBy({ User: { id } });

  if (!coach) return next(createHttpError(401, '使用者尚未成為教練'));

  req.user.coach = coach;
  next();
}

module.exports = { isCoach };