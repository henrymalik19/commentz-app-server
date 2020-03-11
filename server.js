require('dotenv').config();
const express = require('express');
const faker = require('faker');
const app = express();

const { connectdb, User } = require('./db/db.js');
connectdb();

app.use(express.json());

app.post('/api/v1/signin', (req, res) => {

    try {
        User.findOne({ email: req.body.email }, async (err, user) => {
            if (err) throw new Error(err);
            else if (user) {
                if (req.body.password === user.password) res.status(200).json({
                    authenticated: false,
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
        User.find({ email: req.body.email }, async (err, user) => {
            if (err) throw new Error(err)
            else if (user) {
                res.status(400).json({
                    authenticated: false,
                    error: 'User Already Exists!'
                });
            } else {
                let user = new User({
                    name: req.body.name,
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

app.listen(process.env.PORT, () => console.log(`Server in ${process.env.NODE_ENV} mode listening on port ${process.env.PORT}`));