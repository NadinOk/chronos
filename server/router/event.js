const express = require('express');
const router = express.Router();

const {SubscribeModel} = require('../models/subscribe')
const {UserModel} = require('../models/user')
const {EventModel} = require('../models/event');
// const {CalendarModel} = require('../models/calendar')
const {checkPermission, getCurrentUser, str_rand} = require("../helper/helper");
const sendMail = require('../helper/sendMail');

const Subscribe = new SubscribeModel()
const User = new UserModel()
const Event = new EventModel()
// const Calendar = new CalendarModel()
// const holidayUkIp = "178.214.196.62"


//================Event module===================
router.get('/', async (req, res) => {


    if (!await checkPermission(req, res)) return;
    const allEvents = await Event.getEvents(req.query.user);

    // console.log(req.headers['x-forwarded-for'])
    // console.log(req.query.user)
    if (allEvents !== null) {
      // const holiday = await createHolidaysCalendar(req.query.user, holidayUkIp)

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.status(200).send(allEvents)
    } else {
        res.status(400).send('Could not get events')
    }
})
router.get('/:id', async (req, res) => {
    if (!await checkPermission(req, res)) return;
    const eventById = await Event.getEventsById(req.params.id)

    if (eventById !== null) {
        const subscribers = await Subscribe.getSubscribersByEventId(req.params.id)
        res.status(200).send({...eventById.dataValues, subscribers: subscribers.map(item => item.dataValues.email)})
    } else {
        res.status(400).send('Could not get event by id')
    }
})

router.post('/', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const user = await getCurrentUser(req.headers.authorization)
    const randStr = str_rand();

    const obj_event = await Event.createEvent(req.body.title, req.body.content, req.body.calendar_id, req.body.begin_at, req.body.end_at, req.body.event_type)
    const userSubs = await Subscribe.createSubscribers(obj_event.id, req.body.subscribers)
    if (userSubs !== null ) {
        console.log(req.body)
        const message = {

            to: req.body.subscribers,
            subject: 'Invitation notice',
            html: `<h2>Здравствуйте, Вы были приглашены на ивент "${req.body.title}"  <h2>
                   
                   <p>Ивент состоится: ${req.body.begin_at_date} <br>Время проведения: ${req.body.begin_at_time}  </p> 
                    <br>
                    <i>Данное письмо не требует ответа</i>`
        }
        sendMail(message)
        res.status(201).send(userSubs)
    } else {
        res.status(400).send('Could not create event')
    }
})

router.get('event/confirm/:code', async (req, res) => {

    const userByCode = await User.getUserByCode(req.params.code)
    console.log(userByCode.id)
    if (userByCode !== null) {
        await User.confirmUser(userByCode.id)

        res.status(200).send('Event confirm')
    } else {
        res.status(404).send('User not found')
    }

})

router.patch('/:id', async (req, res) => {
    if (!await checkPermission(req, res)) return;
    console.log(req.body)
    const uptEvent = await Event.updateEvent(req.params.id, req.body.title, req.body.content, req.body.calendar_id, req.body.begin_at, req.body.end_at, req.body.calendarEntityId, req.body.event_type);
    Subscribe.updateSubscribers(req.params.id, req.body.subscribers)
    // const updSubsUser = await Subscribe.updateSubsEmail(req.params.id, req.body.email)
    if (uptEvent[0]) { // || updSubsUser === 1 ) {
        res.status(200).send('Object updated')
    } else {
        res.status(400).send('Could not update Event')
    }
})
router.delete('/:id', async (req, res) => {
    if (!await checkPermission(req, res)) return;
    const eventId = await Event.getEventsById(req.params.id)

    if (eventId !== null) {
        await Event.deleteEventById(req.params.id)
        res.status(204).send()
    } else {
        res.status(400).send('Could not deleted event')
    }
})

module.exports = router
