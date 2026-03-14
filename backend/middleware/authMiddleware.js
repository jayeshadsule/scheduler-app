const authMiddleware = (req, res, next) => {
  const userId = req.header('User-ID');
  if (!userId) {
    return res.status(401).json({ error: 'No user ID provided, authorization denied' });
  }

  req.user = { id: parseInt(userId) };
  next();
};

module.exports = authMiddleware;
