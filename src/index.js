require('dotenv').config()
const app = require("./app");
const connectDB = require('./db/connection');

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running for ${PORT}`);
    });
}).catch((error) => {
    console.log("mongoDb connection error : ", error);
})