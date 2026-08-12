const router = require('express').Router();

const { getSkills, createSkill, deleteSkill } = require('../controllers/skills.controller');

router.get('/', getSkills);

router.post('/', createSkill);

router.delete('/:skillId', deleteSkill)

module.exports = router;