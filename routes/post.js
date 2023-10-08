const express = require("express");
const router = express.Router();
const Post = require("../modules/Post");
const User = require("../modules/User");
const postController = require("../controllers/post");
const { body, validationResult } = require("express-validator");


router.get("/", async (req, res) => {

    const groupId = req.query.groupId
    const userId = req.query.userId

    if (!groupId && !userId) {
        res.status(400).json({ message: "No params" })
        return
    }

    const post = await Post.find({ $or: [{ 'group': groupId }, { 'user': userId }] });
    if (!post.length) {
        res.status(404).json({ message: "Group not found" });
        return
    }
    res.status(200).json(post);
    return
});

// Create a post
router.post(
    "/",
    [
        body("title").exists().isString().isLength({ min: 3 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            await postController.createNewPost(req.body)
            res.status(201).json(req.body);
        } catch (err) {
            console.log(err)
            res.status(err.status).json(err.message);
        }
    }
);

router.post("/:postid/comment", async (req, res) => {
    const header = req.headers.authorization;
    const postId = req.params.postid;
    try {
        await postController.addComment(postId, req.body);
        res.status(200).json({ message: "Comment Added successfully" });
        return;
    } catch (err) {
        res.status(err.status).json(err.message);
    }
})


router.post("/:postid/like/:userid", async (req, res) => {
    const header = req.headers.authorization;
    const postId = req.params.postid;
    const userId = req.params.userid;
    try {
        await postController.likePost(postId, userId);
        res.status(200).json({ message: "Liked" });
        return;
    } catch (err) {
        res.status(500).json(err.message);
    }
});

router.post("/:postid/dislike/:userid", async (req, res) => {
    const header = req.headers.authorization;
    const postId = req.params.postid;
    const userId = req.params.userid;
    try {
        await postController.dislikePost(postId, userId);
        res.status(200).json({ message: "Liked" });
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
        try {
            postController.updatePost(req.params.id, req.body);
            res.status(204).json({ message: "Post deleted" });
            return;
        } catch (err) {
            res.status(err.status).json(err.message);
        }
    }
);

// Delete a post
router.delete("/:id", async (req, res) => {
    try {
        await postController.deletePost(req.params.id);
        res.status(204).json({ message: "Post deleted" });
        return;
    } catch (err) {
        res.status(err.status).json(err.message);
    }
});


module.exports = router;
