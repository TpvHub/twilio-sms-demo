require('dotenv').config()

const mongoose = require('mongoose');
const authenticator = require('authenticator');

mongoose.connect('mongodb://localhost/twilio-test', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

// utils
const {
    validateUsername,
    sendSmsMessageToUser
} = require('./utils')

// models
const User = require('./users.model')

const connectDB = () => new Promise((rs, rj) => {
    const db = mongoose.connection;
    db.on('error', () => {
        rj('error connect DB')
    });

    db.once('open', function () {
        rs()
    });
})

const askUsername = () => new Promise((rs, rj) => {
    const standard_input = process.stdin;
    standard_input.setEncoding('utf-8');
    console.log("Please input your username:");
    standard_input.on('data', function (data) {
        if (validateUsername(data.slice(0, -1))) {
            const username = data.slice(0, -1);
            User.findOne({ username })
                .then(user => {
                    if (user) {
                        rs(user)
                    } else return Promise.reject('User not found')
                })
                .catch(err => {
                    // create new user
                    const formattedKey = authenticator.generateKey();
                    const user = new User({
                        username: username,
                        authenticatorKey: formattedKey
                    })

                    user.save().then(rs).catch(rj)
                })
        } else {
            rj('User not valid')
        }
    });
})

const verifyCode = user => new Promise((rs, rj) => {
    const standard_input = process.stdin;
    standard_input.setEncoding('utf-8');
    console.log("Please input your code from sms:");
    standard_input.on('data', function (data) {
        const code = data.slice(0, -1);
        const verifyToken = authenticator.verifyToken(user.authenticatorKey, code);
        verifyToken !== null ? rs(user) : rj('invalid code')
    });
})

const verifyCodeSuccess = (user) => {
    console.log(`Verify User ${user.username} successful`)
    process.exit(0)
}

async function main() {
    try {
        await connectDB()

        await askUsername()
            .then(sendSmsMessageToUser)
            .then(verifyCode)
            .then(verifyCodeSuccess)

    } catch (err) {
        console.log('error', err)
        process.exit(0)
    }
}

main()