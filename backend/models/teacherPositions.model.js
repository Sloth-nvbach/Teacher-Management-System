import mongoose from 'mongoose';

const teacherPositionSchema = new mongoose.Schema({
    name: String,
    code: String,
    // description
    des: String,
    isActive: Boolean,
    isDeleted: Boolean
});

const TeacherPosition = mongoose.model('TeacherPosition', teacherPositionSchema);
export default TeacherPosition;
