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

    getSalaryDetails: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const userSalaryDetails = await db
                    .get()
                    .collection(collection.salaryCollection)
                    .find({ user: new ObjectId(userId) })
                    .toArray();

                resolve(userSalaryDetails);
            } catch (error) {
                reject(error);
            }
        });
    },
    getFineDetails: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const userFineDetails = await db
                    .get()
                    .collection(collection.fineCollection)
                    .find({
                        user: userId
                    })
                    .toArray();

                resolve(userFineDetails);
            } catch (error) {
                reject(error);
            }
        })
    }
    ,
    getOtDetails: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const userOtDetails = await db
                    .get()
                    .collection(collection.otCollection)
                    .find({
                        user: userId
                    })
                    .toArray();

                resolve(userOtDetails);
            } catch (error) {
                reject(error);
            }
        })
    }
    ,
    getWithdrawDetails: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const userWithdrawDetails = await db
                    .get()
                    .collection(collection.withdrawCollection)
                    .find({
                        userId: new ObjectId(userId)
                    })
                    .toArray();

                resolve(userWithdrawDetails);
            } catch (error) {
                reject(error);
            }
        })
    }
    ,
    getFine: (userId) => {
        return new Promise(async (resolve, reject) => {
            const total = await db
                .get()
                .collection(collection.fineCollection)
                .aggregate([
                    {
                        $match: { user: userId }
                    },
                    {
                        $addFields: {
                            fine: { $toInt: '$fine' },
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalFine: { $sum: "$fine" }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            totalFine: 1,
                        }
                    }
                ])
                .toArray();

            console.log('Intermediate Result:', total);

            if (total.length > 0) {
                console.log('Final Result:', total[0]);
                resolve(total[0]);
            } else {
                console.log('No Results Found');
                resolve({ totalFine: 0 });
            }

        });
    },

    getIncome: (userId) => {
        return new Promise(async (resolve, reject) => {
            const salaryCollection = db.get().collection(collection.salaryCollection);
            const otCollection = db.get().collection(collection.otCollection);

            // Define two aggregation pipelines for salary and OT
            const salaryPipeline = [
                {
                    $match: { user: new ObjectId(userId) }
                },
                {
                    $addFields: {
                        salary: { $toInt: '$salary' },
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalSalary: { $sum: "$salary" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalSalary: 1,
                    }
                }
            ];

            const otPipeline = [
                {
                    $match: {
                        user: userId
                    }
                },
                {
                    $addFields: {
                        ot: { $toInt: '$ot' },
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalOT: { $sum: "$ot" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalOT: 1,
                    }
                }
            ];

            // Execute both pipelines in parallel
            const [salaryResult, otResult] = await Promise.all([
                salaryCollection.aggregate(salaryPipeline).toArray(),
                otCollection.aggregate(otPipeline).toArray(),
            ]);

            console.log('Salary Intermediate Result:', salaryResult);
            console.log('OT Intermediate Result:', otResult);

            // Calculate the total income by adding salary and OT
            const totalIncome = {
                totalSalary: salaryResult.length > 0 ? salaryResult[0].totalSalary : 0,
                totalOT: otResult.length > 0 ? otResult[0].totalOT : 0,
                total: (salaryResult.length > 0 ? salaryResult[0].totalSalary : 0) + (otResult.length > 0 ? otResult[0].totalOT : 0),
            };

            console.log('Total Income:', totalIncome);

            resolve(totalIncome);
        });
    }
    , getWithdraw: (userId) => {
        return new Promise(async (resolve, reject) => {
            const total = await db
                .get()
                .collection(collection.withdrawCollection)
                .aggregate([
                    {
                        $match: { userId: new ObjectId(userId) }
                    },
                    {
                        $addFields: {
                            amount: { $toInt: '$amount' },
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalWithdraw: { $sum: "$amount" }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            totalWithdraw: 1,
                        }
                    }
                ])
                .toArray();

            console.log('Intermediate Result:', total);

            if (total.length > 0) {
                console.log('Final Result:', total[0]);
                resolve(total[0]);
            } else {
                console.log('No Results Found');
                resolve({ totalWithdraw: 0 });
            }

        });
    },









}