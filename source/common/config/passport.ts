import { Strategy, ExtractJwt } from "passport-jwt";
import config from "./config";
import userModel from '../../model/userModel';

const jwtOptions = {
	jwtSecret: config.jwt.secret,
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
};

const jwtVerify = async (payload: { sub: { user: any; }; }, done: (arg0: unknown, arg1: string | boolean) => void) => {
	// console.log(payload)
	try {
		let user: any;
		user = '';
		user = await userModel.findById(payload.sub.user);
		if (!user) {
			return done(null, false);
		}
		done(null, user);
	} catch (error) {
		done(error, false);
	}
};

const jwtStrategy = new Strategy(jwtOptions, jwtVerify);

export default {
	jwtStrategy,
};