import TeacherPosition from "../models/teacherPositions.model.js";

const teacherPositionsController = {
    // GET /teacher-positions - list all positions
    getAllPositions: async (req, res) => {
        try {
            const positions = await TeacherPosition.find();
            return res.status(200).json(positions);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // POST /teacher-positions - create a new position (code must be unique)
    createPosition: async (req, res) => {
        try {
            const { name, code, des } = req.body;

            if (!code) {
                return res.status(400).json({ message: 'Code is required' });
            }

            const existing = await TeacherPosition.findOne({ code });
            if (existing) {
                return res.status(400).json({ message: 'Code is already in use' });
            }

            const position = await TeacherPosition.create({
                name,
                code,
                des,
                isActive: true,
                isDeleted: false,
            });

            return res.status(201).json(position);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
};

export default teacherPositionsController;
