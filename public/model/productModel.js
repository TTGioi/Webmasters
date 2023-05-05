const db = require('./db');
const productSchema = new db.mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    }
});

const productModel = new db.mongoose.model('product', productSchema);

module.exports = productModel;