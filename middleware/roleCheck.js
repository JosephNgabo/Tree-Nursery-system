// middleware/roleCheck.js
module.exports = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role?.toLowerCase();
    const normalizedAllowed = allowedRoles.map(role => role.toLowerCase());

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({ error: 'Access denied' });
    }
  
    next();
  };
};

