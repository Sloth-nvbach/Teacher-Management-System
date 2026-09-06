import Teacher from "../models/teachers.model.js";
import User from "../models/users.model.js";

// Generate a random numeric teacher code that does not exist yet
async function generateTeacherCode() {
    let code;
    let exists = true;
    while (exists) {
        code = String(Math.floor(1000000000 + Math.random() * 9000000000));
        exists = await Teacher.exists({ code });
    }
    return code;
}

const teachersController = {
    // GET /teachers - list of teachers with user info
    getAllTeachers: async (req, res) => {
        try {
            const teachers = await Teacher.find().populate('userId').populate('teacherPositionsId');
            const result = teachers.map((t) => {
                const degree = t.degrees?.[0];
                return {
                    _id: t._id,
                    code: t.code,
                    name: t.userId?.name,
                    email: t.userId?.email,
                    phoneNumber: t.userId?.phoneNumber,
                    state: t.isDeleted ? 'Deleted' : 'Active',
                    degrees: degree
                        ? { type: degree.type, school: degree.school, major: degree.major }
                        : null,
                };
            });
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // POST /teachers - create a new teacher (creates the linked user as well)
    createTeacher: async (req, res) => {
        try {
            const { code, name, email, phoneNumber, address, identity, dob, degrees, teacherPositions, teacherPositionsId, startDate, endDate } = req.body;

            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }

            // Validate teacher code: max 10 characters
            if (code && (typeof code !== 'string' || code.length > 10)) {
                return res.status(400).json({ message: 'Code must be a string with at most 10 characters' });
            }

            // Check code uniqueness
            if (code) {
                const codeExists = await Teacher.exists({ code });
                if (codeExists) {
                    return res.status(400).json({ message: 'Code is already in use' });
                }
            }

            // Check email uniqueness
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already in use' });
            }

            const user = await User.create({
                name,
                email,
                phoneNumber,
                address,
                identity,
                dob,
                isDeleted: false,
                role: 'TEACHER',
            });

            const teacherCode = code || await generateTeacherCode();

            const teacher = await Teacher.create({
                userId: user._id,
                code: teacherCode,
                isActive: true,
                isDeleted: false,
                startDate,
                endDate,
                teacherPositionsId: teacherPositionsId || teacherPositions,
                // degrees được lưu dưới dạng mảng trong DB
                degrees: degrees ? (Array.isArray(degrees) ? degrees : [degrees]) : [],
            });

            return res.status(201).json(teacher);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
};

export default teachersController;
