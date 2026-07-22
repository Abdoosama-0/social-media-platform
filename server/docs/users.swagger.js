/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */


/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current logged in user data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users by username
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         example: abdo
 *         description: Username search keyword
 *     responses:
 *       200:
 *         description: Users found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Abdelrhman
 *                       username:
 *                         type: string
 *                         example: abdo
 *                       email:
 *                         type: string
 *                         example: abdo@gmail.com
 *                       profileImageURL:
 *                         type: string
 *                         example: https://cloudinary.com/profile.jpg
 *                 count:
 *                   type: number
 *                   example: 5
 *       400:
 *         description: Search query required
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user profile data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update current user data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Abdelrhman Osama
 *               username:
 *                 type: string
 *                 example: abdo_dev
 *               email:
 *                 type: string
 *                 example: abdo@gmail.com
 *               profileImageURL:
 *                 type: string
 *                 format: binary
 *                 description: Profile image
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: No update fields provided
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Delete current user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: user deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /users/{userId}/follow:
 *   post:
 *     summary: Follow or unfollow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to follow/unfollow
 *     responses:
 *       200:
 *         description: Follow status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Followed successfully
 *                 isFollowing:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Cannot follow yourself
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /users/{userId}/followers:
 *   get:
 *     summary: Get user followers list
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Followers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         example: abdo
 *                       profileImageURL:
 *                         type: string
 *                         example: https://cloudinary.com/image.jpg
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /users/{userId}/following:
 *   get:
 *     summary: Get users followed by a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Following list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 following:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         example: abdo
 *                       profileImageURL:
 *                         type: string
 *                         example: https://cloudinary.com/image.jpg
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */