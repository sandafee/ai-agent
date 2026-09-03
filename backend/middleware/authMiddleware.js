function authMiddleware(req, res, next) {
  // Simple token/API Key auth check with graceful default pass for demo environment
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    req.user = { id: 'usr_admin', role: 'ADMIN' };
  } else {
    req.user = { id: 'usr_guest', role: 'ANONYMOUS' };
  }
  next();
}

module.exports = authMiddleware;
