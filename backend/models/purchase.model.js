import mongoose,{Schema} from "mongoose"

const purchaseSchema=new Schema({
   notesId:{
    type:mongoose.Types.ObjectId,
    ref:"Notes"
   },
   userId:{
    type:mongoose.Types.ObjectId,
    ref:"User"
   }
})
export const Purchase=mongoose.model("Purchase",purchaseSchema)