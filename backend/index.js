import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
// import { v2 as cloudinary } from 'cloudinary';
// import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import cors from "cors"
// import multer from "multer";

const app = express()
dotenv.config()

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use("./public/temp",express.static("temp"))

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.use(fileUpload({
//     useTempFiles : true,
//     tempFileDir : '/tmp/'
// }));

const port = process.env.PORT || 3000
const DB_URI=process.env.MONGO_URI

try {
    await mongoose.connect(DB_URI);
    console.log("Connected to Database Successfully!!!");
} catch (error) {
    console.log("Error connecting DB",error)
}

//import routes
import notesRoute from "./routes/notes.route.js"
import userRoute from "./routes/user.route.js"
import adminRoute from "./routes/admin.route.js"
import orderRoute from "./routes/order.route.js"
//routes
app.use("/api/v1/notes",notesRoute)
app.use("/api/v1/user",userRoute)
app.use("/api/v1/admin",adminRoute)
app.use("/api/v1/order",orderRoute)




//cloudinary file upload
//  cloudinary.config({ 
//         cloud_name:process.env.cloud_name, 
//         api_key:process.env.api_key, 
//         api_secret:process.env.api_secret
//     });

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
