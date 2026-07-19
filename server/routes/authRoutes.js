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
  verifyOtp,isLoggedIn1
} = require('../controllers/authController')

const {
  isLoggedIn,
  verifyToken
} = require('../Middleware/authMiddleware')

const upload = require('../config/multer')




router.get('/isLoggedIn', isLoggedIn1)


router.post(
  '/register',
  upload.single("profileImageURL"),
  register
)

router.post('/verifyOtp', verifyOtp)

router.post('/localLogin', localLogin)

router.get("/google", isLoggedIn, googleAuth)


router.get("/google/callback", googleAuthCallback)




router.post('/forgetPassword', forgetPassword)



router.post('/recreatePassword', recreatePassword)


//=========================================== after verifyToken ==================================

router.use(verifyToken)

router.post('/logout', logout)


//==========================================================================

module.exports = router