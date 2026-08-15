const { z } = require("zod");

const isRequireSchema = z.string({ error: '欄位未填寫正確' }).min(1, '欄位未填寫正確');

const idParamSchema = z.object({
  id: z.string({ error: 'ID錯誤' }).uuid('ID錯誤')
});

const positiveIntegerSchema = z.number({ error: '欄位未填寫正確' }).int('欄位未填寫正確').positive('欄位未填寫正確');

const urlSchema = z.union([
  // 空值通過
  z.literal(''),
  // 有值, https 開頭字串
  z.string({ error: '欄位未填寫正確' }).url({ protocol: /^https$/, error: '欄位未填寫正確' })
], { error: '欄位未填寫正確' });

module.exports = { isRequireSchema, idParamSchema, positiveIntegerSchema, urlSchema };