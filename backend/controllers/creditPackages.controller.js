const createHttpError = require("http-errors");

const AppDataSource = require("../db/data-source");

const creditPackageRepository = AppDataSource.getRepository('CreditPackage');
const packageOrderRepository = AppDataSource.getRepository('CreditPackageOrder');
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
  },
  orderCreditPackage: async (req, res, next) => {
    const { id: userId } = req.user;
    const { id: creditPackageId } = req.params;
    const creditPackage = await creditPackageRepository.findOneBy({ id: creditPackageId });

    if (!creditPackage) return next(createHttpError(400, 'ID錯誤'))

    await packageOrderRepository.save({
      user_id: userId,
      credit_package_id: creditPackageId,
      purchased_credits: creditPackage.credit_amount,
      price_paid: creditPackage.price
    })

    res.status(200).json({
      status: "success",
      data: null
    })
  },
  getPackageOrders: async (req, res, next) => {
    const { id: userId } = req.user;
    const packageOrders = await packageOrderRepository.find({
      where: {
        user_id: userId
      },
      relations: {
        CreditPackage: true
      },
      order: {
        purchase_at: 'DESC'
      }
    });

    const orderList = packageOrders.map(order => ({
      name: order.CreditPackage.name,
      purchased_credits: order.purchased_credits,
      price_paid: order.price_paid,
      purchase_at: order.purchase_at
    }))

    res.status(200).json({
      status: "success",
      data: orderList
    })
  }
}