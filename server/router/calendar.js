const express = require('express');
const router = express.Router();

const {CalendarModel} = require('../models/calendar');
const {checkPermission, getCurrentUser} = require("../helper/helper");



const Calendar = new CalendarModel()

router.get('/', async (req, res) => {
    if (!await checkPermission(req, res)) return;
    const allCalendar = await Calendar.getCalendars(req.query.user, req.query.page);

    if (allCalendar !== null) {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.status(200).send(allCalendar)
    } else {
        res.status(400).send('Could not get Calendars')
    }
})

router.get('/:id', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const calById = await Calendar.getCalendarById(req.params.id)
    if (calById !== null) {
        res.status(200).send(calById)
    } else {
        res.status(400).send('Could not get calendar by id')
    }
})
router.post('/', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const user = await getCurrentUser(req.headers.authorization)
    const obj_cal = await Calendar.createCalendar(req.body.nameCalendar, req.body.colorCalendar, user.id)

    if (obj_cal !== null) {

        res.status(201).send(obj_cal)
    } else {
        res.status(400).send('Could not create calendar')
    }
})

module.exports = router