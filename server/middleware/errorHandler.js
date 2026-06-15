function errorHandler(error, req, res, next) {
    let status = error.status || 500;
    let message = error.message || 'Internal Server Error';

    // console.log(error);

    switch (error.name) {
        case 'SequelizeValidationError':
        case 'SequelizeUniqueConstraintError':
            status = 400;
            message = error.errors[0].message;
            break;
        case 'BadRequest':
        case 'Unauthorized':
        case 'CredentialsRequired':
            status = 400;
            message = error.message;
            break;
        case 'Unauthenticated':
            status = 401;
            message = 'Unauthenticated';
            break;
        case 'Forbidden':
            status = 403;
            message = 'Forbidden Action';
            break;
        case 'NotFound':
            status = 404;
            message = error.message;
            break;
    }

    res.status(status).json({ message });
}

module.exports = errorHandler;