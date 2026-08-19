const { formidable } = require("formidable");
const createHttpError = require("http-errors");
const fs = require('fs/promises');

const { getUploadImageConfig } = require("../utils/formidableConfig");
const logger = require("../utils/logger").child({ module: 'uploadImage:middleware' });

const parseUploadImage = async (req, _res, next) => {
  const config = getUploadImageConfig();
  const form = formidable({
    uploadDir: config.uploadDir,
    maxFileSize: config.maxFileSize,
    keepExtensions: true,        // 保留等副檔名
    createDirsFromUploads: true  // 確保上傳資料夾存在
  })

  let files;
  try {
    [, files] = await form.parse(req);
  } catch (error) {
    if (error.httpCode === 413) {
      return next(createHttpError(400, `檔案超過大小限制，請上傳${config.sizeMB} Mb 的檔案`))
    }
    if (error.httpCode === 400) {
      return next(createHttpError(400, '上傳格式錯誤，請確認使用 multipart/form-data'))
    }
    return next(error)
  }

  // 同名欄位會包成陣列，取第一個；沒上傳檔案就會是 undefined
  const avatar = files.file?.[0];
  if (!avatar) {
    return next(createHttpError(400, '沒有檔案上傳'))
  }

  if (!config.ALLOWED_MIME_TYPES.includes(avatar.mimetype)) {
    await fs.unlink(avatar.filepath).catch((error) => {
      logger.warn({ error }, '清除本地暫存檔失敗')
    });
    return next(createHttpError(400, '只支援 jpg / png 格式的圖片'))
  }

  req.avatar = avatar;

  next()
}

module.exports = { parseUploadImage }