const fs = require('fs/promises');

const { generateRemoteFilePath, getUploadImageUrl } = require('../utils/firebase');
const logger = require('../utils/logger').child({ module: 'uploadImage:controller' });

module.exports = {
  uploadImage: async (req, res, _next) => {
    const { id: userId } = req.user;
    const { avatar } = req;

    // 將圖片上傳至 firebase bucket
    let image_url;
    const remoteFilePath = generateRemoteFilePath(avatar.originalFilename, userId)
    try {
      image_url = await getUploadImageUrl(avatar.filepath, remoteFilePath);
    } finally {
      await fs.unlink(avatar.filepath).catch((error) => {
        logger.warn({ error }, '清除本地暫存檔失敗')
      })
    }

    res.json({
      status: "success",
      data: {
        image_url
      }
    })
  }
}