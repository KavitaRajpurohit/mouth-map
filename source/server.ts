import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import routes from './routes';
import mongoose from 'mongoose';
import config from './common/config/config';
import logger from './common/config/logger';
import cors from 'cors';
import { any } from '@hapi/joi';

const router: Express = express();

/** Logging */
router.use(morgan('dev'));

/** Parse the request */
router.use(express.urlencoded({ extended: false }));

/** Takes care of JSON data */
router.use(express.json());

/**Handles the cors-policy error */
router.use(cors());

/** Routes */
router.use('/', routes);

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

/** Server */
const httpServer = http.createServer(router);

/**port */
const PORT: any = process.env.PORT ?? 6060;
let server: any;

/**Connecting to DataBase */
mongoose.connect(config.mongoose.url).then((result) => {
    logger.info(`Connected to MongoDB : ${config.mongoose.url}`);
    server = httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
});

/** Log all Mongoose queries */
mongoose.set('debug', true);

/** End the running process in Node JS  */
const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

/** Handles the occurance of unexpected errors */
const unexpectedErrorHandler = (error: any) => {
    logger.error(error);
    exitHandler();
};


process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);


process.on('SIGTERM', () => {
    logger.info(' received');
    if (server) {
        server.close();
    }
});
