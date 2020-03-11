const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    avatar: String,
    created: Date,
    updated: Date
});

const User = mongoose.model('User', UserSchema);


const connectdb = () => {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', function () {
        console.log("Mongo DB Connected");
    });
}

module.exports = { connectdb, User };