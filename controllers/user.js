const UserSchema = require("../modules/User");
const crypto = require("crypto");
const generateSalt = require("csprng");
const jwt = require("jsonwebtoken");

class UserController {
  /**
   * get the user salt from record
   * @param {String} userName
   */
  async getUserSalt(userName) {
    try {
      const user = await UserSchema.findOne({ userName: userName });
      if (user) {
        return user.salt;
      } else {
        throw new Error("User not found");
      }
    } catch (err) {
      console.error(err);
      throw new Error("User not found");
    }
  }

  /**
   * hash given password by user salt, if userName correct
   * @param {String} password
   * @param {String} userName
   */
  async hashUserPassword(password, userName) {
    try {
      const salt = await this.getUserSalt(userName);
      const hash = await crypto
        .createHash("sha256")
        .update(password + salt)
        .digest("hex");
      return hash;
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  }

  /**
   * hash given password with salt
   * @param {String} password
   * @param {String} salt
   */
  async hashPassword(password, salt) {
    try {
      const hash = await crypto
        .createHash("sha256")
        .update(password + salt)
        .digest("hex");
      return hash;
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  }

  /**
   * generate new salt for user, after changing password
   */
  async generateSalt() {
    try {
      return generateSalt(256, 36);
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  }

  /**
   * validate user login info: userName validity and hased password validity.
   * @param {String} userName
   * @param {String} hasedPassword
   */
  async authenticateLogIn(userName, password) {
    try {
      // find user with the same userName
      const user = await UserSchema.findOne({ userName: userName });
      // hash given password
      const hasedPassword = await this.hashUserPassword(password, userName);
      if (user.passwordHash === hasedPassword) {
        // if passwords matches, generate and return user token.
        return new Promise((resolve, reject) => {
          this.saveUserToken(user)
            .then((token) => {
              resolve(token);
            })
            .catch((err) => {
              reject(err);
            });
        });
      } else {
        throw new Error("Authentication Failed");
      }
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  }

  /**
   * validate token and extract user detailes
   * @param {string jwt} token
   */
  async getUserDetailsFromToken(token) {
    try {
      return new Promise((resolve, reject) => {
        // decode token and response with two options:
        // The data from the token, or HTTP 403 Error
        jwt.verify(token, "test-secret-key", (err, authData) => {
          if (err) {
            reject(err);
          } else {
            // check if token is valid with the user
            UserSchema.findById(authData.id).then((user) => {
              console.log(authData);
              if (token === user.token) {
                resolve(authData);
              } else {
                reject(new Error("Expired token"));
              }
            });
          }
        });
      });
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  }

  /**
   * Add new user to database
   * @param {string} userName
   * @param {string} email
   * @param {string} password
   * @param {string} role
   */
  async addNewUser(userName, email, password, role) {
    try {
      // Generate new salt for the user
      const salt = await this.generateSalt();
      // Hash his password for saving
      const passwordHash = await this.hashPassword(password, salt);
      const newUser = new UserSchema({
        userName: userName,
        email: email,
        salt: salt,
        passwordHash: passwordHash,
        role: role,
      });

      return new Promise((resolve, reject) => {
        newUser
          .save()
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * update user details
   * @param {string} userName
   * @param {string} newPassword
   * @param {string} newRole
   * @param {string} newEmail
   */
  async updateUser(userName, newPassword, newRole, newEmail) {
    try {
      // Find the user
      const user = await UserSchema.findOne({ userName: userName });
      // After finding a user, generate new salt for him
      const salt = await this.generateSalt();
      // Hash the new password
      const passwordHash = await this.hashPassword(newPassword, salt);
      //change and save the user details
      user.passwordHash = passwordHash;
      user.salt = salt;
      user.email = newEmail;
      user.role = newRole;
      this.saveUserToken(user);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * creates a new notification
   * @param {*} notificationUser
   * @param {*} userToNotify
   * @param {*} notifieAdmin
   * @param {*} type
   * @param {*} info
   */
  async addNewNotification(
    notificationUserName,
    userToNotify,
    notifyAdmin,
    type,
    info
  ) {
    const usersToNotify = [];
    const notificationUser = await UserSchema.findOne({
      userName: notificationUserName,
    }).select("_id");
    if (userToNotify) {
      let id = await UserSchema.findOne({ userName: userToNotify }).select(
        "_id"
      );
      this.adjusteNotification(id, 1);
      usersToNotify.push(id);
    }
    if (notifyAdmin) {
      const userAdmins = await UserSchema.find({ role: "Admin" }).select("_id");
      userAdmins.forEach((id) => {
        this.adjusteNotification(id, 1);
        usersToNotify.push(id);
      });
    }
    const newNotification = new notificationScheme({
      usersToNotify: usersToNotify,
      notificationUser: notificationUser,
      type: type,
      info: info,
    });
    return new Promise((resolve, reject) => {
      newNotification
        .save()
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  /**
   * increments/decrement notification by amount
   * @param {string} uid
   * @param {int} amount
   */
  async adjusteNotification(uid, amount) {
    try {
      await UserSchema.findOneAndUpdate(
        { _id: uid },
        { $inc: { notification: amount } }
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * delete user record from db
   * @param {string} uid
   */
  async deleteUser(uid) {
    try {
      await UserSchema.deleteOne({ _id: uid });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * finds user id from userName
   * @param {string} userName
   */
  async getIdbyUserName(userName) {
    const id = await UserSchema.findOne({ userName: userName }).select("_id");
    console.log(id);
    return id;
  }
  async getpopulatedNotificationByUserId(uid) {
    const notifications = await notificationScheme
      .find({ usersToNotify: uid })
      .populate("usersToNotify");

    console.log(notifications[0].usersToNotify[0]);
  }
  async getAllNotificationForUser(userName) {
    const id = await this.getIdbyUserName(userName);
    this.getpopulatedNotificationByUserId(id);
  }
  /**
   * reset other user password
   * @param {string} uid
   * @param {string} newPassword
   */
  async resetUserPassword(uid, newPassword) {
    try {
      // Find the user
      const user = await UserSchema.findOne({ _id: uid });
      // Generate new salt
      const salt = await this.generateSalt();
      // Hash the new password
      const passwordHash = await this.hashPassword(newPassword, salt);
      // modify field and save
      user.salt = salt;
      user.passwordHash = passwordHash;
      this.saveUserToken(user);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * change own user password
   * @param {string jwt} token
   * @param {string} oldPassword
   * @param {string} newPassword
   */
  async changePassword(token, oldPassword, newPassword) {
    try {
      return new Promise((resolve, reject) => {
        // decode token and response with two options:
        // The data from the token, or HTTP 403 Error
        jwt.verify(token, "test-secret-key", (err, authData) => {
          if (err) {
            reject(err);
          } else {
            // after token is verified, extract id and find user

            UserSchema.findOne({ _id: authData.id }).then((user) => {
              // hash old password, and authenticate it is correct
              this.hashPassword(oldPassword, user.salt).then(
                (hashedPassword) => {
                  if (hashedPassword !== user.passwordHash) {
                    reject(new Error("Passwords do not match"));
                  } else {
                    // after varifying passwords, generate new salt and hash the password
                    this.generateSalt().then((salt) => {
                      this.hashPassword(newPassword, salt).then(
                        (newPasswordHashed) => {
                          // modify fields and save
                          user.salt = salt;
                          user.passwordHash = newPasswordHashed;
                          // create new token and return it
                          this.saveUserToken(user)
                            .then((token) => {
                              resolve(token);
                            })
                            .catch((err) => {
                              reject(err);
                            });
                        }
                      );
                    });
                  }
                }
              );
            });
          }
        });
      });
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  }

  /**
   * save user token to db and return token
   * @param {Document} user
   */
  async saveUserToken(user) {
    try {
      return new Promise((resolve, reject) => {
        jwt.sign(
          {
            id: user._id,
            email: user.email,
            userName: user.userName,
            role: user.role,
            address: user.address,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          "test-secret-key",
          { expiresIn: "5h" },
          async function (err, token) {
            if (err) {
              reject(err);
            }
            user.token = token;
            user.save();
            resolve(token);
          }
        );
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = new UserController();
