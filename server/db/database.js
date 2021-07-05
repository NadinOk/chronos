const Sequelize = require('sequelize');


DB_USER = 'hronos'
DB_PASSWORD = 'nadin1992'
DB_DATABASE = 'chronos'

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
})




const token = sequelize.define('token_entity', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false
    },
    expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    created: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
});

const user = sequelize.define('user_entity', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    login: {
        type: Sequelize.STRING,
        unique: 'login',
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    full_name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        unique: 'email',
        isEmail: true,
        allowNull: false
    },
    profile_picture: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    role: {
        type: Sequelize.STRING,
        defaultValue: "user",
        allowNull: false
    },
    confirmCode: {
        type: Sequelize.STRING,
        allowNull: false
    },
    is_confirm: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    resetToken: {
        type: Sequelize.STRING,
        allowNull: true
    },
    expires: {
        type: Sequelize.DATE,
    },
});

const event = sequelize.define('event_entity', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    event_type: {
        type: Sequelize.ENUM,
        values: ['arrangement', 'task', 'reminder'],
        allowNull: false,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    begin_at: {
        type: Sequelize.DATE,
        allowNull: false
    },
    end_at: {
        type: Sequelize.DATE,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull:false
    },
    calendar_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
    }
});

const calendar = sequelize.define('calendar_entity', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    color: {
        type: Sequelize.STRING,
        allowNull:false
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull:false
    }
});

const subscribe = sequelize.define('event_subscribers_entity', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    email: {
        type: Sequelize.STRING,
        allowNull:false
    },
    notif_send: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

user.hasMany(calendar, {
    foreignKey: 'user_id'
});
calendar.belongsTo(user)

calendar.hasMany(event, {
    foreignKey: 'calendar_id'
});
event.belongsTo(calendar );

event.hasMany(subscribe, {
    foreignKey: 'id'
});
subscribe.belongsTo(event);



module.exports = {sequelize, token, user, event, calendar, subscribe};
