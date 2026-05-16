const express = require('express')
const router = express.Router()

const passport = require('passport')

const {
  register,
  localLogin,
  logout,
  googleAuthCallback,
  googleAuth,
  forgetPassword,
  recreatePassword,
  verifyOtp
} = require('../controllers/authController')

const {
  isLoggedIn,
  verifyToken
} = require('../Middleware/authMiddleware')

const upload = require('../config/multer')


//==========================================================================

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               profileImageURL:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post(
  '/register',
  upload.single("profileImageURL"),
  register
)


//==========================================================================

/**
 * @swagger
 * /auth/verifyOtp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */
router.post('/verifyOtp', verifyOtp)


//==========================================================================

/**
 * @swagger
 * /auth/localLogin:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/localLogin', localLogin)


//==========================================================================

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Login with Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */
router.get("/google", isLoggedIn, googleAuth)


//==========================================================================

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Google login successful
 */
router.get("/google/callback", googleAuthCallback)


//==========================================================================

/**
 * @swagger
 * /auth/forgetPassword:
 *   post:
 *     summary: Send password reset OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post('/forgetPassword', forgetPassword)


//==========================================================================

/**
 * @swagger
 * /auth/recreatePassword:
 *   get:
 *     summary: Reset password
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.get('/recreatePassword', recreatePassword)


//=========================================== after verifyToken ==================================

router.use(verifyToken)


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', logout)


//==========================================================================

module.exports = router