const async = require('async');
const express = require('express');
const SMTPConnection = require('smtp-connection');
const xmlrpc = require('xmlrpc');

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error('No API_KEY.');
  process.exit(-1);
}

const api = xmlrpc.createSecureClient({
  host: 'rpc.gandi.net',
  port: 443,
  path: '/xmlrpc/'
});

const app = express();
const port = process.env.port || 8000;

app.get('/cpw', (req, res, next) => {
  if (!req.query.email || !req.query.old_password || !req.query.new_password) {
    res.sendStatus(400);
  }

  async.waterfall([
    function smtpConnect(cb) {
      var smtpConn = new SMTPConnection({
        host: 'mail.gandi.net',
        port: 587
      });

      smtpConn.connect((err, ok) => {
        if (err) return cb(err);

        if (!smtpConn.secure) {
          return cb(new Error('Connection is not secured.'));
        }

        return cb(null, smtpConn);
      });
    },
    function checkOldPassword(smtpConn, cb) {
      smtpConn.login({
        user: req.query.email,
        pass: req.query.old_password
      }, (err, ok) => {
        smtpConn.quit();
        if (err) {
          err = new Error('Old password is probably not correct.');
          err.status = 403;

          return cb(err);
        }

        return cb(null, null);
      });
    },
    function changePassword(result, cb) {
      var [id, domain] = req.query.email.split('@');

      console.log(`Changing password for ${id}@${domain}`);

      api.methodCall('domain.mailbox.update', [
        API_KEY,
        domain,
        id,
        {password: req.query.new_password}
      ], (err, value) => {
        if (err) return cb(err);

        return cb(null, true);
      });
    }
  ], (err, results) => {
    if (err) {
      if (err.message.indexOf('it is based on a dictionary word') !== -1) {
        return res.status(400).send(
          'New password is based on a dictionary ' +
          'word.'
        );
      }

      if (err.message.indexOf('string does not match \'^.{8,200}$\'') !== -1) {
        return res.status(400).send(
          'Password must contains at least 8 ' +
          'characters (including 2 digits and 2 special characters), or be ' +
          'at least 16 characters long.'
        );
      }

      return next(err);
    }

    return res.sendStatus(200);
  });
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Listening on port ${port}.`);
});
