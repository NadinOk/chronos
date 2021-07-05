const sendMail = require('../helper/sendMail')

const {SubscribeModel} = require("../models/subscribe")

const subs = new SubscribeModel()

async function sendNotifEmail(event_subscriber) {
    let message =  `<p>Don't forget you have scheduled an event in your calendar: ${event_subscriber.event_entity.dataValues.calendar_entity.dataValues.name}
                    <p>It will start in less than 25 minutes</p>`
    await sendMail({
        to: event_subscriber.email,
        subject: 'Upcoming Event',
        html: `<h4>Upcoming event: ${event_subscriber.event_entity.dataValues.title}</h4>
               ${message}`
    });
}


const notifCron = async () => {
    const events = await subs.getNotificationEvents()
    if (events) {
        for (const item of events) {
            await sendNotifEmail(item.dataValues)
            await subs.setNotifSend(item.id)
        }
    }
}

module.exports = notifCron;