import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import createResponse from './../utils/response';
import { any } from '@hapi/joi';
// import dotenv from 'dotenv';
// import path from 'path';

// dotenv.config({ path: path.join(__dirname, '../../../.env') });

const auth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const secretKey: any = process.env.JWT_SECRET;

		const token: any = req.header('Authorization');
		if (!token) {
			createResponse(res, httpStatus.UNAUTHORIZED, "Please authenticate", {});
		} else {
			const decoded = jwt.verify(token, secretKey);
			req.user = decoded.sub;
			next();
		}
	} catch (err: any) {
		createResponse(res, httpStatus.UNAUTHORIZED, "Please authenticate", {});
	}
};

export default auth