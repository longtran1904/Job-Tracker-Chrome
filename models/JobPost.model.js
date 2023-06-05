import mongoose from "mongoose";
const { Schema } = mongoose;

const JobPostSchema = new Schema({
    title: String,
    location: String,
    update_on: Date,
})

module.exports = mongoose.model('JobPost', JobPostSchema);