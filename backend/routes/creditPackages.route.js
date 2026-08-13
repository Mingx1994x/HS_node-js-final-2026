const { getCreditPackages, createCreditPackage, deleteCreditPackage } = require('../controllers/creditPackages.controller');
const validate = require('../middlewares/validate');
const { idParamSchema } = require('../schemas/baseSchema');
const { creditPackageSchema } = require('../schemas/creditPackages.schema');

const router = require('express').Router();

router.get('/', getCreditPackages);

router.post('/', validate(creditPackageSchema), createCreditPackage);

router.delete('/:id', validate(idParamSchema, 'params'), deleteCreditPackage);

module.exports = router;