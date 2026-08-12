const { z } = require("zod");

const creditPackageSchema = z.object({
  name: z.string().trim().min(1, '欄位未填寫正確').max(50, '欄位未填寫正確'),
  credit_amount: z.number({ error: '欄位未填寫正確' }).int('欄位未填寫正確').positive('欄位未填寫正確'),
  price: z.number({ error: '欄位未填寫正確' }).int('欄位未填寫正確').positive('欄位未填寫正確')
});

module.exports = { creditPackageSchema };