const { getCreditPackages, createCreditPackage, deleteCreditPackage, orderCreditPackage } = require('../controllers/creditPackages.controller');
const { isAuth } = require('../middlewares/isAuth');
const { validate } = require('../middlewares/validate');
const { idParamSchema } = require('../schemas/baseSchema');
const { creditPackageSchema } = require('../schemas/creditPackages.schema');

const router = require('express').Router();

router.get('/', getCreditPackages);

router.post('/', validate(creditPackageSchema), createCreditPackage);

router.delete('/:id', validate(idParamSchema, 'params'), deleteCreditPackage);

router.post('/:id', isAuth, validate(idParamSchema, 'params'), orderCreditPackage);

module.exports = router;