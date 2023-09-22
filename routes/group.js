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

// router.get("/:name", async (req, res) => {
//   const group = await Group.find({ name: req.params.name });
//   console.log(group);

//   if (group) {
//     res.status(404).json({ message: "Group not found" });
//   }

//   res.json(group);
// });
// Get a group by ID
router.get("/:id", async (req, res) => {
  const group = await Group.findById(req.params.id);

  if (!group) {
    res.status(404).json({ message: "Group not found" });
    return;
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

    const group = new Group(req.body);
    const creator = await User.findById(group.creator);
    if (!creator) {
      res.status(404).json({ errors: "Creator not found" });
      return;
    }

    console.log(groupController);
    try {
      await groupController.createNewGroup(group);
      res.status(201).json(group);
    } catch (err) {
      console.log(err);
      res.status(err.status).json(err.message);
    }
  }
);

router.post("/:groupid/addUser/:userid", async (req, res) => {
  const header = req.headers.authorization;
  try {
    userDetails = await userController.getUserDetailsFromToken(
      header.split(" ")[1]
    );
    const groupId = req.params.groupid;
    const userId = req.params.userid;
    console.log("🚀 ~ file: group.js:86 ~ router.post ~ userId:", userId);

    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    if (group.creator != userDetails.id) {
      res.status(403).json({ message: "Forbbiden to change this group" });
    }

    const user = await User.findById(userId);
    console.log("🚀 ~ file: group.js:99 ~ router.post ~ user:", user);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (group.members.includes(userId)) {
      res
        .status(400)
        .json({ message: "User is already a member of the group" });
      return;
    }

    group.members.push(userId);

    await group.save();

    res.status(200).json({ message: "User Added to group successfully" });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Unauthorized" });
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
  await groupController.deleteGroup(req.params.id);

  res.status(204).send();
});

// Remove a user from a group
router.delete("/:groupid/removeUser/:userId", async (req, res) => {
  const header = req.headers.authorization;
  try {
    userDetails = await userController.getUserDetailsFromToken(
      header.split(" ")[1]
    );
    const groupId = req.params.groupid;
    const userId = req.params.userId;

    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    if (group.creator != userDetails.id) {
      res.status(403).json({ message: "Forbbiden to change this group" });
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!group.members.includes(userId)) {
      res.status(400).json({ message: "User is not a member of the group" });
      return;
    }

    group.members.remove(userId);

    await group.save();

    res.status(200).json({ message: "User removed from group successfully" });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;
