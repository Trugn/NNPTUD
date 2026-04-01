const express = require('express');
const router = express.Router();

// Import controllers (lúc sau bạn sẽ tạo thêm)
// const userController = require('../controllers/userController');

// Routes example
router.get('/test', (req, res) => {
  res.json({ message: 'API test route working!' });
});

// Thêm các routes khác ở đây
// router.get('/users', userController.getUsers);
// router.post('/users', userController.createUser);
// router.get('/users/:id', userController.getUserById);
// router.put('/users/:id', userController.updateUser);
// router.delete('/users/:id', userController.deleteUser);

module.exports = router;
