const router = require('express').Router();
const createHttpError = require('http-errors');
const AppDataSource = require('../db/data-source');

const skillRepository = AppDataSource.getRepository('Skill');
router.get('/', async (_req, res, next) => {
  const skills = await skillRepository.find();

  res.status(200).json({
    status: "success",
    data: skills
  })
});

router.post('/', async (req, res, next) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    return next(createHttpError(400, '欄位未填寫正確'));
  }

  const isExistSkill = await skillRepository.findOneBy({ name });
  if (isExistSkill) {
    return next(createHttpError(409, '資料重複'));
  }

  const newSkill = await skillRepository.save({ name });
  res.status(200).json({
    status: "success",
    data: newSkill
  })
});

router.delete('/:skillId', async (req, res, next) => {
  const { skillId } = req.params;
  const result = await skillRepository.delete(skillId);
  if (result.affected === 0) {
    return next(createHttpError(400, 'ID錯誤'));
  }

  res.status(200).json({
    status: "success"
  })
})

module.exports = router;