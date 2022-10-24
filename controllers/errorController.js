exports.logErrors = (error, req, res, next) => {
  console.log(error.stack);
  next(error);
};

exports.respondNoErrorFound = (req, res) => {
  res.status(404).send(`404 | page does not exist`);
};

exports.respondInternalError = (error, req, res, next) => {
  console.log(`Error occured: ${error.stack}`);
  res.status(500).send(`500 | our application is experiencing a problem`);
};
