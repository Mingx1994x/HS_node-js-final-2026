const { z } = require("zod");

const isRequireSchema = z.string({ error: '欄位未填寫正確' }).min(1, '欄位未填寫正確');
const idUUIDSchema = z.string({ error: 'ID錯誤' }).uuid('ID錯誤');

const urlSchema = z.string({ error: '欄位未填寫正確' }).url({ protocol: /^https$/, error: '欄位未填寫正確' });

const idParamSchema = z.object({
  id: idUUIDSchema
});

const positiveIntegerSchema = z.number({ error: '欄位未填寫正確' }).int('欄位未填寫正確').positive('欄位未填寫正確');

module.exports = { isRequireSchema, idUUIDSchema, idParamSchema, positiveIntegerSchema, urlSchema };