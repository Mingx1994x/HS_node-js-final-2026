const { z } = require("zod");
const { urlSchema, isRequireSchema, idUUIDSchema } = require("./baseSchema");

const coachSchema = z.object({
  experience_years: z.number({ error: '欄位未填寫正確' }).int('欄位未填寫正確').nonnegative('欄位未填寫正確'),
  description: isRequireSchema,
  profile_image_url: z.union([
    // 空值通過
    z.literal(''),
    // 有值, https 開頭字串
    urlSchema], { error: '欄位未填寫正確' }).optional()
});

const updateCoachSchema = z.object({
  experience_years: z.number({ error: '欄位未填寫正確' }).int('欄位未填寫正確').nonnegative('欄位未填寫正確'),
  description: isRequireSchema,
  profile_image_url: urlSchema,
  skill_ids: z.array(idUUIDSchema, { error: '欄位未填寫正確' }).min(1, '欄位未填寫正確')
})

module.exports = { coachSchema, updateCoachSchema };