import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAccount",
        required: true
    },
    sender: {
        type: String,
        required: true,
        enum: ["user", "bot"]
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
