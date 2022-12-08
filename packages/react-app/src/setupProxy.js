// App is an express application, we can add an express middleware that will set headers for manifest.json request
// https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually

module.exports = function (app) {
  app.use("/manifest.json", function (req, res, next) {
    res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    });

    next();
  });
};
