let jwt = require('jsonwebtoken');

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (!token){
        return res.status(403).json({
            message: 'Auth token is not supplied'
        });
    }

    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (token === process.env.INTERNAL_SECRET_TOKEN){
        req.decoded = {
            email: 'internal@service.serv',
            userId: 'internal',
            iat: 0,
            exp: 0
        }
        return next()
    }

    if (token) {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).json({
            message: 'Auth token is not supplied'
        });
    }
};

module.exports = {
    checkToken: checkToken
}
