const {calendar, event} = require('../db/database')
const {PAGE_SIZE} = require("../pagination/pagination");

class CalendarModel {
    async createCalendar(nameCalendar, colorCalendar, user_id) {
        try {
            return await calendar.create({
                name: nameCalendar,
                color: colorCalendar,
                user_id: user_id
            })
        }
        catch (e) {
            console.log(e)
            return null
        }
    }


    async getCalendars( user_id, page=1) {
        try {
            return await calendar.findAll({
                where: {user_id: user_id},
                limit: PAGE_SIZE,
                offset: page * PAGE_SIZE - PAGE_SIZE})
        } catch (e) {
            console.log(e)
            return null
        }
    }
    async getCalendarById(id) {
        try {
            return await calendar.findOne({where: {id: [id]},
                include:[{model: event, as: 'name', attributes: ['calendar_id']}]
            })
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async deleteCalendarById(id) {
        try {
            return await calendar.destroy({
                where: {id: id}
            })
        } catch (e) {
            console.log(e)
            return null
        }
    }


}
module.exports = {CalendarModel, calendar}
