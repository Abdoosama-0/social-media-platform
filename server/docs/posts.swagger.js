/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management APIs
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get paginated posts
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *       401:
 *         description: Unauthorized
 */

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
 *             required:
 *               - media
 *             properties:
 *               title:
 *                 type: string
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: No media uploaded
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Get a single post
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 */

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
 *         description: Post ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       401:
 *         description: You are not allowed to update this post
 *       404:
 *         description: Post not found
 */

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
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: You are not allowed to delete this post
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /posts/My:
 *   get:
 *     summary: Get current user's posts
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user's posts
 *       404:
 *         description: User not found
 */

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
 *         description: User ID
 *     responses:
 *       200:
 *         description: User posts retrieved successfully
 *       404:
 *         description: User not found
 */

//likes
/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Like and unlike posts
 */

/**
 * @swagger
 * /posts/Like/{postId}:
 *   post:
 *     summary: Like or unlike a post
 *     description: |
 *       If the current user has already liked the post, the like will be removed.
 *       Otherwise, a new like will be added.
 *     tags: [Likes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post like status updated successfully
 *         content:
 *           application/json:
 *             example:
 *               post:
 *                 _id: 686c5d3d2b7a5a1d1a5f9876
 *                 title: My first post
 *                 likesCount: 5
 *                 commentsCount: 3
 *                 isLiked: true
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /posts/likes/{postId}:
 *   get:
 *     summary: Get users who liked a post
 *     tags: [Likes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: List of users who liked the post
 *         content:
 *           application/json:
 *             example:
 *               likesCount: 2
 *               likes:
 *                 - _id: 686c5d3d2b7a5a1d1a5f1111
 *                   name: Ahmed
 *                   profileImageURL: https://example.com/profile.jpg
 *                 - _id: 686c5d3d2b7a5a1d1a5f2222
 *                   name: Mohamed
 *                   profileImageURL: https://example.com/profile2.jpg
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
//comments 
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Post comments management
 */


/**
 * @swagger
 * /posts/comments/{postId}:
 *   get:
 *     summary: Get all comments of a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "665a9f4d8c9f3a1234567890"
 *                       comment:
 *                         type: string
 *                         example: "Nice post!"
 *                       commentImage:
 *                         type: string
 *                         example: "https://cloudinary.com/image.jpg"
 *                       userid:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                             example: "abdo"
 *                           profileImageURL:
 *                             type: string
 *                             example: "https://cloudinary.com/profile.jpg"
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /posts/addComment/{postId}:
 *   post:
 *     summary: Add comment to a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "Amazing work!"
 *               commentImage:
 *                 type: string
 *                 format: binary
 *                 description: Optional comment image
 *     responses:
 *       200:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Comment added successfully"
 *                 post:
 *                   type: object
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /posts/updateComment/{commentId}:
 *   patch:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "Updated comment text"
 *               commentImage:
 *                 type: string
 *                 format: binary
 *                 description: New comment image
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Post updated successfully"
 *                 post:
 *                   type: object
 *       401:
 *         description: You can't update this comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /posts/deleteComment/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "comment deleted successfully"
 *                 postAfter:
 *                   type: object
 *       401:
 *         description: Unauthorized action
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */