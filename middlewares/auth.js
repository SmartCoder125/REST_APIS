import CustomErrorHandler from "../services/CustomErrorHandler";

import JwtService from "../services/JwtService";

const auth = async (req, res,next) => {

    let authHeader = req.headers.authorization;

    // console.log(authHeader);

    if(!authHeader) {
        return next(CustomErrorHandler.unAuthorized())

    }

    const token = authHeader.split(' ')[1];

    // console.log(token)

    try {

        const {_id, role } = await JwtService.verify(token);

        const user = {

            _id,
            role

        }

        req.user = user; // A BIG BIG MISTAKE MADE BY ME !

        next(); // LAST NEXT MIDLLE CALL AFTER METHOD  CALL

        // req.user._id = _id;

        // req.user.role = role

    } catch(err) {

        return next(CustomErrorHandler.unAuthorized())
    }

}

export default auth;