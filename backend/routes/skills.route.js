const router = require('express').Router();

const { getSkills, createSkill, deleteSkill } = require('../controllers/skills.controller');
const validate = require('../middlewares/validate');
const idParamSchema = require('../schemas/idParamSchema');
const { skillSchema } = require('../schemas/skills.schema');

router.get('/', getSkills);

router.post('/', validate(skillSchema), createSkill);

router.delete('/:id', validate(idParamSchema, 'params'), deleteSkill)

module.exports = router;