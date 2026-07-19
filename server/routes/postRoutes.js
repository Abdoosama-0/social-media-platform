const express = require('express')
const router = express.Router()

const {
  getPosts,
  createPost,
  Like,
  getPost,
  getUserPosts,
  addComment,
  updatePost,
  deletePost,
  deleteComment,
  updateComment,
  getMyPosts,getPostComments,getPostLikes
} = require('../controllers/postController')

const upload = require('../config/multer')

//==========================================================================

const { verifyToken } = require('../Middleware/authMiddleware')

router.use(verifyToken)

router.get('/', getPosts)
router.get('/likes/:postId', getPostLikes)
router.get('/comments/:postId', getPostComments)


router.get('/My', getMyPosts)

router.post('/', 
 upload.array("media", 20)
, createPost)

router.get('/:postId', getPost)


router.get('/userPosts/:userId', getUserPosts)


router.patch('/:postId', upload.array("images", 5), updatePost)


router.delete('/:postId', deletePost)


router.post('/Like/:postId', Like)

router.post(
  '/addComment/:postId',
  upload.single("commentImage"),
  addComment
)

router.delete('/deleteComment/:commentId', deleteComment)


router.patch(
  '/updateComment/:commentId',
  upload.single("commentImage"),
  updateComment
)

//==========================================================================

module.exports = router