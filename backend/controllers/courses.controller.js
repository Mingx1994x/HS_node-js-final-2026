const createHttpError = require("http-errors");
const AppDataSource = require("../db/data-source");

const skillRepository = AppDataSource.getRepository('Skill');
const courseRepository = AppDataSource.getRepository('Course');
module.exports = {
  createCourse: async (req, res, next) => {
    const { id: userId } = req.user;
    const { name, description, skill_id, start_at, end_at, max_participants, meeting_url } = req.body;

    const isExistSkill = await skillRepository.findOneBy({ id: skill_id });

    if (!isExistSkill) return next(createHttpError(400, 'ID錯誤'))

    const newCourse = await courseRepository.save({
      user_id: userId,
      skill_id,
      name,
      description,
      start_at,
      end_at,
      max_participants,
      meeting_url,
    })

    res.status(201).json({
      status: "success",
      data: {
        course: newCourse
      }
    })
  }
}