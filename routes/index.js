const router = require('express').Router();
const tools = require('../utils/tools');

router.get('/', (_req, res) => {
  res.render('index', { passResult: false });
});

router.post('/password', (req, res, next) => {
  try {
    tools.examInput(req.body);
    res.send(tools.generateRandomPwd(req.body));
  } catch (e) {
    next(e);
  }
});

module.exports = router;
