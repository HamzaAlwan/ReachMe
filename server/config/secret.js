module.exports = {
  MongoUrl:
    process.env.NODE_ENV === "production"
      ? "mongodb://admin:rbk1234@ds217976.mlab.com:17976/chat-app"
      : "mongodb://localhost/chatapp",
  secret: "jwtSecret",
  cloudinary: {
    cloudName: "my-chat-app",
    api_key: "519393795851673",
    api_secret: "LA7CBWVbok3nZtA0chxn16PRKyc"
  }
};
