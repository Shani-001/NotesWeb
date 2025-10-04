import { Notes } from "../models/notes.model.js"
// import { v2 as cloudinary } from 'cloudinary';
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Purchase } from "../models/purchase.model.js";
export const createNotes = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const adminId = req.adminId;

    if (!title || !description || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files || !req.files.image || !req.files.notesPdf) {
      return res.status(400).json({ message: "Image or PDF missing" });
    }

    const image = req.files.image[0]?.path;
    const notesPdf = req.files.notesPdf[0];
    const pdflocalpath=req.files.notesPdf[0]?.path;
// console.log(image,pdflocalpath)
    // // Upload image to Cloudinary
    // const cloudImage = await cloudinary.uploader.upload(image.path, {
    //   folder: "/upload/images",
    // });

    // // Upload PDF to Cloudinary
    // const cloudPdf = await cloudinary.uploader.upload(notesPdf.path, {
    //   folder: "/upload/pdf",
    //   resource_type: "raw", // important for PDF
    // });
   const cloudImage = await uploadOnCloudinary(image, "image");

    if(!cloudImage){
      console.log("image is not uploaded")
    }
   const cloudPdf = await uploadOnCloudinary(pdflocalpath, "raw");
 if(!cloudPdf){
      console.log("pdf is not uploaded")
    }
// console.log(cloudImage,cloudPdf)
    const notes = await Notes.create({
      title,
      description,
      price,
      image: {
        public_id: cloudImage?.public_id,
        url: cloudImage?.secure_url,
      },
      notesPdf: {
        // public_id: cloudPdf?.public_id,
        url: cloudPdf?.secure_url,
        // fileName: notesPdf?.original_filename,
      },
      creatorId: adminId,
    });

    res.status(200).json({ message: "Notes created successfully", notes });
  } catch (error) {
    console.log("Error creating notes:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};


export const updateNotes = async (req, res) => {
  const adminId = req.adminId;
  const { notesId } = req.params;
  const { title, description, price } = req.body;

  try {
    const searchNotes = await Notes.findById(notesId);
    if (!searchNotes) {
      return res.status(404).json({ message: "Notes not found" });
    }

    // Use let (not const) so we can reassign later
    let updatedImage = searchNotes.image;
    let updatedPdf = searchNotes.notesPdf;

    if (req.files && (req.files.image || req.files.notesPdf)) {
      // ✅ Access files correctly for multer
      const imagePath = req.files?.image?.[0]?.path;
      const pdfPath = req.files?.notesPdf?.[0]?.path;

      // Upload to Cloudinary only if new file provided
      if (imagePath) {
        const cloudImage = await uploadOnCloudinary(imagePath, "image");
        if (cloudImage) {
          updatedImage = {
            public_id: cloudImage.public_id,
            url: cloudImage.secure_url,
          };
        }
      }

      if (pdfPath) {
        const cloudPdf = await uploadOnCloudinary(pdfPath, "raw");
        if (cloudPdf) {
          updatedPdf = {
            url: cloudPdf.secure_url,
          };
        }
      }
    }

    const updatedNote = await Notes.findOneAndUpdate(
      { _id: notesId, creatorId: adminId },
      {
        title,
        description,
        price,
        image: updatedImage,
        notesPdf: updatedPdf,
      },
      { new: true }
    );

    if (!updatedNote) {
      return res
        .status(403)
        .json({ message: "Cannot update note created by another admin" });
    }

    return res
      .status(200)
      .json({ message: "Notes updated successfully", updatedNote });
  } catch (error) {
    console.error("Notes update error:", error);
    return res.status(500).json({ error: "Internal server error while updating notes" });
  }
};



export const deleteNotes=async (req,res)=>{
    const adminId=req.adminId
    const {notesId}=req.params
    try {
        const searchNotes=await Notes.findById({_id:notesId})
       if(!searchNotes){
       return res.status(401).json({message:"Notes not found"})
           }
      const notes=await Notes.findOneAndDelete({
        _id:notesId,
       creatorId:adminId
      }) 
      if(!notes){
       return res.status(400).json({errors:"Can't Delete,Created by Another Admin"})
      }
      return res.status(200).json({message:"Notes Deleted successfully"})
    } catch (error) {
        console.log("Error in Deleting course",error)
       return res.status(400).json({errors:"error in deleting notes"})
    }
}
export const getAllNotes=async (req,res)=>{
    try {
        const notes=await Notes.find({})
        if(!notes){
            return res.status(400).json({message:"Notes not found"})
        }
        return res.status(200).json({notes})
    } catch (error) {
       console.log("error in getting all notes",error)
       return res.status(400).json({errors:"error in getting all notes"}) 
    }
}

export const notesDetail=async (req,res)=>{
 const {notesId}=req.params
try {
    const notes=await Notes.findById({_id:notesId})
    if(!notes){
       return res.status(500).json({message:"Notes Detail not found"})
    }
   return res.status(200).json({notes})
} catch (error) {
   console.log("error in getting notes detail",error) 
   return res.status(400).json({error:"error in getting notes detail"})
}

}

import Stripe from "stripe";
// import STRIPE_SECRET_KEY from "../config.js";
import config from "../config.js";

const stripe=new Stripe(config.STRIPE_SECRET_KEY);
// console.log(config.STRIPE_SECRET_KEY)
export const buyNotes=async (req,res)=>{
    const {userId}=req;
    const {notesId}=req.params;

    try {
        const notesFound=await Notes.findById(notesId)
        if(!notesFound){
          return res.status(404).json({errors:"Notes not Found"}) 
        }
        const existingNotes=await Purchase.findOne({notesId,userId})
        if(existingNotes){
          return res.status(400).json({error:"User has already purchased This Notes"})
        }

        //stripe payments
       const amount = notesFound.price;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
      return  res.status(200).json({message:"Notes Purchased Successfully",notesFound,clientSecret:  paymentIntent.client_secret})
    } catch (error) {
        console.log("error in buying Notes",error)
      return  res.status(401).json({errors:"Error in Buying Notes"})
    }
}