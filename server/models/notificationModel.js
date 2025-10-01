// Filename: server/models/notificationModel.js (CORRECTED)

import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema({
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        
        enum: ['new_offer', 'offer_accepted', 'friend_request', 'friend_request_accepted', 'badge_awarded'],
        required: true,
    },
    link: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;