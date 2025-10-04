import mongoose,{Schema} from "mongoose"

const notesSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
   image: {
  public_id: { type: String },
  url: { type: String }
},
    notesPdf:{
    //      public_id:{
    //     type:String,
    //     required:true
    //    },
       url:{
        type:String,
        // required:true
       }
    //   fileName: { type: String, required: true }
    //   filePath: { type: String, required: true }
    },
    creatorId:{
        type:mongoose.Types.ObjectId,
        ref:"Admin"
    }
})
export const Notes=mongoose.model("Notes",notesSchema)