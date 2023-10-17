var db = require('../config/connection')
var collection = require('../config/collection')
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    addEvent: (event) => {
        return new Promise((resolve, reject) => {
            event.slot = parseInt(event.slot)
            db.get().collection(collection.eventCollection).insertOne(event).then((data) => {
                console.log(data);
                resolve(data.insertedId);
            })
        })
    },
    getAllEvents: (req, res) => {
        db.get().collection(collection.eventCollection).find().toArray()
            .then((events) => {
                const updatedEvents = events.map((event) => {
                    if (event.slot === 0) {
                        return {
                            ...event,
                            slotStatus: "Slot is full",
                        };
                    }
                    return event;
                });
                res.json(updatedEvents); // Send updated events data as JSON response
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' }); // Handle errors and send an error response
            });
    }

    ,
    getAllEventsUser: (req, res) => {
        db.get().collection(collection.eventCollection)
            .find({ slot: { $gt: 0 } }) // Filter events with a slot greater than 0
            .toArray()
            .then((events) => {
                res.json(events); // Send filtered events data as JSON response
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' }); // Handle errors and send an error response
            });
    }

    ,
    deleteEvent: (proId) => {
        return new Promise((resolve, reject) => {
            console.log(proId);
            console.log(new ObjectId(proId)); // Add `new` here
            db.get().collection(collection.eventCollection).deleteOne({ _id: new ObjectId(proId) })
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    ,
    getEventDetails: (proId) => {
        return new Promise((resolve, reject) => {
            try {
                db.get().collection(collection.eventCollection).findOne({ _id: new ObjectId(proId) }).then((event) => {
                    resolve(event);
                })

            } catch (error) {
                reject(error);
            }
        });
    }
    ,
    updateEvent: (proId, proDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.eventCollection).updateOne({ _id: new ObjectId(proId) }, {
                $set: {
                    location: proDetails.location,
                    time: proDetails.time,
                    date: proDetails.date,
                    event: proDetails.event,
                    slot: proDetails.slot,

                }
            }).then((response) => {
                resolve()
            })

        })
    },
    getEmpInfo: (req, res) => {
        db.get().collection(collection.userCollection).find().toArray()
            .then((users) => {
                res.json(users); // Send events data as JSON response
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' }); // Handle errors and send an error response
            });
    },
    getUserDetails: (proId) => {
        return new Promise((resolve, reject) => {
            try {
                db.get().collection(collection.userCollection).findOne({ _id: new ObjectId(proId) }).then((user) => {
                    resolve(user);
                })

            } catch (error) {
                reject(error);
            }
        });
    },
    updateUser: (proId, proDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.userCollection).updateOne({ _id: new ObjectId(proId) }, {
                $set: {
                    role: proDetails.role,
                }
            }).then((response) => {
                resolve()
            })

        })
    },
    confirmedPdf: (proId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const bookingDetails = await db.get().collection(collection.bookCollection).find({
                    'events.item': new ObjectId(proId)
                }).toArray();

                if (bookingDetails && bookingDetails.length > 0) {
                    const userIds = bookingDetails.map((booking) => booking.user);

                    const users = await db.get().collection(collection.userCollection).find({
                        _id: { $in: userIds.map((userId) => new ObjectId(userId)) }
                    }).toArray();

                    resolve(users);
                } else {
                    reject("No booking details found for the provided proId");
                }
            } catch (error) {
                reject(error);
            }
        });
    },
    addFine: (userId, userDetails) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Check if any of the required fields are null
                if (!userDetails.eventId || !userDetails.fineFor || !userDetails.fine) {
                    reject("Incomplete data provided");
                    return;
                }

                const currentDate = new Date();

                const existingFine = await db.get().collection(collection.fineCollection).findOne({
                    user: userId,
                    eventId: userDetails.eventId
                });

                if (existingFine) {
                    reject("Fine is already marked for this user and event");
                } else {
                    const eventdetails = await db.get().collection(collection.eventCollection).findOne({ _id: new ObjectId(userDetails.eventId) })

                    const fine = {
                        user: userId,
                        eventId: userDetails.eventId,
                        finefor: userDetails.fineFor,
                        fine: - parseInt(userDetails.fine, 10),
                        event: eventdetails.event,
                        location: eventdetails.location,
                        date: currentDate
                    };

                    const result = await db.get().collection(collection.fineCollection).insertOne(fine);
                    resolve("Fine added successfully");
                }
            } catch (error) {
                reject(error);
            }
        });
    },
    addOt: (userId, userDetails) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Check if any of the required fields are null
                if (!userDetails.eventId || !userDetails.otFor || !userDetails.ot) {
                    reject("Incomplete data provided");
                    return;
                }
                const currentDate = new Date();
                const existingOt = await db.get().collection(collection.otCollection).findOne({
                    user: userId,
                    event: userDetails.eventId
                });
                if (existingOt) {
                    reject("Ot is already marked for this user and event");
                } else {
                    const eventdetails = await db.get().collection(collection.eventCollection).findOne({ _id: new ObjectId(userDetails.eventId) })

                    const ot = {
                        user: userId,
                        eventId: userDetails.eventId,
                        otfor: userDetails.otFor,
                        ot: parseInt(userDetails.ot, 10),
                        event: eventdetails.event,
                        location: eventdetails.location,
                        date: currentDate
                    };
                    const result = await db.get().collection(collection.otCollection).insertOne(ot);
                    resolve("Ot added successfully");
                }

            } catch (error) {
                reject(error);
            }
        })
    }

    ,
    addSalary: async (events, userId) => {
        try {
            const user = await db
                .get()
                .collection(collection.userCollection)
                .findOne({ _id: new ObjectId(userId) });
            const currentDate = new Date();
            if (user) {
                let salary;

                switch (user.role) {
                    case 'class-C':
                        salary = 420;
                        break;
                    case 'class-B':
                        salary = 430;
                        break;
                    case 'class-A':
                        salary = 440;
                        break;
                    case 'supervisor':
                        salary = 450;
                        break;
                    case 'caption':
                        salary = 470;
                        break;
                    case 'main-boy':
                        salary = 500;
                        break;
                    default:
                        // Handle the case where the user's role is not recognized
                        throw new Error('Invalid role');
                }
                // Check if a salary record already exists for this event
                const existingSalary = await db
                    .get()
                    .collection(collection.salaryCollection)
                    .findOne({
                        user: user._id, event: events
                    });

                if (existingSalary) {
                    throw new Error('Salary record already exists for this event');
                } else {
                    // Create the salary record with property checks
                    console.log('eventdetails');
                    const eventdetails = await db.get().collection(collection.eventCollection).findOne({ _id: new ObjectId(events) })
                    console.log(eventdetails);
                    console.log('eventdetails');
                    const salaryRecord = {
                        user: user._id,
                        event: events,
                        role: user.role,
                        salary: salary,
                        events: eventdetails.event,
                        location: eventdetails.location,
                        date: currentDate,
                    };

                    // Check each property before inserting
                    for (const key in salaryRecord) {
                        if (salaryRecord[key] === undefined || salaryRecord[key] === '') {
                            throw new Error(`Invalid value for ${key}`);
                        }
                    }

                    const result = await db
                        .get()
                        .collection(collection.salaryCollection)
                        .insertOne(salaryRecord);

                    if (result.insertedId) {
                        return { status: 'success', message: 'Salary record added successfully' };
                    } else {
                        throw new Error('Failed to insert salary record');
                    }
                }
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            throw error;
        }
    },
    withDraw: async (userDetails) => {
        try {
            const currentDate = new Date();

            // Find the user in the database
            const numberToSearch = parseInt(userDetails.number, 10);
            let user = await db.get().collection(collection.userCollection).findOne({ number: numberToSearch });
            if (user) {

                const withdraw = {
                    userId: user._id,
                    name: user.name,
                    number: userDetails.number,
                    amount: -parseInt(userDetails.amount, 10),
                    date: currentDate,
                };
                const result = await db.get().collection(collection.withdrawCollection).insertOne(withdraw);

                return result.insertedId; // Return the inserted ID or perform necessary actions
            } else {
                throw new Error('User not found'); // Handle the case when the user is not found
            }
        } catch (error) {
            throw error;
        }
    }
    ,
    viewWithraw: (req, res) => {
        db.get().collection(collection.withdrawCollection).find().toArray()
            .then((users) => {
                res.json(users); // Send events data as JSON response
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' }); // Handle errors and send an error response
            });
    },
    deleteWithdraw: (proId) => {
        return new Promise((resolve, reject) => {
            console.log(proId);
            console.log(new ObjectId(proId)); // Add `new` here
            db.get().collection(collection.withdrawCollection).deleteOne({ _id: new ObjectId(proId) })
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }












}