const express = require('express')
const router = express.Router()

const {
  deleteUser,
  getUsers,
  blockUser,
  getStatistics
} = require('../controllers/adminController')

//==============================================================

const { verifyToken, isAdmin } = require('../Middleware/authMiddleware')

router.use(verifyToken)
// router.use(isAdmin)

//==========================================================================

/**
 * @swagger
 * /admin/deleteUser/{userId}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Admin]
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
 *         description: User deleted successfully
 *       403:
 *         description: Forbidden (not admin)
 */
router.delete('/deleteUser/:userId', deleteUser)


//==========================================================================

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       403:
 *         description: Forbidden (not admin)
 */
router.get('/users', getUsers)


//==========================================================================

/**
 * @swagger
 * /admin/blockUser/{userId}:
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
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       403:
 *         description: Forbidden (not admin)
 */
router.patch('/blockUser/:userId', blockUser)


//==========================================================================

/**
 * @swagger
 * /admin/siteStatistics:
 *   get:
 *     summary: Get platform statistics
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       403:
 *         description: Forbidden (not admin)
 */
router.get('/siteStatistics', getStatistics)


//==========================================================================

module.exports = router