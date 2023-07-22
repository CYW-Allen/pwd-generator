const router = require('express').Router();
const tools = require('../utils/tools');

router.get('/', (_req, res) => {
  res.send('This is a random password generator.');
});

router.post('/password', (req, res, next) => {
  try {
    tools.examInput(req.body);
    res.send(`The random password: ${tools.generateRandomPwd(req.body)}`);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
