const { z } = require("zod");

const isRequireSchema = z.string({ error: '欄位未填寫正確' }).min(1, '欄位未填寫正確');

const idParamSchema = z.object({
  id: z.string({ error: 'ID錯誤' }).uuid('ID錯誤')
})

module.exports = { isRequireSchema, idParamSchema };