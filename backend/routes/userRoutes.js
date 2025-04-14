const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploadProfilePicture,
} = require('../Controllers/userController');

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

//upload picture 
router.post(
  '/profile-picture/:id',uploadProfilePicture);


module.exports = router;
