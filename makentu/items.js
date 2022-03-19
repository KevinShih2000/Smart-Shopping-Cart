import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const itemsSchema = new Schema({
    name   : String,
    price  : Number,
    amount : Number
});

const items = mongoose.model('items', scoreCardSchema);

export default items;