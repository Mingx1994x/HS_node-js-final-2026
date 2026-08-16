const { z } = require("zod");

const isRequireSchema = z.string({ error: '欄位未填寫正確' }).min(1, '欄位未填寫正確');
const idUUIDSchema = z.string({ error: 'ID錯誤' }).uuid('ID錯誤');

const urlSchema = z.string({ error: '欄位未填寫正確' }).url({ protocol: /^https$/, error: '欄位未填寫正確' });

const dateTimeSchema = z.string({ error: '欄位未填寫正確' }).pipe(z.iso.datetime({ error: '欄位未填寫正確' }));

const positiveIntegerSchema = z.number({ error: '欄位未填寫正確' }).int('欄位未填寫正確').positive('欄位未填寫正確');

const nonNegativeIntegerSchema = z.number({ error: '欄位未填寫正確' }).int('欄位未填寫正確').nonnegative('欄位未填寫正確');

const pageQuerySchema = z.coerce.number({ error: '欄位未填寫正確' }).int('欄位未填寫正確').positive('欄位未填寫正確');

// params 驗證
const idParamSchema = z.object({
  id: idUUIDSchema
});

// query 驗證
const paginationSchema = z.object({
  page: pageQuerySchema,
  per: pageQuerySchema
})

module.exports = { isRequireSchema, idUUIDSchema, urlSchema, dateTimeSchema, positiveIntegerSchema, nonNegativeIntegerSchema, idParamSchema, paginationSchema };