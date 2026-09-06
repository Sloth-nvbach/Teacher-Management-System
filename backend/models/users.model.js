import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    address: String,
    identity: String,
    dob: Date,
    isDeleted: Boolean,
    // Role: STUDENT|TEACHER|ADMIN
    role: String
});

const User = mongoose.model('User', userSchema);
export default User;
