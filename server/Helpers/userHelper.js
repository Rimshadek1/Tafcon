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
    Booking: (proId, userId) => {
        let proObj = {
            item: new ObjectId(proId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            try {
                const userCart = await db.get().collection(collection.bookCollection).findOne({ user: new ObjectId(userId) });

                if (userCart) {
                    let proExist = userCart.events.findIndex(product => product.item == proId);
                    if (proExist !== -1) {
                        // Event is already booked; resolve with an appropriate message
                        resolve('already booked');
                    } else {
                        // If user's cart already exists, add the new product id to the existing array
                        db.get().collection(collection.bookCollection).updateOne(
                            { user: new ObjectId(userId) },
                            { $push: { events: proObj } }
                        ).then(() => {
                            // After booking, decrease the slot in the eventCollection
                            db.get().collection(collection.eventCollection).updateOne(
                                { _id: new ObjectId(proId), slot: { $gte: 1 } },
                                { $inc: { slot: -1 } }
                            ).then(() => {
                                resolve('success');
                            }).catch((error) => {
                                reject(error);
                            });
                        });
                    }
                } else {
                    // If user's cart doesn't exist, create a new cart object with a single array for products
                    const cartObj = {
                        user: new ObjectId(userId),
                        events: [proObj]
                    };
                    db.get().collection(collection.bookCollection).insertOne(cartObj).then(() => {
                        // After booking, decrease the slot in the eventCollection
                        db.get().collection(collection.eventCollection).updateOne(
                            { _id: new ObjectId(proId), slot: { $gte: 1 } },
                            { $inc: { slot: -1 } }
                        ).then(() => {
                            resolve('success');
                        }).catch((error) => {
                            reject(error);
                        });
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    }




    ,
    getEventList: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.bookCollection).aggregate([
                {
                    $match: { user: new ObjectId(userId) }
                }, {
                    $unwind: '$events'
                }, {
                    $lookup: {
                        from: collection.eventCollection,
                        localField: 'events.item',
                        foreignField: '_id',
                        as: 'event'
                    }
                }, {
                    $addFields: {
                        item: '$events.item',
                        quantity: '$events.quantity',
                        event: { $arrayElemAt: ['$event', 0] }
                    }
                }, {
                    $addFields: {
                        'event.Slot_left': { $toInt: '$event.slot' }
                    }
                }, {
                    $project: {
                        item: 1,
                        quantity: 1,
                        event: 1
                    }
                }, {
                    $sort: { 'event.lastClickedTimestamp': -1 } // Sort by the last-clicked timestamp in descending order
                }
            ]).toArray();

            resolve(cartItems);
        });
    }
    ,
}