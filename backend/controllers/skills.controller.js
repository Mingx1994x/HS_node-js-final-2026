const createHttpError = require('http-errors');
const AppDataSource = require('../db/data-source');

const skillRepository = AppDataSource.getRepository('Skill');

module.exports = {
  getSkills: async (_req, res, _next) => {
    const skills = await skillRepository.find();

    res.status(200).json({
      status: "success",
      data: skills
    })
  },
  createSkill: async (req, res, next) => {
    const { name } = req.body;
    const isExistSkill = await skillRepository.findOneBy({ name });

    if (isExistSkill) {
      return next(createHttpError(409, '資料重複'));
    }

    const newSkill = await skillRepository.save({ name });
    res.status(200).json({
      status: "success",
      data: newSkill
    })
  },
  deleteSkill: async (req, res, next) => {
    const { id: skillId } = req.params;
    const result = await skillRepository.delete(skillId);
    if (result.affected === 0) {
      return next(createHttpError(400, 'ID錯誤'));
    }

    res.status(200).json({
      status: "success"
    })
  }
}