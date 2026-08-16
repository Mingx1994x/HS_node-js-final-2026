const { getCoaches, getCoachById } = require('../controllers/publicCoaches.controller');
const { validate, validateQuery } = require('../middlewares/validate');
const { paginationSchema, idParamSchema } = require('../schemas/baseSchema');

const router = require('express').Router();

router.get('/', validateQuery(paginationSchema), getCoaches);
router.get('/:id', validate(idParamSchema, 'params'), getCoachById);
// router.get('/:id/courses');

module.exports = router;