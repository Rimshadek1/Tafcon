var express = require('express');
const userHelper = require('../Helpers/userHelper');
var router = express.Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const adminHelper = require('../Helpers/adminHelper');

//middlewire
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ error: 'Token is missing' });
    } else {
        jwt.verify(token, 'auibaekjbwea65136awibiba', (err, decoded) => {
            if (err) {
                return res.json({ error: 'Error with token' });
            } else {
                console.log(decoded);
                if (decoded.role === 'admin') {
                    next();
                } else {
                    return res.json({ error: 'Not admin' });
                }
            }
        });
    }
};

router.post('/register', async (req, res) => {
    try {
        const id = await userHelper.register(req.body);
        let image = req.files.image;
        let imageName = id + '.jpg';
        if (image.mimetype === 'image/png') {
            imageName = id + '.png';
        }
        console.log(id);
        const destinationDir = './public/Profile-pictures/';
        if (!fs.existsSync(destinationDir)) {
            fs.mkdirSync(destinationDir, { recursive: true });
        }
        await image.mv(destinationDir + imageName);
        res.json('success');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});
router.post('/login', (req, res) => {
    userHelper.doLogin(req.body)
        .then((response) => {
            if (response.status) {
                const token = jwt.sign({ number: response.user.number, role: response.user.role }, 'auibaekjbwea65136awibiba', { expiresIn: '1d' });
                res.cookie('token', token);
                res.json({ status: 'success', role: response.user.role });
                console.log(response.user.role);
            } else {
                res.status(401).json({ status: 'error', message: response.error });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ status: 'error', message: 'An error occurred during login.' });
        });
});


//admin
router.get('/viewevents', verifyUser, (req, res) => {
    res.json({ status: 'success' });
});

router.get('/viewevent', adminHelper.getAllEvents);
router.delete('/admin/delete-event/:eventId', (req, res) => {
    const eventId = req.params.eventId;
    console.log(eventId);
    adminHelper.deleteEvent(eventId)
        .then((response) => {
            res.json({ status: 'ok' });
        })
});

module.exports = router;