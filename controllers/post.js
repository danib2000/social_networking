const Group = require("../modules/Group");
const Post = require("../modules/Post");
const User = require("../modules/User")
const { body, validationResult } = require("express-validator");
const userController = require("../controllers/user");


class PostController {


    async searchPost(params) {

    }
    async createNewPost(body) {
      const newPost = new Post(body);

        return new Promise(async (resolve, reject) => {
            const creator = await User.findById(newPost.user);
            const group = await Group.findById(newPost.group)
            if (!creator) {
              reject({status: 400, message: "User not found"})
            }
      
            if (!group) {
              reject({ status: 400, message: "Ground not found" });
            }
            newPost
              .save()
              .then(() => {
                resolve();
              })
              .catch((err) => {
                reject(err);
              });
          });
        }

    async updatePost(postId, postToUpdate) {
    const post = await post.findById(postId);

    if (!post) {
      res.status(404).json({ message: "post not found" });
      return;
    }

    Object.assign(post, postToUpdate);
    return new Promise((resolve, reject) => {
      post
        .save()
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
    }

    async addComment(postId, comment) {
        return new Promise(async (resolve, reject) => {
          const post = await Post.findById(postId)
          if (!post) {
            reject({status:400, message: "Post not found"})
          }

          const user = await User.findById(comment.user)
          if (!user) {
            reject({status:400, message: "User not found"})
          }

          post.comment.push(comment)
          post.save()
          resolve()

        })
    }

    async likePost(postId, userId) {
      console.log(postId)
      return new Promise(async (resolve, reject) => {
        const post = await Post.findById(postId);
        const user = await User.findById(userId)
        console.log(post)
        if (!post) {
          reject({status: 404, message: "post not found"})
          return;
        }
  
        if (!user) {
          reject({status: 400, message: "user not found"})
          return;
        }

        if (post.like.includes(userId)) {
          reject({status:400, "message": "user already likes"})
        }
        post.like.push(userId);

        await post.save();

        resolve();
        

      })
    }

    async dislikePost(postId, userId)  {
      console.log(postId)
      return new Promise(async (resolve, reject) => {
        const post = await Post.findById(postId);
        const user = await User.findById(userId)
        console.log(post)
        if (!post) {
          reject({status: 404, message: "post not found"})
          return;
        }
  
        if (!user) {
          reject({status: 400, message: "user not found"})
          return;
        } 

        if (post.dislike.includes(userId)) {
          reject({status:400, "message": "user already dislikes"})
        }

        post.dislike.push(userId);

        await post.save();

        resolve();
      })
      
    }

    async deletePost(postId) {
    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ message: "post not found" });
      return;
    }
    return new Promise((resolve, reject) => {
      post
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

module.exports = new PostController();
