var express = require('express');
const userHelper = require('../Helpers/userHelper');
var router = express.Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const adminHelper = require('../Helpers/adminHelper');
const multer = require('multer')
const path = require('path');

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
                if (decoded.role === 'user') {
                    next();
                } else {
                    return res.json({ error: 'Not user' });
                }
            }
        });
    }
};
const verifyAdmin = (req, res, next) => {
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

//routers users



router.post('/register', async (req, res) => {
    try {
        const id = await userHelper.register(req.body)
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
                const token = jwt.sign({
                    number: response.user.number,
                    role: response.user.role,
                    name: response.user.name,
                    id: response.user._id
                }, 'auibaekjbwea65136awibiba', { expiresIn: '1d' });
                res.cookie('token', token);
                res.json({ status: 'success', role: response.user.role });
            } else {
                res.status(401).json({ status: 'error', message: response.error });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ status: 'error', message: 'An error occurred during login.' });
        });
});
router.get('/', verifyUser, (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, 'auibaekjbwea65136awibiba', (err, decoded) => {

        res.json({ status: 'success', id: decoded.id });
    })
})


router.get('/profile-image', verifyUser, (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, 'auibaekjbwea65136awibiba', (err, decoded) => {
        if (err) {
            // Handle the error, e.g., return an error response
            return res.status(500).json({ status: 'error', message: 'Token verification failed' });
        }

        // Generate the image URL based on the user's ID
        const userId = decoded.id;
        const imageExtensions = ['jpg', 'png'];

        // Find the first available image format
        let imageUrl = '';
        for (const extension of imageExtensions) {
            const imagePath = path.join(__dirname, '..', 'public', 'Profile-pictures', `${userId}.${extension}`);
            console.log(imagePath);

            if (fs.existsSync(imagePath)) {
                // imageUrl = `public/Profile-pictures/${userId}.${extension}`;
                imageUrl = `${userId}.${extension}`;
                console.log(`Found image at path: ${imageUrl}`);
                break;
            }
        }
        console.log(`Final imageUrl: ${imageUrl}`);

        if (imageUrl) {
            res.json({ status: 'success', imageUrl: imageUrl });
        } else {
            res.json({ status: 'success', imageUrl: '' });
        }
    });
});

router.get('/getevents', adminHelper.getAllEvents)









//admin routers

router.get('/viewevents', verifyAdmin, (req, res) => {
    res.json({ status: 'success' });
});

router.get('/viewevent', adminHelper.getAllEvents);
router.delete('/admin/delete-event/:eventId', (req, res) => {
    const eventId = req.params.eventId;
    adminHelper.deleteEvent(eventId)
        .then((response) => {
            res.json({ status: 'ok' });
        })
});
router.get('/editbutton/:eventId', async (req, res) => {
    let event = await adminHelper.getEventDetails(req.params.eventId)
    if (event) {
        res.json({ event, status: 'ok' })
    }
})
router.post('/editbutton/:eventId', (req, res) => {
    console.log(req.params.eventId);
    console.log(req.body);

    adminHelper.updateEvent(req.params.eventId, req.body).then((response) => {


        res.json({ status: 'updated' })

    })
})
router.post('/addevent', verifyAdmin, async (req, res) => {
    try {
        console.log(req.body);
        const response = await adminHelper.addEvent(req.body);
        res.json({ status: 'ok' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the event' });
    }
});
router.get('/viewuser', adminHelper.getEmpInfo)
router.get('/edituser/:userId', async (req, res) => {
    console.log(req.params.userId);
    let user = await adminHelper.getUserDetails(req.params.userId)
    if (user) {
        res.json({ user, status: 'ok' })
    }
});
router.post('/edituser/:userId', (req, res) => {
    console.log(req.params.userId);
    console.log(req.body);
    adminHelper.updateUser(req.params.userId, req.body).then((response) => {
        res.json({ status: 'updated' })

    })
})

module.exports = router;