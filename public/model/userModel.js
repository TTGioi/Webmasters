const db = require('./db');
const userSchema = new db.mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    role: {
        type: String,
        require:true,
        default:"User"
    }
});
const userModel = new db.mongoose.model('user', userSchema);

module.exports = userModel;