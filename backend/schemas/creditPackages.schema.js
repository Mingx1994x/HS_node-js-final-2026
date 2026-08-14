const { z } = require("zod");
const { positiveIntegerSchema } = require("./baseSchema");

const creditPackageSchema = z.object({
  name: z.string({ error: '欄位未填寫正確' }).trim().min(1, '欄位未填寫正確').max(50, '欄位未填寫正確'),
  credit_amount: positiveIntegerSchema,
  price: positiveIntegerSchema
});

module.exports = { creditPackageSchema };