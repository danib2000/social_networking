const Group = require("../modules/Group");
const { body, validationResult } = require("express-validator");
const User = require("../modules/User")
const userController = require("../controllers/user");

class GroupController {
  async createNewGroup(body) {
    const newGroup = new Group(body);
    return new Promise(async (resolve, reject) => {
      
      const creator = await User.findById(newGroup.creator);

      if (!creator) {
        reject({status: 400, message: "Creator not found"})
      }
      const group = await Group.find({ name: newGroup.name });
      console.log(group)
      if (group.length) {
        reject({ status: 400, message: "Group name is taken" });
      }
      newGroup
        .save()
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  catch(err) {
    reject({status: 500, message:err.message})
  }

  async updateGroup(groupId, groupToUpdate) {
    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    Object.assign(group, groupToUpdate);
    return new Promise((resolve, reject) => {
      group
        .save()
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async deleteGroup(groupId) {
    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }
    return new Promise((resolve, reject) => {
      group
        .deleteOne()
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async addUserToGroup(groupId, userId, token) {
    return new Promise(async (resolve, reject) => {
      try {
        userDetails = await userController.getUserDetailsFromToken(token);

        const group = await Group.findById(groupId);

        if (!group) {
          return reject({ status: 404, message: "Group not found" });
        }

        if (group.creator != userDetails.id) {
          return reject({
            status: 403,
            message: "Forbbiden to change this group",
          });
        }

        const user = await User.findById(userId);

        if (!user) {
          return reject({ status: 404, message: "User not found" });
        }

        if (group.members.includes(userId)) {
          return reject({
            status: 400,
            message: "User is already a member of the group",
          });
        }

        group.members.push(userId);

        await group.save();

        resolve();
      } catch (err) {
        console.log(err);
        return reject({ status: 401, message: "Unauthorized" });
      }
    });
  }

  async removeUserToGroup(groupId, userId, token) {
    return new Promise(async (resolve, reject) => {
      try {
        userDetails = await userController.getUserDetailsFromToken(token);

        const group = await Group.findById(groupId);

        if (!group) {
          return reject({ status: 404, message: "Group not found" });
        }

        if (group.creator != userDetails.id) {
          return reject({
            status: 403,
            message: "Forbbiden to change this group",
          });
        }

        const user = await User.findById(userId);

        if (!user) {
          return reject({ status: 404, message: "User not found" });
        }

        if (!group.members.includes(userId)) {
          return reject({
            status: 400,
            message: "User is not a member of the group",
          });
        }

        group.members.remove(userId);
        await group.save();

        resolve();
      } catch (err) {
        console.log(err);
        return reject({ status: 401, message: "Unauthorized" });
      }
    });
  }
}

module.exports = new GroupController();
