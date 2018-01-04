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

exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || '';

  const removeModules = err.stack.split("\n").filter(a => !a.includes('node_modules')).join("\n").toString()

  const details = {
    message: err.message,
    status: err.status,
    stack: removeModules.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
  };

  res.status(err.status || 500);
  res.format({
    'text/html': () => res.render('error', details),
    'application/json': () => res.json(details)
  });
};

exports.productionErrors = (err, req, res, next) => {
  let message = err.message

  if (err.errors && err.errors.email.kind === 'duplicate') {
    message = "A user with the given email is already registered"
  } else if (err.name && err.name == 'UserExistsError') {
    message = 'Sorry, that username is taken.'
  }

  res.status(err.status || 500);
  req.flash('error', message)
  res.redirect('back')
};
