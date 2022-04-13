const mongoose = require("mongoose");
const todoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

mpdule.express = mongoose.model("Todo", todoSchema)