const mongoose = require('mongoose')
const dataSchema = new mongoose.Schema({
    Fname:String,
    Lname:String,
    Email:String,
    Password:String,
})
module.exports =mongoose.model('UserData', dataSchema)
