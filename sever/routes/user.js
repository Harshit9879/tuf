import express from 'express';
import { createUser, getUsers, getUsersFromCache } from '../controller/user.js';

const router = express.Router();

// Route to get users with Redis caching
router.get('/user', getUsersFromCache, getUsers);

// Route to create a new user
router.post('/user', createUser);
export default router;
