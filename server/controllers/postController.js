const Post=require('../models/Post')
const User=require('../models/User')
//http://localhost:3000/posts/?page=1
const getPosts = async (req, res) => {
  try {
    const limit = 10;

    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const currentUser = await User.findById(req.user.userID)
      .select("following")
      .lean();
      if (!currentUser) {
        return res.status(404).json({
          msg: "User not found",
          
        });
      }

    const followingSet = new Set(
      currentUser.following.map(id => id.toString())
    );

    const posts = await Post.find()
      .populate(
        "author",
        "name profileImageURL"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const postsWithCommentsCount = posts.map((post) => ({
      ...post,
      commentsCount: post.comments?.length || 0,

      // هل المستخدم الحالي متابع صاحب البوست؟
      isFollowingAuthor: followingSet.has(
        post.author._id.toString()
      ),
       isLiked: post.likes.some(
    (id) => id.toString() === currentUser._id.toString()
  ),
    }));

    const count =
      await Post.countDocuments();

    res.json({
      posts: postsWithCommentsCount,
      count,
      currentPage: page,
      hasMore:
        skip + posts.length < count,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "server error",
    });
  }
};
const getPost = async (req, res) => {
  try {
        const currentUserId = req.user.userID;

    const { postId } = req.params;

    const currentUser = await User.findById(req.user.userID)
      .select("following")
      .lean();

    if (!currentUser) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const followingSet = new Set(
      currentUser.following.map((id) => id.toString())
    );

    const post = await Post.findById(postId)
      .populate("author", "name profileImageURL")
      .lean();

    if (!post) {
      return res.status(404).json({
        msg: "post not found",
      });
    }

    const formattedPost = {
      ...post,
      commentsCount: post.comments?.length || 0,

      // 👇 نفس فكرة getPosts
      isFollowingAuthor: followingSet.has(
        post.author._id.toString()
      ),
      isLiked: post.likes.some(
        (id) => id.toString() === currentUserId
      ),
    };

    return res.status(200).json({
      msg: "post retrieved successfully",
      post: formattedPost,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};
const createPost = async (req, res) => {
  try {
    const { title } = req.body;
    const authorId = req.user.userID;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Please upload at least one image or video.",
      });
    }

    const media = req.files.map((file, index) => ({
      type: file.mimetype.startsWith("image/")
        ? "image"
        : "video",
      url: file.path,
      order: index,
    }));

    const newPost = new Post({
      title,
      author: authorId,
      media,
    });

    await newPost.save();

    await User.findByIdAndUpdate(authorId, {
      $push: { posts: newPost._id },
    });

    return res.status(201).json({
      post: newPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

 const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const posts = await Post.find({ author: userId })
      .populate("author", "name profileImageURL")
      .sort({ createdAt: -1 })
      .lean();

    const formattedPosts = posts.map((post) => ({
      ...post,
      commentsCount: post.comments?.length || 0,
    }));

    res.status(200).json({
      posts: formattedPosts,
      count: formattedPosts.length,
      currentPage: 1,
      hasMore: false,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Server error",
      error: error.msg,
    });
  }
};


const getMyPosts= async(req,res)=>{
    const userId=req.user.userID
    const user=await User.findById(userId).populate('posts')
 if(!user){
        return res.status(404).json({msg:"user not found"})
    }
    const count= await Post.countDocuments({author:userId});
    return res.status(200).json({msg:"success",count,allPosts:user.posts})
}
const updatePost= async(req,res)=>{
    const userId=req.user.userID
    const {postId}=req.params
    const post =await Post.findById(postId)
    if (!post){return res.status(404).json({msg:"post not found"})}

    if(userId!==post.author.toString()){return res.status(401).json({msg:"you can't update this post"})}

    if (req.files && req.files.length > 0) {
        req.body.images = req.files.map((file) => file.path);;

    }

    const updatedPost = await Post.findByIdAndUpdate(postId, req.body, { new: true });

    res.status(200).json({ msg: "Post updated successfully", post: updatedPost });

    
}

const deletePost =async(req,res)=>{

    const userId=req.user.userID
    const {postId}=req.params
    const post =await Post.findById(postId)
    if (!post){return res.status(404).json({msg:"post not found"})}

    if(userId!==post.author.toString()&&req.user.role!=="Admin"){return res.status(401).json({msg:"you can't update this post"})}


    const deletedPost = await Post.findByIdAndDelete(postId);

    res.status(200).json({ msg: "Post deleted successfully", deletedPost: deletedPost });
}
//=========================================
const Like = async (req, res) => {

  const { postId } = req.params;

    const currentUserId = req.user.userID;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({
      msg: "post not found",
    });
  }

  const userId = req.user.userID;

  const alreadyLiked = post.likes.some(
    (id) => id.toString() === userId
  );

  if (alreadyLiked) {
    post.likes = post.likes.filter(
      (id) => id.toString() !== userId
    );
  } else {
    post.likes.push(userId);
  }

  post.likesCount = post.likes.length;

  await post.save();

  const updatedPost = await Post.findById(postId)
    .populate(
      "author",
      "name profileImageURL"
    )
    .lean();

  updatedPost.commentsCount =
    updatedPost.comments?.length || 0;

        updatedPost.isLiked = updatedPost.likes.some(
      (id) => id.toString() === currentUserId
    );

  res.status(200).json({
    post: updatedPost,
  });
};
 const getPostLikes = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("likes", "name profileImageURL")
      .select("likes");

    if (!post) {
      return res.status(404).json({
        msg: "Post not found",
      });
    }

    res.status(200).json({
      likesCount: post.likes.length,
      likes: post.likes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Server error",
      error: error.msg,
    });
  }
};
//==========================================
const addComment =async(req,res)=>{
    const {postId}=req.params
    const userId =req.user.userID
    const {comment}=req.body
    const commentImage =req.file? req.file.path:undefined

    const post = await Post.findByIdAndUpdate(postId, {   $push: { comments: { userid: userId, comment,commentImage } }},{ new: true });
   if(!post){return res.status(404).json({msg:"post not found"})}
   res.status(200).json({msg:"Comment added successfully",post:post})
}

const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("comments.userid", "username profileImageURL ")
      .select("comments");

    if (!post) {
      return res.status(404).json({
        msg: "post not found",
      });
    }

    res.status(200).json({
      comments: post.comments.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      msg: "server error",
      error: error.msg,
    });
  }
};
const deleteComment=async(req,res)=>{

    const {commentId}=req.params
    const userId=req.user.userID
    //============================================
           const post = await Post.findOne({ "comments._id": commentId });
           if (!post) {return res.status(404).json({msg:"1: comment not found"})}
   
           
           const comment = post.comments.find(c => c._id.toString() === commentId);
           if (!comment) {return res.status(404).json({msg:"2: comment not found"})}
   
          
           if (post.author.toString() !== userId && comment.userid.toString() !== userId&&req.user.role!=="Admin") {return res.status(401).json({msg:"you can't update this post"})}
      //============================================
        
   
    
    const postAfter=await Post.findOneAndUpdate(
        { "comments._id": commentId }, 
        { $pull: { comments: { _id: commentId } } }, 
        { new: true } 
    )
    
    res.status(200).json({ msg: "comment deleted successfully", postAfter: postAfter });
}

const updateComment =async(req,res)=>{
    const userId=req.user.userID
    const {commentId}=req.params
    const {comment}=req.body
//=================================check======================================
    const post = await Post.findOne({ "comments._id": commentId });
    if (!post) {return res.status(404).json({msg:"1: comment not found"})}

    
    const commentToUpdate = post.comments.find(c => c._id.toString() === commentId);
    if (!commentToUpdate) {return res.status(404).json({msg:"2: comment not found"})}

   
    if (commentToUpdate.userid.toString() !== userId) {return res.status(401).json({msg:"you can't update this post"})}
//=======================================================================
const imageUrl=req.file?req.file.path:undefined

        const postAfter=await Post.findOneAndUpdate(
        { "comments._id": commentId }, 
        {
        $set: { 
            "comments.$.comment": comment || commentToUpdate.comment, // تحديث النص إذا وُجد
            "comments.$.commentImage": imageUrl || commentToUpdate.commentImage // تحديث الصورة إذا وُجدت
        }
    },
        { new: true } 
    )

    res.status(200).json({ msg: "Post updated successfully", post: postAfter });

}

const checkPostsExist = async (req, res) => {
  try {
    const { ids } = req.body;
    const currentUserId = req.user.userID;

    const currentUser = await User.findById(currentUserId)
      .select("following")
      .lean();

    if (!currentUser) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const followingSet = new Set(
      currentUser.following.map((id) => id.toString())
    );

    const posts = await Post.find({
      _id: { $in: ids },
    })
      .populate("author", "name profileImageURL")
      .lean();

    const formattedPosts = posts.map((post) => ({
      ...post,
      commentsCount: post.comments?.length || 0,

      isFollowingAuthor: followingSet.has(
        post.author._id.toString()
      ),

      isLiked: post.likes.some(
        (id) => id.toString() === currentUserId
      ),
    }));

    res.status(200).json({
      posts: formattedPosts,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};
//=============================================
module.exports={checkPostsExist,getPostLikes,getPostComments,getPosts,createPost,Like,getPost,getUserPosts,addComment,updatePost,deletePost,deleteComment,updateComment,getMyPosts}



