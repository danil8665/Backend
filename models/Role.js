import { Schema } from "mongoose";
import mongoose from "mongoose";

const Role = new Schema ({
    value: {
        type: String,
        unique: true,
        default: "USER"
    }
})

export default mongoose.model('Role', Role)