const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./db/database');
const cors = require('cors')
const cron = require('node-cron')

const authRouter = require('./router/auth');
const userRouter = require('./router/user');
const eventRouter = require('./router/event');
const calendar = require('./router/calendar')
const notifCron = require('./helper/cron')

const app = express();

const PORT = process.env.PORT || 8080

async function start() {
    try {
        await sequelize.sync({alter: true})
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (err) {
        console.log(err)
    }
}


start();
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', '*');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})
cron.schedule('* * * * *', async function() {
    await notifCron();
});

const corsOptions ={
    origin:'http://localhost:3000',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(express.static('images'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expected: true}));
app.use('/api/auth/', authRouter);
app.use('/api/users/', userRouter);
app.use('/api/event/', eventRouter);
app.use('/api/calendar/', calendar);





