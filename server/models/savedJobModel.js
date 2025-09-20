// Filename: server/models/savedJobModel.js

import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema({
    // User jo job save kar raha hai
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // 'user' collection se reference
        required: true
    },
    // Job jo save ho rahi hai
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job', // 'job' collection se reference
        required: true
    }
}, {
    timestamps: true // createdAt aur updatedAt fields
});

// Production Best Practice: Ek user ek job ko ek hi baar save kar sakta hai.
// Yeh compound index ensure karega ki user+job ka combination unique ho.
savedJobSchema.index({ user: 1, job: 1 }, { unique: true });

const savedJobModel = mongoose.models.savedJob || mongoose.model('savedJob', savedJobSchema);

export default savedJobModel;