import { jest } from '@jest/globals';
import  { addVideo } from '../../video/controller/video.controller';
import User from '../../user/models/user.model';
import Video from '../../video/model/video.model';
import redisClient from '../../utils/redis';

jest.mock('../../user/models/user.model');
jest.mock('../../video/model/video.model');
jest.mock('../../utils/redis');

describe('addVideo Controller', () => {
    let mockReq: any;
    let mockRes: any;
    let mockNext: any;
    let mockUser: any;

    beforeEach(() => {
        mockUser = {
            id: 1,
            role: 'admin',
        };

        mockReq = {
            user: { id: 1 },
            body: {
                title: 'Test Video',
                description: 'Test Description',
                genre: 'Test Genre',
                tags: ['Test Tag'],
                duration: 120,
            },
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockNext = jest.fn();

        (User.findByPk as jest.Mock<typeof User.findByPk>).mockResolvedValue(mockUser);
        (Video.create as jest.MockedFunction<typeof Video.create>).mockResolvedValue({
            id: 1,
            title: 'Test Video',
            description: 'Test Description',
            genre: 'Test Genre',
            tags: ['Test Tag'],
            duration: 120,
        } as any);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add a video successfully', async () => {
        await addVideo(mockReq, mockRes, mockNext);

        expect(User.findByPk).toHaveBeenCalledWith(1);

        expect(Video.create).toHaveBeenCalledWith({
            title: 'Test Video',
            description: 'Test Description',
            genre: 'Test Genre',
            tags: 'Test, Tag',
            duration: 120,
        });

        expect(redisClient.del).toHaveBeenCalledWith('videos');

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Video created successfully',
            video: expect.objectContaining({
                title: 'Test Video',
                description: 'Test Description',
                genre: 'Test Genre',
                tags: ['Test Tag'],
                duration: 120,
            }),
        });
    });


});
