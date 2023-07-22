const express = require('express');
const router = require('./routes/index');
const { errHandler } = require('./utils/tools');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errHandler);

app.listen(PORT, () => {
  console.log(`The dev server is running on http://localhost:${PORT}`);
});