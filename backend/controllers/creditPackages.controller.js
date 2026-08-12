const createHttpError = require("http-errors");

const AppDataSource = require("../db/data-source");

const creditPackageRepository = AppDataSource.getRepository('CreditPackage');
module.exports = {
  getCreditPackages: async (_req, res, _next) => {

    const creditPackages = await creditPackageRepository.find();

    res.status(200).json({
      status: "success",
      data: creditPackages
    })
  },
  createCreditPackage: async (req, res, next) => {
    const { name, credit_amount, price } = req.body;

    const isExistCreditPackage = await creditPackageRepository.findOneBy({ name });
    if (isExistCreditPackage) {
      return next(createHttpError(409, '資料重複'));
    }

    const newCreditPackage = await creditPackageRepository.save({
      name,
      credit_amount,
      price
    });

    res.status(200).json({
      status: "success",
      data: newCreditPackage
    })

  },
  deleteCreditPackage: async (req, res, next) => {
    const { id: creditPackageId } = req.params;
    const result = await creditPackageRepository.delete(creditPackageId);
    if (result.affected === 0) {
      return next(createHttpError(400, 'ID錯誤'));
    }

    res.status(200).json({
      status: "success"
    })
  }
}