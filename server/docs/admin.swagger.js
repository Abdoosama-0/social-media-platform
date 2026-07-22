/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /admins/users:
 *   get:
 *     summary: Get all users (excluding admins)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: No users found.
 */

/**
 * @swagger
 * /admins/blockUser/{userId}:
 *   patch:
 *     summary: Block or unblock a user
 *     tags: [Admin]
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
 *         description: User block status updated successfully.
 *       404:
 *         description: User not found.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 */

/**
 * @swagger
 * /admins/deleteUser/{userId}:
 *   delete:
 *     summary: Delete a user and all of their posts
 *     tags: [Admin]
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
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 */

/**
 * @swagger
 * /admins/siteStatistics:
 *   get:
 *     summary: Get website statistics
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Site statistics retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               totalUsers: 100
 *               blockedUsers: 5
 *               activeUsers: 95
 *               admins: 2
 *               newUsersLastWeek: 14
 *               totalPosts: 350
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 */