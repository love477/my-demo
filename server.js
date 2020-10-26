const http = require('http');
const path = require('path');
const {I18n} = require('i18n');

const i18n = new I18n({
    locales: ['en', 'de', 'zh', 'zh-HK'],
    directory: path.join(__dirname, 'locales'),
    header: 'Accept-Language',
});

const app = http.createServer((req, res) => {
    i18n.init(req, res);
    i18n.setLocale('zh');
    res.end(i18n.__('Hello'));
});

app.listen(7001, '127.0.0.1');
