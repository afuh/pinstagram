exports.catchErrors = (fn) => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

exports.notFound = (req, res, next) => {
  const err = new Error('The link you followed may be broken, or the page may have been removed.');
  err.status = 404;
  next(err);
};

exports.productionErrors = (err, req, res, next) => {
  let message = err.message

  if (err.errors && err.errors.email.kind === 'duplicate') {
    message = "A user with the given email is already registered"
  }

  res.status(err.status || 500);
  res.render('error', {
    title: "Page Not Found",
    message,
    status: err.status
  });
};
