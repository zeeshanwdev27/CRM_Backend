import Department from '../models/Department.js';

export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({});
        res.status(200).json({
            status: "success",
            message: "Departments successfully fetched",
            data: departments
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message || 'Failed to fetch departments'
        });
    }
};