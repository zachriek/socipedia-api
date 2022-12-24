import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getFeedPosts, getUserPosts, likePost } from '../controllers/postController.js';

const router = express.Router();

router.get('/', verifyToken, getFeedPosts);
router.get('/:userId', verifyToken, getUserPosts);
router.patch('/:id', verifyToken, likePost);

export default router;
