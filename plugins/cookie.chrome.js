var log = require('../log');
var Plugin = require('../plugin');
var session = require('../session');

// [Usage]
//
// TODO: still WIP
//
var plugin = new Plugin(13, 'cookie.chrome', '2017.12.23',
    'Plugin to reuse Chrome\'s leetcode cookie.',
    ['keytar:darwin', 'sqlite3']);

plugin.help = function() {
  if (os.platform === 'linux') {
    log.info('To complete the install: sudo apt install libsecret-tools');
  }
};

var Chrome = {};

var ChromeMAC = {
  db:          process.env.HOME + '/Library/Application Support/Google/Chrome/Default/Cookies',
  iterations:  1003,
  getPassword: function(cb) {
    var keytar = require('keytar');
    keytar.getPassword('Chrome Safe Storage', 'Chrome').then(cb);
  }
};

var ChromeLinux = {
  db:          process.env.HOME + '/.config/google-chrome/Default/Cookies',
  iterations:  1,
  getPassword: function(cb) {
    // FIXME: keytar failed to read gnome-keyring on ubuntu??
    var cmd = 'secret-tool lookup application chrome';
    var password = require('child_process').execSync(cmd).toString();
    return cb(password);
  }
};

var ChromeWindows = {
  // TODO
};

Object.setPrototypeOf(ChromeMAC, Chrome);
Object.setPrototypeOf(ChromeLinux, Chrome);
Object.setPrototypeOf(ChromeWindows, Chrome);

Chrome.getInstance = function() {
  switch (process.platform) {
    case 'darwin': return ChromeMAC;
    case 'linux':  return ChromeLinux;
    case 'win32':  return ChromeWindows;
  }
};
var my = Chrome.getInstance();

Chrome.decodeCookie = function(cookie, cb) {
  var crypto = require('crypto');
  crypto.pbkdf2(my.password, 'saltysalt', my.iterations, 16, 'sha1', function(e, key) {
    if (e) return cb(e);

    var iv = new Buffer(' '.repeat(16));
    var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    decipher.setAutoPadding(false);

    var buf = decipher.update(cookie.slice(3)); // remove prefix "v10" or "v11"
    var final = decipher.final();
    final.copy(buf, buf.length - 1);

    var padding = buf[buf.length - 1];
    if (padding) buf = buf.slice(0, buf.length - padding);

    return cb(null, buf.toString('utf8'));
  });
};

Chrome.decodeCookies = function(keys, cb) {
  if (keys.length === 0) return cb(null, my.cookies);

  var k = keys.pop();
  var v = my.cookies[k];
  if (!v) return cb('Not found cookie: ' + k);

  my.decodeCookie(v, function(e, cookie) {
    my.cookies[k] = cookie;
    my.decodeCookies(keys, cb);
  });
};

var KEYS = ['csrftoken', 'LEETCODE_SESSION'];
Chrome.getCookies = function(cb) {
  var sqlite3 = require('sqlite3');
  var db = new sqlite3.Database(my.db);

  db.serialize(function() {
    my.cookies = {};
    var sql = 'select name, encrypted_value from cookies where host_key like "%leetcode.com"';
    db.each(sql, function(e, x) {
      if (e) return cb(e);
      if (KEYS.indexOf(x.name) < 0) return;
      my.cookies[x.name] = x.encrypted_value;
    });

    db.close(function() {
      my.getPassword(function(password) {
        my.password = password;
        my.decodeCookies(KEYS, cb);
      });
    });
  });
};

plugin.signin = function(user, cb) {
  log.debug('running cookie.chrome.signin');
  log.debug('try to copy leetcode cookies from chrome ...');
  my.getCookies(function(e, cookie) {
    if (e) {
      log.error('failed to copy cookies: ' + e);
      return plugin.next.signin(user, cb);
    }

    log.debug('Successfully copied leetcode cookies!');
    user.sessionId = cookie.LEETCODE_SESSION;
    user.sessionCSRF = cookie.csrftoken;
    session.saveUser(user);
    return cb(null, user);
  });
};

plugin.login = function(user, cb) {
  log.debug('running cookie.chrome.login');
  plugin.signin(user, function(e, user) {
    if (e) return cb(e);
    plugin.getUser(user, cb);
  });
};

module.exports = plugin;
