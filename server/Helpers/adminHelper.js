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
    }



}