'use strict';

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { UnauthorizedError } = require('../expressError');

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, '').trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

function ensureAdmin(req, res, next) {
  try {
    const tokenStr = req.headers.authorization;
    const token = tokenStr ? tokenStr.replace(/^[Bb]earer /, '').trim() : null;
    const payload = jwt.verify(token, SECRET_KEY);

    if (!payload.isAdmin) {
      throw new UnauthorizedError('Admin access required');
    }

    // If the user is admin, pass control to the next middleware/route handler
    return next();
  } catch (err) {
    return next(new UnauthorizedError('Admin access required'));
  }
}
function ensureCorrectUserOrAdmin(req, res, next) {
  try {
    const tokenStr = req.headers.authorization;
    const token = tokenStr ? tokenStr.replace(/^[Bb]earer /, '').trim() : null;
    const payload = jwt.verify(token, SECRET_KEY);

    // Check if the user is admin or matches the requested username
    if (!(payload.isAdmin || payload.username === req.params.username)) {
      throw new UnauthorizedError('Access denied');
    }

    return next();
  } catch (err) {
    return next(new UnauthorizedError('Access denied'));
  }
}
module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
};
