import { Router } from 'express';
import { addVideo, updateVideo, fetchVideos, deleteVideo } from '../controller/video.controller';
import { auth } from '../../middlewares/auth.middleware';

const router: Router = Router();

router.use(auth);
router.post('/createVideo', addVideo);
router.put('/updateVideo/:videoId',  updateVideo);
router.get('/viewVideo/:searchVideo', fetchVideos);
router.delete('/deleteVideo/:videoId',  deleteVideo);

export default router;
