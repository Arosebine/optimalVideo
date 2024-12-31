import { Request, Response, NextFunction } from 'express';
import Video from '../model/video.model';
import { Op } from 'sequelize';
import redisClient from '../../utils/redis';
import User from '../../user/models/user.model';

export const addVideo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id }= req.user;
        const user = await User.findByPk(id);
        if(user.role !== 'user'){
            return res.status(401).json({message: 'Unauthorized, only admins can add videos'})
        }

        const { title, description, genre, tags, duration } = req.body;
        const video = await Video.create({
            title,
            description,
            genre,
            duration,
            tags,
         });

        await redisClient.del('videos');

        return res.status(201).json({ message: 'Video created successfully', video });
    } catch (error) {
        next(error);
    }
};

export const updateVideo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const {id }= req.user;
        const user = await User.findByPk(id);
        if(user.role !== 'user'){
            return res.status(401).json({message: 'Unauthorized, only admins can update videos'})
        }

        const { title, description, genre, tags, duration } = req.body;
        const { videoId } = req.params;
        const [updated] = await Video.update({
            title,
            description,
            genre,
            duration,
            tags,
        }, { where: { id: videoId } });

        if (!updated) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const updatedVideo = await Video.findByPk(videoId);

        await redisClient.del('videos');

        return res.status(200).json({ message: 'Video updated successfully', video: updatedVideo });
    } catch (error) {
        next(error);
    }
};



export const fetchVideos = async ( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
    try {
        const { id } = req.user;
        const user = await User.findByPk(id);

        if (user.role !== 'user') {
            return res
                .status(401)
                .json({ message: 'Unauthorized, only users can fetch videos' });
        }

        const { searchVideo } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const offset = (Number(page) - 1) * Number(limit);

        const cacheKey = `videos:${searchVideo || 'all'}:${page}:${limit}`;

        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        const where: any = {};
        if (searchVideo) {
            where[Op.or] = [
                { title: { [Op.like]: `%${searchVideo}%` } },
                { tags: { [Op.like]: `%${searchVideo}%` } },
                { genre: { [Op.like]: `%${searchVideo}%` } },
            ];
        }

        const videos = await Video.findAndCountAll({
            where,
            limit: Number(limit),
            offset,
        });

        const response = {
            message: 'Videos fetched successfully',
            videos: videos.rows,
            total: videos.count,
        };

        await redisClient.set(cacheKey, JSON.stringify(response), {
            EX: 3600,
        });

        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};


export const deleteVideo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const {id }= req.user;
        const user = await User.findByPk(id);
        if(user.role !== 'user'){
            return res.status(401).json({message: 'Unauthorized, only admins can update videos'})
        }

        const { videoId } = req.params;
        const deleted = await Video.destroy({ where: { id: videoId } });

        if (!deleted) {
            return res.status(404).json({ message: 'Video not found' });
        }

        await redisClient.del('videos');

        return res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
        next(error);
    }
};
