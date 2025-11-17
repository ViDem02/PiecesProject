let jwt = require('jsonwebtoken');

const checkTokenFunction = (req, res, next, hasToBeAdmin) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                return res.json({
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                if (hasToBeAdmin){
                    if (!req.decoded.admin) {
                        return res.status(403).json({
                            error: 'resource reserved for admin'
                        })
                    }else{
                        next();
                    }
                }else{
                    next();
                }
            }
        });
    } else {
        return res.json({
            message: 'Auth token is not supplied'
        });
    }
}


let checkToken = (req, res, next) => {
    checkTokenFunction(req, res, next, false)
}

let checkAdmin = (req, res, next) => {
    checkTokenFunction(req, res, next, true)
}

module.exports = {
    checkToken,
    checkAdmin
}
