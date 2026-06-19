const express = require('express')
const router = express.Router()

const {
  getMyData,
  updateUserData,
  deleteUser,
  follow,
  getUserData,
  getUserFollowers
} = require('../controllers/userController')


const { verifyToken } = require('../Middleware/authMiddleware')

router.use(verifyToken)



router.get('/me', getMyData)

router.get('/:userId', getUserData)

const upload = require('../config/multer')
router.patch(
  '/me',
  upload.single("profileImageURL"),
  updateUserData
)
router.delete('/me', deleteUser)
router.post('/:userId/follow', follow)
router.get('/:userId/followers', getUserFollowers)


//==========================================================================

module.exports = router