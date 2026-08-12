const { getCreditPackages, createCreditPackage, deleteCreditPackage } = require('../controllers/creditPackages.controller');
const validate = require('../middlewares/validate');
const { creditPackageSchema } = require('../schemas/creditPackages.schema');

const router = require('express').Router();

router.get('/', getCreditPackages);

router.post('/', validate(creditPackageSchema), createCreditPackage);

router.delete('/:creditPackageId', deleteCreditPackage);

module.exports = router;