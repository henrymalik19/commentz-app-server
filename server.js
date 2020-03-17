require('dotenv').config();
const express = require('express');
const faker = require('faker');
const app = express();

const { connectdb, User } = require('./db/db.js');
connectdb();

app.use(express.json());

app.post('/api/v1/signin', (req, res) => {

    try {
        User
            .findOne({ email: req.body.email })
            .populate('contacts')
            .exec(async (err, user) => {
                if (err) throw new Error(err);
                else if (user) {
                    if (req.body.password === user.password) res.status(200).json({
                        authenticated: true,
                        user
                    });
                    else res.status(400).json({
                        authenticated: false,
                        error: 'Username or Password Incorrect'
                    })

                } else res.status(400).json({
                    authenticated: false,
                    error: 'Username or Password Incorrect'
                })
            });
    } catch (err) {
        console.log(err);
    }
});

app.post('/api/v1/signup', (req, res) => {

    try {
        User.findOne({ email: req.body.email }, async (err, user) => {
            if (err) throw new Error(err)
            else if (user) {
                res.status(400).json({
                    authenticated: false,
                    error: 'User Already Exists!'
                });
            } else {
                let user = new User({
                    fname: req.body.fname,
                    lname: req.body.lname,
                    handle: req.body.handle,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: faker.image.avatar(),
                    created: Date.now(),
                    updated: Date.now(),
                });

                user = await user.save();
                console.log('New User Added to DB!');
                res.status(200).json({
                    authenticated: true,
                    user
                })
            }
        });
    } catch (err) {
        console.log(err);
    }
});

app.post('/api/v1/users', (req, res) => {
    try {
        User.find({
            $and: [
                {
                    handle: { $regex: req.body.handle, $options: 'i' }
                },
                {
                    handle: { $ne: req.body.currentUser.handle }

                }
            ]
        }, async (err, docs) => {
            if (err) throw new Error(err)
            res.status(200).json({
                users: docs
            })
        })
    } catch (err) {
        console.log(err.message);
    }
})

app.put('/api/v1/user/:id', async (req, res) => {
    try {
        User
            .findById(req.body.currentUser.id)
            .populate('contacts')
            .exec(async (err, user) => {
                if (err) throw new Error(err);
                switch (req.body.task) {
                    case 'ADD_CONTACT':
                        console.log('adding contact');
                        user.contacts.push(req.body.contactId);
                        user.save((err, user) => {
                            if (err) throw new Error(err);
                            User.findOne(user).populate('contacts').exec((err, user) => {
                                if (err) throw new Error(err);
                                res.status(200).json({
                                    user
                                })
                            })
                        });
                        break;
                    case 'REMOVE_CONTACT':
                        console.log('removing contact');
                        const index = user.contacts.findIndex(contact => contact._id.toString() === req.body.contactId.toString());
                        user.contacts.splice(index, 1);
                        user = await user.save();
                        res.status(200).json({
                            user
                        })
                        break;
                    default:
                        break;
                }

            });
    } catch (err) {
        console.log(err);
    }
});

app.listen(process.env.PORT, () => console.log(`Server in ${process.env.NODE_ENV} mode listening on port ${process.env.PORT}`));