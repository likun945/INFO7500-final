import express from 'express';
import User from '../models/user.js';
const router = express.Router();
import basicAuthMiddleware from '../middleware/basicAuthMiddleware.js';

router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, password, username } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.error('User already exists with this username', 400);
    }

    const user = await User.create({
      firstName: first_name,
      lastName: last_name,
      password,
      username,
    });

    const userData = {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.username,
      account_created: user.accountCreated,
      account_updated: user.accountUpdated
    };
    res.success(userData, "User created successfully", 201);
  } catch (error) {
    res.error(error.message, 400);
  }
});

router.put('/self', basicAuthMiddleware, async (req, res) => {
  const { first_name, last_name, password } = req.body;

  const bodyKeys = Object.keys(req.body);
  const allowedUpdates = ['first_name', 'last_name', 'password', 'username'];
  const isValidOperation = bodyKeys.every((key) => allowedUpdates.includes(key));
  if (!isValidOperation) {
    return res.error('Attempt to update invalid field', 400);
  }

  try {
    const user = req.user;
    if (first_name) user.firstName = first_name;
    if (last_name) user.lastName = last_name;
    if (password) user.password = password;

    await user.save();
    res.status(204).end();
  } catch (error) {
    res.error('Failed to update user information', 400);
  }
});



router.get('/self', basicAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.error("User not found", 404);
    }
    const userData = {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.username,
      account_created: user.accountCreated,
      account_updated: user.accountUpdated
    };
    res.success(userData, "User information retrieved successfully");
  } catch (error) {
    res.error(error.message, 400);
  }
});

export default router;
