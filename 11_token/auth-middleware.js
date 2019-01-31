'use strict';
var httpRequest = require('request');
var JWT = require('jwt-simple');

module.exports = {
  verifyReq: function (req, res, next) {

    if (req.headers.authorization) {
      res.setHeader('Content-Type', 'text/html');
      res.write('<div id="_mscontent"><script src="https://static.eu1.mindsphere.io/osbar/js/main.min.js"></script>');
      res.write("<h1>Hello World</h1>");

      var notAuthorized = false;
      var authorization = req.headers.authorization;
      console.log("authorization: " + authorization);

      if (authorization) {
        req.isAuthorized = true;
      }
      try {
        var decodedJWT = JWT.decode(authorization.split(' ')[1], "", true);
      } catch (e) {
        notAuthorized = true;
      }
      if (decodedJWT && !notAuthorized) {
        req.isAuthorized = true;

        res.write("<h2>Token (JWT)</h2>");
        res.write('<textarea id="myInput" rows="15" cols="150">');
        res.write(authorization.split(' ')[1]);
        res.write('</textarea>');
        res.write('<br><button onclick="copyToClipboard()">Copy token (JWT)</button>');
        res.write('<script>function copyToClipboard() {var copyText = document.getElementById("myInput");copyText.select();document.execCommand("Copy");}</script>');

        res.write("<h2>Decoded token</h2>");
        res.write("<pre>" + JSON.stringify(decodedJWT, null, 2) + "</pre>");
        res.write("</div>");
        res.write('<script>_msb.init({title: "Token App",appId: "_mscontent"});</script>')
        res.end();
      }
      else {
        req.isAuthorized = false;
        if (res) {
          res.status(401); // Not Authorized
          res.end('Not Authorized!');
          return;
        }
      }
    }
    else {
      req.isAuthorized = false;
      res.status(401); // Not Authorized
      res.end('Not Authorized!');
      return;
    }

    if (next) {
      next();
    }

    return req.isAuthorized === true;
  }
};
