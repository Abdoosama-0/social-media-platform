require('dotenv').config()
const redis=require('../config/redis')
const User=require('../models/User')
const {isValidEmail} = require('../utility/validate')
const getMyData = async (req, res) => {
  try {
    const user = await User.findById(req.user.userID)
      .populate({
        path: "posts",
        populate: {
          path: "author",
          select: "name profileImageURL",
        },
      })
      .lean();

    if (!user) {
      return res.status(404).json({
        msg: "there is no user",
      });
    }

const formattedPosts = user.posts
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .map((post) => ({
    ...post,
    commentsCount: post.comments?.length || 0,
  }));
    return res.status(200).json({
      user,
      posts: formattedPosts,
      postsCount: formattedPosts.length,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateUserData=async(req,res)=>{
    let {name,username , email ,profileImageURL} =req.body
    if(!name && !username && !email && !req.file){
        return res.status(400).json({msg:"Please provide at least one field to update"})
        }
     if (email) {
    const result = await isValidEmail(email);
    if (!result.valid) {
      return res.status(400).json({ msg: result.msg });
    }
  }
    if (req.file) {
        profileImageURL = req.file.path;
        }

    const updates = {
      ...(name && { name }),
      ...(username && { username }),
      ...(email && { email }),
      ...(profileImageURL && { profileImageURL }),
    };

    const user=await User.findByIdAndUpdate(req.user.userID,updates,{new:true})

    if(!user){return res.status(404).json({msg:"there is no user"})}
 

    return res.status(200).json({user:user})
}

const deleteUser=async(req,res)=>{
    const user = await User.findByIdAndDelete(req.user.userID)
    if(!user){ return res.status(404).json({msg:"there is no user"})}
    res.clearCookie("access_token");
    await redis.del(`refresh:${req.user.userID}`);
    return res.status(200).json({msg:"user deleted successfully",user:user})
}
const follow = async (req, res) => {
  const userID = req.params.userId;

  if (!userID) {
    return res.status(400).json({
      msg: "Please provide a userID to follow",
    });
  }

  const user = await User.findById(req.user.userID);

  if (!user) {
    return res.status(404).json({
      msg: "User not found",
    });
  }

  const userToFollow = await User.findById(userID);

  if (!userToFollow) {
    return res.status(404).json({
      msg: "User to follow not found",
    });
  }

  // منع متابعة النفس
  if (user._id.toString() === userID) {
    return res.status(400).json({
      msg: "You cannot follow yourself",
    });
  }

  const isFollowing = user.following.some(
    (id) => id.toString() === userID
  );

  if (isFollowing) {
    // unfollow
    user.following = user.following.filter(
      (id) => id.toString() !== userID
    );

    userToFollow.followers =
      userToFollow.followers.filter(
        (id) => id.toString() !== user._id.toString()
      );

    await user.save();
    await userToFollow.save();

    return res.status(200).json({
      msg: "Unfollowed successfully",
      isFollowing: false,
    });
  }

  // follow
  user.following.push(userID);
  userToFollow.followers.push(user._id);

  await user.save();
  await userToFollow.save();

  return res.status(200).json({
    msg: "Followed successfully",
    isFollowing: true,
  });
};
const getUserData = async (req, res) => {
  try {
        const { userId } = req.params;

    const user = await User.findById(userId)
      .populate({
        path: "posts",
        populate: {
          path: "author",
          select: "name profileImageURL",
        },
      })
      .lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

const formattedPosts = user.posts
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .map((post) => ({
    ...post,
    commentsCount: post.comments?.length || 0,
  }));

    return res.status(200).json({
      user: {
        ...user,
        posts: formattedPosts,
      },

      posts: formattedPosts,

      postsCount: formattedPosts.length,

      followersCount: user.followers?.length || 0,

      followingCount: user.following?.length || 0,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



const getUserFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate({
        path: "followers",
        select: "_id profileImageURL username",
        options: { limit: 1000 },
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      followers: user.followers,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const getUserFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate({
        path: "following",
        select: "_id profileImageURL username",
        options: { limit: 1000 },
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      following: user.following,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
module.exports={getMyData,updateUserData,deleteUser,follow,getUserData,getUserFollowers,getUserFollowing}