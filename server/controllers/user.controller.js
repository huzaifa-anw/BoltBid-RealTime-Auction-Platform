import ApiError from "../utils/ApiError"

const userProfile = (req, res) => {
    res.status(200).json(req.user);
}