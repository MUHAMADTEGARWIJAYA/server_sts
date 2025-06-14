import express from 'express';
import { searchSong, createMessage, getAllMessages, getRecentMessages, getMessageById, getRandomMessages } from '../controllers/songController.js';

const router = express.Router();    

router.get('/search', searchSong);
router.post('/message', createMessage);
router.get('/messages', getAllMessages);
router.get('/messages/random', getRandomMessages);
router.get('/messages/recent', getRecentMessages);
router.get('/message/:id', getMessageById);

export default router;