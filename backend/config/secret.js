module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRES_DAY,
  firebase: {
    serviceAccount: process.env.FIREBASE_SERVICE_ACCOUNT ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) : undefined,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  }
}