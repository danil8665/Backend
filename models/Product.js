import mongoose from "mongoose";

const Product = new mongoose.Schema ({
    manufacturer: {
        type: String,
        required: true
    },
    name: {
        type: String,
        equired: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    rate: {
        type: Number,
       
    },
    description: {
        type: String,
        
    },
    picture: {
        type: Object,
        
    }
})

export default mongoose.model('Product', Product)