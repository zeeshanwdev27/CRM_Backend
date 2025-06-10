import Role from '../models/Role.js';

export const getRoles = async (req, res) => {
    try {
        const roles = await Role.find({}).populate("department")
        res.status(200).json({
            status: "success",
            message: "Roles successfully fetched",
            data: roles
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message || 'Failed to fetch roles'
        });
    }
};