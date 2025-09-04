module.exports = (allowed = []) => (req, res, next) => {
  if(!req.user) return res.status(401).json({ msg: 'No user' });
  if(typeof allowed === 'string') allowed = [allowed];
  if(allowed.includes(req.user.role) || allowed.length === 0) return next();
  return res.status(403).json({ msg: 'Forbidden' });
};
