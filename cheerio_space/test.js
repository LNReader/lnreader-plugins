const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const body = fs.readFileSync(path.join(__dirname, 'source.html')).toString();
const loadedCheerio = cheerio.load(body);
