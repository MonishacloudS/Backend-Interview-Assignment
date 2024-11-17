const mongoose = require("mongoose")
require("dotenv").config();


mongoose.set("strictQuery", false)
mongoose.connect(process.env.MONGODB_URL,
    {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,

    }).then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((err) => {
        console.log(err, "Error")
    });