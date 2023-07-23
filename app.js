const express = require('express');
const { engine } = require('express-handlebars');
const multer = require('multer')
const router = require('./routes/index');
const { errHandler } = require('./utils/tools');

const app = express();
const upload = multer();
const PORT = process.env.PORT || 3000;

app.engine('.hbs', engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static('public'));
app.use(upload.none());
app.use(router);
app.use(errHandler);

app.listen(PORT, () => {
  console.log(`The dev server is running on http://localhost:${PORT}`);
});