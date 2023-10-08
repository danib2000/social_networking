const express = require("express");
const router = express.Router();
const Group = require("../modules/Group");
const User = require("../modules/User");
const groupController = require("../controllers/group");
const userController = require("../controllers/user");
const { body, validationResult } = require("express-validator");

router.get("/", async (req, res) => {
  Group.find()
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

router.get("/:name", async (req, res) => {
  const group = await Group.find({ name: req.params.name });
  console.log(group);

  if (!group) {
    res.status(404).json({ message: "Group not found" });
  }

  res.json(group);
});

// Create a group
router.post(
  "/",
  [
    body("name").exists().isString().isLength({ min: 3 }),
    body("description").optional().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      await groupController.createNewGroup(group,);
      res.status(201).json(group);
    } catch (err) {
      res.status(err.status).json(err.message);
    }
  }
);

router.post("/:groupid/addUser/:userid", async (req, res) => {
  const header = req.headers.authorization;
  const groupId = req.params.groupid;
  const userId = req.params.userid;
  try {
    await groupController.addUserToGroup(groupId, userId, header.split(" ")[1]);
    res.status(200).json({ message: "User Added to group successfully" });
    return;
  } catch (err) {
    res.status(err.status).json(err.message);
  }
});

// Update a group
router.put(
  "/:id",
  [
    body("name").optional().isString().isLength({ min: 3 }),
    body("description").optional().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    groupController.updateGroup(req.params.id, req.body);

    res.status(200).json(group);
  }
);

// Delete a group
router.delete("/:id", async (req, res) => {
  try {
    await groupController.deleteGroup(req.params.id);
    res.status(204).json({ message: "Group deleted" });
    return;
  } catch (err) {
    res.status(err.status).json(err.message);
  }
});

// Remove a user from a group
router.delete("/:groupid/removeUser/:userId", async (req, res) => {
  const header = req.headers.authorization;
  const groupId = req.params.groupid;
  const userId = req.params.userid;
  try {
    await groupController.removeUserToGroup(groupId, userId, header.split(" ")[1]);
    res.status(200).json({ message: "User removed from group successfully" });
    return;
  } catch (err) {
    res.status(err.status).json(err.message);
  }
});

module.exports = router;
