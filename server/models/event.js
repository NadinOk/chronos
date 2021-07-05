const Sequelize = require('sequelize');
const {subscribe} = require("../db/database");
const {event, calendar} = require("../db/database");
const {PAGE_SIZE} = require("../pagination/pagination");
const Op = Sequelize.Op;

class EventModel {
    async createEvent(title, content, calendar_id, begin_at, end_at, event_type) {
        try {
            return await event.create({
                title: title,
                content: content,
                calendar_id: calendar_id,
                calendarEntityId: calendar_id,
                begin_at: begin_at,
                end_at: end_at,
                event_type: event_type,

            })
        }
        catch (e) {
            console.log(e)
            return null
        }
    }

    async updateEvent(event_id, title, content, calendar_id, begin_at, end_at, calendarEntityId, event_type) {
        let dataToUpdate = {}
        if (title !== undefined) {
            dataToUpdate['title'] = title;
        }
        if (content !== undefined) {
            dataToUpdate['content'] = content;
        }
        if (calendar_id !== undefined) {
            dataToUpdate['calendar_id'] = calendar_id;
        }
        if (begin_at !== undefined) {
            dataToUpdate['begin_at'] = begin_at;
        }
        if (end_at !== undefined) {
            dataToUpdate['end_at'] = end_at;
        }
        if (event_type !== undefined) {
            dataToUpdate['event_type'] = event_type;
        }

        try {
            return await event.update(dataToUpdate, {where: {id: 34}})
        }catch (e){
            console.log(e)
            return null
        }
    }

    async getEvents(user_id) {
        try {
            return await event.findAll({
                include: {model: calendar, where: {user_id: {[Op.eq]: user_id}}},
            })
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async getEventsById(id) {
        try {
            return await event.findOne(
                {where: {id: [id]}})
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async getUserEventsById(user_id) {
        try {
            return await event.findAll({where: {author: [user_id]}})
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async getEventById(id) {
        try {
            return await event.findOne(
                {where: {id: [id]},
                    include:[{model: calendar, as: 'Name', attributes: ['name']}]
                })
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async deleteEventById(id) {
        try {
            return await event.destroy({
                where: {id: id}
            })
        } catch (e) {
            console.log(e)
            return null
        }
    }

}


module.exports = { EventModel, event};