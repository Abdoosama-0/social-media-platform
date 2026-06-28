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

//==========================================================================

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 */
router.get('/', getPosts)
router.get('/likes/:postId', getPostLikes)
router.get('/comments/:postId', getPostComments)


//==========================================================================

/**
 * @swagger
 * /posts/My:
 *   get:
 *     summary: Get current user posts
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User posts retrieved successfully
 */
router.get('/My', getMyPosts)


//==========================================================================

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.post('/', 
 upload.array("media", 20)
, createPost)


//==========================================================================

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Get single post
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 */
router.get('/:postId', getPost)


//==========================================================================

/**
 * @swagger
 * /posts/userPosts/{userId}:
 *   get:
 *     summary: Get posts of a specific user
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User posts retrieved successfully
 */
router.get('/userPosts/:userId', getUserPosts)


//==========================================================================

/**
 * @swagger
 * /posts/{postId}:
 *   patch:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Post updated successfully
 */
router.patch('/:postId', upload.array("images", 5), updatePost)


//==========================================================================

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
router.delete('/:postId', deletePost)


//===================================================

/**
 * @swagger
 * /posts/Like/{postId}:
 *   post:
 *     summary: Like or unlike a post
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post liked successfully
 */
router.post('/Like/:postId', Like)


//===================================================

/**
 * @swagger
 * /posts/addComment/{postId}:
 *   post:
 *     summary: Add comment to a post
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               commentImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Comment added successfully
 */
router.post(
  '/addComment/:postId',
  upload.single("commentImage"),
  addComment
)


//==========================================================================

/**
 * @swagger
 * /posts/deleteComment/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
router.delete('/deleteComment/:commentId', deleteComment)


//==========================================================================

/**
 * @swagger
 * /posts/updateComment/{commentId}:
 *   patch:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               commentImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Comment updated successfully
 */
router.patch(
  '/updateComment/:commentId',
  upload.single("commentImage"),
  updateComment
)

//==========================================================================

module.exports = router