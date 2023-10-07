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
                res.json(events); // Send events data as JSON response
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


}