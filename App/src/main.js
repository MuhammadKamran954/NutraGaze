const express = require('express');
const app = express();
require('dotenv').config()
const port = process.env.DB_PORT || 3002;
const db = require('./../../config/db');
const Users = require('./../../App/src/signup/model/user');
const FoodPhoto = require('./../../App/src/analyze/model/food');
const router = require('./../../App/src/signup/router/router');
const logger = require('./../../common/winston/logger');
const FoodRouter = require('./../../App/src/analyze/router/router');
app.use(express.json());

app.use(async (req, res, next) => {
    const start = process.hrtime();
    const { method, url, body, params, query } = req;

    
    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const durationMs = (seconds * 1e3 + nanoseconds / 1e6).toFixed(2);

        logger.info({
            method,
            url,
            params,
            query,
            body,
            statusCode: res.statusCode,
            duration: `${durationMs}ms`
        });
    });

    next();
});

app.use('',router);
app.use('',FoodRouter);

db.connect(
).then(async() =>{
    await Users();
    await FoodPhoto();
    logger.info('Connected to database');
    app.listen(port,()=>{
            logger.info(`🚀 App is running at: http://localhost:${port}`);
    })
}).catch((error)=>{
        logger.error(`❌ Error while starting app: ${error.message}`);
    process.exit(1);
})

