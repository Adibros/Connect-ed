const express = require("express");
const {createPost, likeAndUnlikePost, deletePost, getPostOfFollowing, updateCaption, addComment, deleteComment} = require("../controllers/post");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.route("/post/upload").post(isAuthenticated,createPost);

router.route("/post/update/caption/:id").put(isAuthenticated,updateCaption);

router.route("/post/:id")
    .get(isAuthenticated,likeAndUnlikePost)
    .delete(isAuthenticated,deletePost);

router.route("/posts").get(isAuthenticated,getPostOfFollowing);

router.route("/post/comment/:id")
    .put(isAuthenticated,addComment)
    .delete(isAuthenticated,deleteComment);
    
module.exports = router;