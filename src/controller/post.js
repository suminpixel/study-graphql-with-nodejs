const ApiResult = require('../model/ApiResult');
const ConnectedUser = require('../database/schemas/ConnectedUser');
const Post = require('../database/schemas/Post');
const Comment = require('../database/schemas/Comment');
const Like = require('../database/schemas/Like');

const writePost = async (req, res, next) => {
  const user = req.user;

  try {
    const post = new Post({
      ...req.body,
      writer: user,
    });
    await post.save();

    res.send(ApiResult.OK(post));
  } catch (error) {
    return next(error);
  }
};

const getPostList = async (req, res, next) => {
  const user = req.user;
  const { userId } = req.params;
  const { offset, limit } = req.query;

  try {
    const connectedUsers = await ConnectedUser.find({ user: userId }).select('follower').exec();
    const followerIds = connectedUsers.map((connectedUser) => connectedUser.follower);
    const posts = await Post
      .find({
        writer: {
          $in: followerIds.concat(userId),
        },
      })
      .skip(offset)
      .limit(limit)
      .populate({ path: 'writer', select: 'name email' })
      .populate({
        path: 'comments',
        select: 'contents',
        populate: {
          path: 'writer',
          select: 'name profileImageUrl',
        },
      })
      .sort({ createdAt: 'desc' })
      .exec();
    const calculatedPosts = await Promise.all(posts.map(async (post) => {
      const calculatedPost = post.toObject();
      const likesOfThisPost = await Like.find({ post: post._id }).exec();
      const likesOfMe = likesOfThisPost
        .some((like) => like.toObject().user.toString() === user._id.toString());
      calculatedPost.likes = likesOfThisPost.length;
      calculatedPost.likesOfMe = likesOfMe;

      return calculatedPost;
    }));

    res.send(ApiResult.OK(calculatedPosts));
  } catch (error) {
    return next(error);
  }
};

const writeComments = async (req, res, next) => {
  const user = req.user;
  const { postId } = req.params;

  try {
    const foundPost = await Post.findById(postId).exec();
    const comment = new Comment({
      ...req.body,
      post: foundPost,
      writer: user,
    });
    await comment.save();
    await foundPost
      .update({
        comments: foundPost.comments.concat(comment),
      })
      .exec();

    res.send(ApiResult.OK(comment));
  } catch (error) {
    return next(error);
  }
};

const getCommentList = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const comments = await Comment
      .find({
        post: postId,
      })
      .populate({ path: 'post', select: '-modifiedAt' })
      .populate({ path: 'writer', select: '-modifiedAt' })
      .exec();

    res.send(ApiResult.OK(comments));
  } catch (error) {
    return next(error);
  }
};

const likePost = async (req, res, next) => {
  const user = req.user;
  const { postId } = req.params;

  try {
    const like = new Like({
      user: user._id,
      post: postId,
    });
    await like.save();
    const post = (await Post.findById(postId).exec()).toObject();
    // aggregate, count 모두 가능한 방법
    const likesOfThisPost = await Like.find({ post: postId }).exec();
    const likesOfMe = likesOfThisPost
      .some((like) => like.toObject().user.toString() === user._id.toString());
    post.likes = likesOfThisPost.length;
    post.likesOfMe = likesOfMe;

    res.send(ApiResult.OK(post));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  writePost,
  getPostList,
  writeComments,
  getCommentList,
  likePost,
};
