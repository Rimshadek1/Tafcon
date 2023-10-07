var db = require('../config/connection')
var collection = require('../config/collection')
const ObjectId = require('mongodb').ObjectId;
var bcrypt = require('bcrypt');
module.exports = {
    register: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.number = parseInt(userData.number);
            const existingUser = await db.get()
                .collection(collection.userCollection)
                .findOne({ number: userData.number });
            if (existingUser) {
                const error = 'User with this mobile number already exists';
                reject(error);
                return;
            } else {

                userData.password = await bcrypt.hash(userData.password, 10);
                db.get()
                    .collection(collection.userCollection)
                    .insertOne(userData)
                    .then((data) => {
                        resolve(data.insertedId);

                    })
            }

        })
    },
    doLogin: async (userData) => {
        userData.number = parseInt(userData.number);

        try {
            const user = await db.get().collection(collection.userCollection).findOne({ number: userData.number });

            if (user) {
                const match = await bcrypt.compare(userData.password, user.password);
                if (match) {
                    console.log('login');

                    return {
                        user: user,
                        status: true,

                    };
                } else {
                    console.log('not match password');
                    return {
                        status: false,
                        error: 'Wrong Mobile or Password'
                    };
                }
            } else {
                console.log('not login2');
                return {
                    status: false,
                    error: 'User not found'
                };
            }
        } catch (error) {
            console.log('catch catch');
            throw error;
        }
    },

}