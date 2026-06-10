import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js";

const userProfile = (req, res) => {
    const {id, name, email} = req.user;

    const response = new ApiResponse(true, 200, 'user profile fetched', {id, name, email});

    res.status(response.statusCode).json(response);
}

export default userProfile;