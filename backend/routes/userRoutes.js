const express = require('express');
const { getAllUsers, createUsers, updateUser, getUserById } = require('../controllers/userController');
const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);

module.exports = router;