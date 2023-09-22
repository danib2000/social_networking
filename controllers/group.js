const Group = require("../modules/Group");
const { body, validationResult } = require("express-validator");

class GroupController {
  async createNewGroup(newGroup) {
    return new Promise(async (resolve, reject) => {
      const group = await Group.find({ name: newGroup.name });
      console.log(
        "🚀 ~ file: group.js:8 ~ GroupController ~ returnnewPromise ~ group:",
        group
      );

      if (group) {
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
    throw new Error(err.message);
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
}

module.exports = new GroupController();
