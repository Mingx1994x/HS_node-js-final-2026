const { getCreditPackages, createCreditPackage, deleteCreditPackage } = require('../controllers/creditPackages.controller');

const router = require('express').Router();

router.get('/', getCreditPackages);

router.post('/', createCreditPackage);

router.delete('/:creditPackageId', deleteCreditPackage);

module.exports = router;