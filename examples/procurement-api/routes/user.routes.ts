import { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import { User } from '../models/user.model';
import ApiError from '../utils/apiError';

const router = Router();

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

const asyncHandler = (fn: AsyncRouteHandler): RequestHandler => {
  return (req, res, next) => {
    void fn(req, res, next).catch(next);
  };
};

router.post(
  '/users',
  asyncHandler(async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json({ status: 'success', data: user });
  })
);

router.get(
  '/users',
  asyncHandler(async (_req, res) => {
    const users = await User.find().lean();
    res.status(200).json({ status: 'success', results: users.length, data: users });
  })
);

router.get(
  '/users/:id',
  asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      return next(new ApiError('User not found', 404));
    }
    res.status(200).json({ status: 'success', data: user });
  })
);

export default router;
