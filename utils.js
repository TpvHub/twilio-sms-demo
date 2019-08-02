const authenticator = require('authenticator')

const validateUsername = username => {
    return /^\w{3,18}$/.test(username)
}

const sendSmsMessageToUser = user => new Promise((rs, rj) => {
    try {
        const formattedCode = authenticator.generateToken(user.authenticatorKey);

        const accountSid = process.env.TWILIO_ACCOUNT_ID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;

        const client = require('twilio')(accountSid, authToken);
        client.messages
            .create({
                body: `Hi ${formattedCode}`,
                from: process.env.TWILIO_PHONE_FROM || '+15005550006',
                to: process.env.TWILIO_PHONE_TO || '+84773330996'
            })
            .then(_ => {
                rs(user)
            })
            .catch(rj);
    } catch (err) {
        rj(err)
    }
})

module.exports = {
    validateUsername,
    sendSmsMessageToUser
}