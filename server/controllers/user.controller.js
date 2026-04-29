import ApiError from "../utils/ApiError.js"

const userProfile = (req, res) => {
    const {id, name, email} = req.user;

    res.status(200).json({
        success: true,
        statusCode: 200,
        id,
        name, email
    })
}

export default userProfile;