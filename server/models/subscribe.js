const Sequelize = require('sequelize');
const {subscribe, event, calendar} = require("../db/database");
// const {PAGE_SIZE} = require("../pagination/pagination");
const Op = Sequelize.Op;

class SubscribeModel {
    async createSubsUser(id_event, email) {
        try {
            return await subscribe.create({
                eventEntityId: id_event,
                email: email
            })
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async getNotificationEvents() {
        try {
            const now = new Date(Date.now())
            const interval = new Date(now.getTime() + 30 * 60000)
            return await subscribe.findAll({
                    where: {notif_send: false,},
                    include: {
                        include: {
                            model: calendar
                        },
                        model: event, where: {
                            [Op.and]: [{
                                begin_at: {
                                    [Op.lt]: interval
                                }
                            },
                                {
                                    begin_at: {
                                        [Op.gt]: now
                                    }
                                }]
                        },
                    }
                }
            )
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async setNotifSend(item_id) {
        try {
            return await subscribe.update({notif_send: true}, {where: ({id: item_id})})
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    async unsubscribeById(subscriptionId) {
        try {
            return await subscribe.destroy( {where: ({id: subscriptionId})})
        } catch (e) {
            console.log(e)
            return null;
        }
    }
    async getSubscribersByEventId(eventId) {
        return await subscribe.findAll({
            where: {eventEntityId: eventId,},
        })
    }

    async updateSubscribers(eventId, emails) {

        try {
            const subs = await this.getSubscribersByEventId(eventId)
            const subscribers = subs.map((item) => {
                return {id: item.dataValues.id, email: item.dataValues.email}
            })
            subscribers.map((subscriber) => {
                if (!emails.includes(subscriber.email)) {
                    this.unsubscribeById(subscriber.id);
                }
            })
            emails.map((email) => {
                if (!subscribers.map(item => item.email).includes(email)) {
                    this.createSubsUser(eventId, email);
                }
            })
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    async createSubscribers(eventId, emails) {
        try {
            const subs = await this.getSubscribersByEventId(eventId)
            const subscribers = subs.map((item) => {
                return {id: item.dataValues.id, email: item.dataValues.email}
            })
            subscribers.map((subscriber) => {
                if (!emails.includes(subscriber.email)) {
                    this.unsubscribeById(subscriber.id);
                }
            })
            emails.map((email) => {
                if (!subscribers.map(item => item.email).includes(email)) {
                    this.createSubsUser(eventId, email);
                }
            })
        } catch (e) {
            console.log(e)
            return null;
        }
    }

}

module.exports = {SubscribeModel, subscribe};