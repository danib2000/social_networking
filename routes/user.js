const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../modules/User');
const customerController = require('../contollers/user');

/**
 * Verify Token
 * FORMAT:
 * Authorization: Bearer <access_token>
 */
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers["authorization"];
    // check if bearer is undefined
    if (typeof bearerHeader !== "undefined") {
      // split at space
      const bearer = bearerHeader.split(" ");
      // Get Token from array
      const bearerToken = bearer[1];
      // Set token
      req.token = bearerToken;
      // continue
      next();
    } else {
      res.sendStatus(403);
}
}





module.exports = router;