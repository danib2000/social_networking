const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../modules/User");
const userController = require("../controllers/user");

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

router.get("/", (req, res, next) => {
  User.find()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/tokenDetails", (req, res, next) => {
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
  } else {
    res.sendStatus(403);
    return;
  }
  try {
    userController
      .getUserDetailsFromToken(req.token)
      .then((customer) => {
        res.status(200).json(customer);
        return;
      })
      .catch((err) => {
        console.log("🚀 ~ file: user.js:67 ~ router.get ~ err:", err);
        res.sendStatus(400);
        return;
      });
  } catch (err) {
    console.error(err);
    if (err.message === "Not Found") {
      res.status(404).json({ Error: err.message });
      return;
    } else {
      res.status(400).json({ Error: err.message });
      return;
    }
  }
});
router.get("/getNotification", (req, res) => {
  try {
    userController.getAllNotificationForUser(req.body.userName);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
  }
});

//GET by id
router.get("/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "not a valid id" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//POST requests
router.post("/", (req, res, next) => {
  console.log(userController);
  try {
    userController
      .addNewUser(
        req.body.userName,
        req.body.email,
        req.body.password,
        req.body.role
      )
      .then(() => res.sendStatus(200))
      .catch((err) => {
        res.status(409).json({ Error: err.message });
      });
  } catch (err) {
    console.error(err);
    if (err.message === "Not Found") {
      res.status(404).json({ Error: err.message });
    } else {
      res.status(400).json({ Error: err.message });
    }
  }
});
router.delete("/", (req, res) => {
  try {
    userController.deleteUser(req.body.id).then(res.sendStatus(200));
  } catch (err) {
    if (err.message === "Not Found") {
      res.status(404).json({ Error: err.message });
    } else {
      res.status(400).json({ Error: err.message });
    }
  }
});
router.put("/", (req, res) => {
  try {
    userController
      .updateUser(
        req.body.userName,
        req.body.newPassword,
        req.body.newRole,
        req.body.newEmail
      )
      .then((token) => {
        res.status(200).json({ Update: "Updated user!", token: token });
      })
      .catch((err) => {
        if (err.message === "Not Found") {
          res.status(404).json({ Error: err.message });
        } else {
          res.status(400).json({ Error: err.message });
        }
      });
  } catch (err) {
    if (err.message === "Not Found") {
      res.status(404).json({ Error: err.message });
    } else {
      res.status(400).json({ Error: err.message });
    }
  }
});

router.post("/authenticate", (req, res, next) => {
  try {
    userController
      .authenticateLogIn(req.body.userName, req.body.password)
      .then((token) => {
        res.status(200).json({ token: token });
      })
      .catch((err) => {
        console.error(err);
        if (err.message === "Not Found") {
          res.status(404).json({ Error: err.message });
        } else {
          res.status(400).json({ Error: err.message });
        }
      });
  } catch (err) {
    console.error(err);
    if (err.message === "Not Found") {
      res.status(404).json({ Error: err.message });
    } else {
      res.status(400).json({ Error: err.message });
    }
  }
});

router.post("/newNotification", (req, res) => {
  try {
    userController
      .addNewNotification(
        req.body.notificationUser,
        req.body.userToNotify,
        req.body.notifyAdmin,
        req.body.type,
        req.body.info
      )
      .then(() => {
        res.status(200).json({ notification: "created!" });
      })
      .catch((err) => {
        console.error(err);
        if (err.message === "Not Found") {
          res.status(404).json({ Error: err.message });
        } else {
          res.status(400).json({ Error: err.message });
        }
      });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
