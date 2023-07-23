const ASCII_NUM_START = 48;
const ASCII_NUM_END = 57;
const ASCII_UPPER_START = 65;
const ASCII_UPPER_END = 90;
const ASCII_LOWER_START = 97;
const ASCII_LOWER_END = 122;
const ASCII_CHAR_START = 33;
const ASCII_CHAR_END = 126;
const PATTERN_LIST = ['number', 'uppercase', 'lowercase', 'symbols'];
let filterChars = null;

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

function sanitizeFilterChars(excludeChars, patternList) {
  return Array.from(new Set(excludeChars.replace(/\s/g, '').split(''))).filter((c) => {
    const charCode = c.charCodeAt(0);
    for (let i = 0; i < patternList.length; i++) {
      if (charAscii[patternList[i]].includes(charCode)) return true;
    }
    return false;
  })
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
    filterChars = sanitizeFilterChars(excludeChars, patternList);
    const charPatternLen = patternList.reduce((sum, pattern) => {
      sum += charAscii[pattern].length;
      return sum;
    }, 0);
    if (filterChars.length >= charPatternLen) {
      filterChars = null;
      throwInputErr('Exclude chars contain all the required patterns');
    }
  }
}

exports.generateRandomPwd = (condition) => {
  const { pwdLen, patterns } = condition;
  const patternList = typeof patterns === 'string' ? [patterns] : patterns;
  const password = [];
  let counter = 0;

  while (counter < pwdLen) {
    const curKind = patternList[getRandomNum(patternList.length)];
    const randomChar = charAscii.pickupRandomOne(curKind);

    if (filterChars && filterChars.includes(randomChar)) continue;
    password.push(randomChar);
    counter++;
  }

  filterChars = null;
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
