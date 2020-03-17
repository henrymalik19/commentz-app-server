const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    handle: String,
    email: String,
    password: String,
    avatar: String,
    created: Date,
    updated: Date,
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
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