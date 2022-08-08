const mongoose = require("mongoose")
require("dotenv").config({path: "variables.env"})

const conectarDB = async () => {

    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("DB Conectada")
    } catch (error) {
        console.log("Error", error)
        process.exit(1)
    }
}

module.exports = conectarDB