import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
    // userId: ObjectId, khóa ngoại liên kết với bảng users
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: Boolean,
    isDeleted: Boolean,
    // code: mã GV (tối đa 10 ký tự)
    code: {
        type: String,
        maxlength: 10,
    },
    startDate: Date,
    endDate: Date,

    // Danh sách khóa ngoại liên kết với teacher Position.
    teacherPositionsId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TeacherPosition'
        }
    ],

    // Danh sách thông tin về trình độ học vấn.
    degrees: [
        {
            type: {
                type: String,
            },
            school: {
                type: String,
            },
            major: {
                type: String,
            },
            year: {
                type: Number,
            },
            isGraduated: {
                type: Boolean,
            }
        }
    ]
});

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;
