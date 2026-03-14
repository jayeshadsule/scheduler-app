const authMiddleware = (req, res, next) => {
  const userId = req.header('User-ID');
  if (!userId) {
    return res.status(401).json({ error: 'No user ID provided, authorization denied' });
  }

  // In a simple coding test, we trust the User-ID header.
  // We attach it to req.user for use in controllers.
  req.user = { id: parseInt(userId) };
  next();
};

module.exports = authMiddleware;
