import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema({
    // Jisko notification bhejni hai
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    // Jisne action trigger kiya (e.g., offer dene wala)
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Notification ka type kya hai
    type: {
        type: String,
        enum: ['new_offer', 'offer_accepted', 'friend_request', 'friend_request_accepted'],
        required: true,
    },
    // Notification par click karke kahan jaana hai
    link: { type: String, required: true }, // e.g., /tasks/taskId or /profile/userId
    // Notification padhi gayi ya nahi
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
