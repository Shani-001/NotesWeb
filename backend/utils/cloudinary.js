import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config();

// console.log("Cloudinary ENV:", {
//   CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
//   API_KEY: process.env.CLOUDINARY_API_KEY ? "Loaded ✅" : "Missing ❌",
//   API_SECRET: process.env.CLOUDINARY_API_SECRET ? "Loaded ✅" : "Missing ❌"
// });

cloudinary.config({     
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath,type="auto") => {
    try {
        // console.log(localFilePath)
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
             resource_type:type
        })
        // file has been uploaded successfull
        // console.log("file is uploaded on cloudinary ", response.secure_url);
        fs.unlinkSync(localFilePath)
        // console.log(response)
        return response;

    } catch (error) {
        console.error("Cloudinary upload error:", error);
    if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
    }
    return null;
    }
}



export {uploadOnCloudinary}