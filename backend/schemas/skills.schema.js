const { z } = require("zod");

const skillSchema = z.object({
  name: z.string().trim().min(1, '欄位未填寫正確').max(50, '欄位未填寫正確')
});

module.exports = { skillSchema };