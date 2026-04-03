import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/apiError';

interface AppError extends Error {
  statusCode?: number;
  status?: string;
}

const sendErrorForDev = (err: AppError, res: Response): void => {
  res.status(err.statusCode ?? 500).json({
    status: err.status ?? 'error',
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorForProd = (err: AppError, res: Response): void => {
  res.status(err.statusCode ?? 500).json({
    status: err.status ?? 'error',
    message: err.message,
  });
};

const handleJwtInvalidSignature = (): ApiError =>
  new ApiError('Invalid token, please login again.', 401);

const handleJwtExpired = (): ApiError =>
  new ApiError('Expired token, please login again.', 401);

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(new ApiError(`Route not found: ${req.originalUrl}`, 404));
};

export const globalError = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  err.statusCode = err.statusCode ?? 500;
  err.status = err.status ?? 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorForDev(err, res);
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    err = handleJwtInvalidSignature();
  }
  if (err.name === 'TokenExpiredError') {
    err = handleJwtExpired();
  }

  sendErrorForProd(err, res);
};
