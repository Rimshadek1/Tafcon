var express = require('express');
const userHelper = require('../Helpers/userHelper');
var router = express.Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const adminHelper = require('../Helpers/adminHelper');
const multer = require('multer')
const path = require('path');
const { log } = require('console');

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
                if (
                    decoded.role === 'class-A' ||
                    decoded.role === 'class-B' ||
                    decoded.role === 'class-C' ||
                    decoded.role === 'supervisor' ||
                    decoded.role === 'main-boy' ||
                    decoded.role === 'captain' ||
                    decoded.role === 'admin'
                ) {
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
const verifyService = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ error: 'Token is missing' });
    } else {
        jwt.verify(token, 'auibaekjbwea65136awibiba', (err, decoded) => {
            if (err) {
                return res.json({ error: 'Error with token' });
            } else {
                console.log(decoded);
                if (decoded.role === 'admin' ||
                    decoded.role === 'main-boy') {
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
                res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' }, {
                    id: response.user._id,
                    number: response.user.number,
                    role: response.user.role,
                    name: response.user.name,
                });
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
router.get('/profile', (req, res) => {
    const token = req.cookies?.token;
    if (token) {
        jwt.verify(token, 'auibaekjbwea65136awibiba', {}, (err, userData) => {
            if (err) throw err;
            res.json({
                userData
            })
        })
    } else {
        res.status(401).json('no token')
    }
})
router.get('/', verifyUser, (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, 'auibaekjbwea65136awibiba', (err, decoded) => {

        res.json({ status: 'success', id: decoded.id, role: decoded.role });
    })
})
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
});

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
            if (fs.existsSync(imagePath)) {
                // imageUrl = `public/Profile-pictures/${userId}.${extension}`;
                imageUrl = `${userId}.${extension}`;
                break;
            }
        }
        if (imageUrl) {
            res.json({ status: 'success', imageUrl: imageUrl });
        } else {
            res.json({ status: 'success', imageUrl: '' });
        }
    });
});

router.get('/getevents', verifyUser, adminHelper.getAllEventsUser)

router.post('/confirmbooking/:proId', verifyUser, (req, res) => {
    const proId = req.params.proId;
    const token = req.cookies.token;
    jwt.verify(token, 'auibaekjbwea65136awibiba', (err, decoded) => {
        const UserId = decoded.id;
        userHelper.Booking(proId, UserId).then((response) => {
            if (response === 'success') {
                res.json({ status: 'success' });
            } else if (response === 'already booked') {
                res.json({ status: 'already booked' });
            }
        });
    });
});

router.get('/bookedevents', verifyUser, (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, 'auibaekjbwea65136awibiba', (err, decoded) => {
        const UserId = decoded.id;
        console.log(UserId);
        userHelper.getEventList(UserId).then((response) => {

            res.json({ status: 'success', response });
        });
    })
})
router.get('/viewSalary', (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, 'auibaekjbwea65136awibiba', async (err, decoded) => {
        const UserId = decoded.id;
        try {
            const details = await userHelper.getSalaryDetails(UserId);
            res.json({ status: 'success', details });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ status: 'error', message: 'Failed to retrieve salary details' });
        }
    });
});
router.get('/viewFine', (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, 'auibaekjbwea65136awibiba', async (err, decoded) => {
        const UserId = decoded.id;
        try {
            const details = await userHelper.getFineDetails(UserId);
            res.json({ status: 'success', details });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ status: 'error', message: 'Failed to retrieve salary details' });
        }
    });
});
router.get('/ot', (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, 'auibaekjbwea65136awibiba', async (err, decoded) => {
        const UserId = decoded.id;
        try {
            const details = await userHelper.getOtDetails(UserId);
            res.json({ status: 'success', details });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ status: 'error', message: 'Failed to retrieve salary details' });
        }
    });
});
router.get('/withdrawf', (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, 'auibaekjbwea65136awibiba', async (err, decoded) => {
        const UserId = decoded.id;
        try {
            const details = await userHelper.getWithdrawDetails(UserId);
            res.json({ status: 'success', details });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ status: 'error', message: 'Failed to retrieve salary details' });
        }
    });
})
router.get('/amount', (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, 'auibaekjbwea65136awibiba', async (err, decoded) => {
        const UserId = decoded.id;
        try {
            const fine = await userHelper.getFine(UserId);
            const income = await userHelper.getIncome(UserId)
            const withdraw = await userHelper.getWithdraw(UserId)
            const balance = income.total + withdraw.totalWithdraw + fine.totalFine;
            res.json({ status: 'success', fine, income, withdraw, balance });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ status: 'error', message: 'Failed to retrieve salary details' });
        }
    });
})







//admin routers

router.get('/viewevents', verifyAdmin, (req, res) => {
    res.json({ status: 'success' });
});

router.get('/viewevent', verifyService, adminHelper.getAllEvents);
router.delete('/admin/delete-event/:eventId', verifyAdmin, (req, res) => {
    const eventId = req.params.eventId;
    adminHelper.deleteEvent(eventId)
        .then((response) => {
            res.json({ status: 'ok' });
        })
});
router.get('/editbutton/:eventId', verifyAdmin, async (req, res) => {
    let event = await adminHelper.getEventDetails(req.params.eventId)
    if (event) {
        res.json({ event, status: 'ok' })
    }
})
router.post('/editbutton/:eventId', verifyAdmin, (req, res) => {
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
router.get('/viewuser', verifyAdmin, adminHelper.getEmpInfo)
router.get('/edituser/:userId', async (req, res) => {
    console.log(req.params.userId);
    let user = await adminHelper.getUserDetails(req.params.userId)
    if (user) {
        res.json({ user, status: 'ok' })
    }
});
router.post('/edituser/:userId', verifyAdmin, (req, res) => {
    console.log(req.params.userId);
    console.log(req.body);
    adminHelper.updateUser(req.params.userId, req.body).then((response) => {
        res.json({ status: 'updated' })

    })
})
router.get('/confirmedpdf/:proId', verifyService, (req, res) => {
    const proId = req.params.proId;

    adminHelper.confirmedPdf(proId)
        .then((userData) => {
            res.json({ users: userData });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        });
});
router.post('/fine/:userId', verifyService, async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await adminHelper.addFine(userId, req.body);
        res.json({ status: 'ok', message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the fine', message: error });
    }
});
router.post('/ot/:userId', verifyService, async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await adminHelper.addOt(userId, req.body);
        res.json({ status: 'ok', message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the fine', message: error });
    }
});
router.post('/salary/:userId', verifyService, async (req, res) => {
    const userId = req.params.userId;
    const eventId = req.body.eventId; // Access the event ID from the request body
    try {
        const result = await adminHelper.addSalary(eventId, userId); // Pass the event ID to the addSalary function
        res.json({ status: 'success', result });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error });
    }
});
router.post('/withdraw', (req, res) => {
    adminHelper.withDraw(req.body).then((response) => {
        if (response) {

            res.json({ status: "success" })
        }
    })
})
router.get('/withdraw', adminHelper.viewWithraw)
router.delete('/delete-withdraw/:id', (req, res) => {
    const withId = req.params.id;
    adminHelper.deleteWithdraw(withId).then((response) => {
        res.json({ status: 'ok' });
    })
})
module.exports = router;