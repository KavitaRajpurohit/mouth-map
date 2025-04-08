import { Request, Response, NextFunction } from 'express';
import createResponse from '../utils/response';
import httpStatus from 'http-status';

const language = async (req: Request, res: Response, next: NextFunction) => {
	try {
        const language: any = req.header('Accept-Language');
		if (!language) {
			req.headers['language'] = 'English';
		} else {
			req.headers['language'] = language;
		}
		next();
	} catch (err: any) {
		createResponse(res, httpStatus.UNAUTHORIZED, err.message, {});
	}
};

export default language
