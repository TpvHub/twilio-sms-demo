const chai = require('chai');
const should = chai.should();
const authenticator = require('authenticator')

// utils
const {
    validateUsername,
    sendSmsMessageToUser
} = require("../utils")


describe('TEST utils functions', () => {
    beforeEach((done) => {
        //Before each test we empty the database in your case
        done();
    });
    /*
     * Test the validateUsername function
     */
    describe('validateUsername', () => {
        it('it should return false with wrong username', (done) => {
            const wrongUsername = "abc def"
            const rs = validateUsername(wrongUsername)
            rs.should.be.eql(false)
            done();
        });

        it('it should return true with valid username', (done) => {
            const validUsername = "user1"
            const rs = validateUsername(validUsername)
            rs.should.be.eql(true)
            done();
        });
    });

    /*
     * Test the sendSmsMessageToUser function
     */
    describe('sendSmsMessageToUser', () => {
        it('it should response error with user do not have authenticatorKey', (done) => {
            const wrongUsername = {
                username: 'abcdef1',
                authenticatorKey: null
            }
            sendSmsMessageToUser(wrongUsername).then(_ => {
                done(new Error('sendSmsMessageToUser should response Error'))
            }).catch(err => {
                done();
            })
        });

        it('it should response ok with user have valid authenticatorKey', (done) => {
            const validUsername = {
                username: 'abcdef1',
                authenticatorKey: authenticator.generateKey()
            }
            sendSmsMessageToUser(validUsername).then(user => {
                user.username.should.be.eql(validUsername.username)
                done()
            }).catch(err => {
                done(err);
            })
        });
    });
});
