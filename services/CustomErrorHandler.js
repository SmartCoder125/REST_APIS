// JS CLASS FOR THE CUSTOM ERROR

class CustomErrorHandler extends Error {

    // CONSTRUCTOR

    constructor(status, msg) {

        super();

        this.status = status;
        this.message = msg;
    }

    // STATIC METHOD WITHOUT OBJECT FOR REGISTER

    static alreadyExist(message) {
        return new CustomErrorHandler(409, message);
    }


    // FOR LOGIN

    static wrongCredentials(message = 'UserName Or Password is wrong!') {
        return new CustomErrorHandler(401, message);
    }


    // FOR THE UNAUTHORISED  ERROR

    static unAuthorized(message = 'unAuthorized') {
        return new CustomErrorHandler(401, message);
    }


    // NOT FOUND


    static notFound(message = '404 Not Found') {
        return new CustomErrorHandler(404, message);
    }


    //  SERVER ERROR

    static serverError(message = 'Internal Server Error') {
        return new CustomErrorHandler(500, message);
    }



}


// TO EXPORT THIS CLASS

export default CustomErrorHandler;