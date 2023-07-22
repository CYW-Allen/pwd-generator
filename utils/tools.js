const ASCII_NUM_START = 48;
const ASCII_NUM_END = 57;
const ASCII_UPPER_START = 65;
const ASCII_UPPER_END = 90;
const ASCII_LOWER_START = 97;
const ASCII_LOWER_END = 122;
const ASCII_CHAR_START = 33;
const ASCII_CHAR_END = 126;
const PATTERN_LIST = ['number', 'uppercase', 'lowercase', 'symbols'];

class CharAsciiTable {
  number = getNumberList(ASCII_NUM_START, ASCII_NUM_END);
  uppercase = getNumberList(ASCII_UPPER_START, ASCII_UPPER_END);
  lowercase = getNumberList(ASCII_LOWER_START, ASCII_LOWER_END);
  symbols = getNumberList(ASCII_CHAR_START, ASCII_CHAR_END).filter((num) => (
    num < this.number[0]
      || (num > this.number[this.number.length - 1] && num < this.uppercase[0])
      || (num > this.uppercase[this.uppercase.length - 1] && num < this.lowercase[0])
      || num > this.lowercase[this.lowercase.length - 1]
  ));

  pickupRandomOne(type) {
    return String.fromCharCode(this[type][getRandomNum(this[type].length)])
  }
}

function getNumberList(start, end) {
  return Array.from(Array(end + 1).keys()).slice(start);
}

function getRandomNum(range) {
  return Math.floor(Math.random() * range);
}

function throwInputErr(msg) {
  const err = new Error();
  err.name = 'invalidInput';
  err.statusCode = 400;
  err.message = msg;
  throw err;
}

exports.examInput = (input) => {
  const { pwdLen, patterns, excludeChars } = input;

  if (!pwdLen || !Number(pwdLen) || pwdLen < 4 || pwdLen > 16) throwInputErr('Invaild password');
  if (!patterns) throwInputErr('At least one pattern is required');
  if (typeof patterns !== 'string' && !(patterns instanceof Array)) throwInputErr('Invaild patterns');
  const patternList = typeof patterns === 'string' ? [patterns] : patterns;
  for (let i = 0; i < patternList.length; i++) {
    if (!PATTERN_LIST.includes(patternList[i])) throwInputErr('Invaild value in patterns');
  }
  if (excludeChars && typeof excludeChars !== 'string') throwInputErr('Invaild excludeChars');
  if (excludeChars) {
    const filterLen = Array.from(new Set(excludeChars.replace(/\s/g, '').split(''))).length;
    const charPatternLen = patternList.reduce((sum, pattern) => {
      sum += charAscii[pattern].length;
      return sum;
    }, 0);
    if (filterLen >= charPatternLen) throwInputErr('Exclude chars contain all the required patterns');
  }
}

exports.generateRandomPwd = (condition) => {
  const { pwdLen, patterns, excludeChars } = condition;
  const patternList = typeof patterns === 'string' ? [patterns] : patterns;
  const charFilter = excludeChars ? Array.from(new Set(excludeChars.replace(/\s/g, '').split(''))) : null;
  const password = [];
  let counter = 0;

  while (counter < pwdLen) {
    const curKind = patternList[getRandomNum(patternList.length)];
    const randomChar = charAscii.pickupRandomOne(curKind);

    if (charFilter && charFilter.includes(randomChar)) continue;
    password.push(randomChar);
    counter++;
  }
  return password.join('');
}

exports.errHandler = (err, _req, res, _next) => {
  if (err.name === 'invalidInput') {
    res.status(err.statusCode).send(err.message);
  } else {
    res.status(500).send('Internal server error!');
    console.error(err);
  }
}

const charAscii = new CharAsciiTable();
