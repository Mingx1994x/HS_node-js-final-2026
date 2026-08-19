const getUploadImageConfig = () => {
  const uploadDir = process.env.UPLOAD_DIR || '/tmp/avatars';
  const sizeMB = Number(process.env.MAX_FILE_SIZE_MB || 2); // .env 讀出來是字串，要轉數字
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];
  return {
    uploadDir,
    sizeMB,
    maxFileSize: sizeMB * 1024 * 1024, // MB 換成 bytes
    ALLOWED_MIME_TYPES
  };
}

module.exports = { getUploadImageConfig }