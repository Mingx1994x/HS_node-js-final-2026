const { initializeApp, cert, getApps } = require('firebase-admin');
const { getStorage } = require('firebase-admin/storage');
const { randomUUID } = require('crypto');

const logger = require('./logger').child({ module: 'firebase' });
const config = require('../config');
let bucket;

const getBucket = () => {
  if (!bucket) {
    try {
      if (getApps().length === 0) {
        initializeApp({
          credential: cert(config.get('secret.firebase.serviceAccount')),
          storageBucket: config.get('secret.firebase.storageBucket')
        });
      }
      bucket = getStorage().bucket();
    } catch (error) {
      logger.warn({ error }, 'Firebase bucket 未連接，圖片上傳功能無法使用');

      throw error
    }
  }

  return bucket
}

const generateRemoteFilePath = (filename, userId) => (`avatars/${userId}/${new Date().toISOString()}-${filename}`);

const getUploadImageUrl = async (filePath, remoteFilePath) => {
  const token = randomUUID();
  await getBucket().upload(filePath, {
    destination: remoteFilePath,
    metadata: {
      metadata: { firebaseStorageDownloadTokens: token }
    }
  });

  const encodedPath = encodeURIComponent(remoteFilePath);

  return `https://firebasestorage.googleapis.com/v0/b/${getBucket().name}/o/${encodedPath}?alt=media&token=${token}`
}

module.exports = { generateRemoteFilePath, getUploadImageUrl };