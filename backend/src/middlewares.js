const db = require('./client');

function notFound(req, res, next) {
    res.status(404);
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    next(error);
}

async function userAuth(req, res, next) {
    if (!(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')) return res.status(401).json({ message: 'No Token Detected' });
    const tokenID = req.headers.authorization.split(' ')[1];

    try {
        const token = await db.token.findUnique({
            where: {
                token: tokenID

            },
            include: {
                user: true
            }
        })

        if (!token) {
            res.status(403)
            const error = new Error("Invalid Token");
            return next(error)
        }
        const user = token.user;
        req.user = user;
        req.token = tokenID;
        next();
    } catch (err) {
        next(err)
    }
}


async function adminAuth(req, res, next) {
    if (!(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')) return res.status(401).json({ message: 'No Token Detected' });
    const tokenID = req.headers.authorization.split(' ')[1];

    try {
        const token = await db.token.findUnique({
            where: {
                token: tokenID

            },
            include: {
                user: true
            }
        })

        if (!token) {
            res.status(403)
            const error = new Error("Invalid Token");
            return next(error)
        }
        const user = token.user;
        req.user = user;
        req.token = tokenID;
        if(user.role !== "ADMIN"){
            res.status(403)
            const error = new Error("Unauthorized access");
            return next(error)
        }

        next();
    } catch (err) {
        next(err)
    }
}

async function guideAuth(req, res, next) {
    if (!(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')) return res.status(401).json({ message: 'No Token Detected' });
    const tokenID = req.headers.authorization.split(' ')[1];

    try {
        const token = await db.token.findUnique({
            where: {
                token: tokenID

            },
            include: {
                user: true
            }
        })

        if (!token) {
            res.status(403)
            const error = new Error("Invalid Token");
            return next(error)
        }
        const user = token.user;
        req.user = user;
        req.token = tokenID;
        if(user.role !== "GUIDE"){
            res.status(403)
            const error = new Error("Unauthorized access");
            return next(error)
        }

        next();
    } catch (err) {
        next(err)
    }
}


/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
    /* eslint-enable no-unused-vars */
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
}


module.exports = {
    notFound,
    errorHandler,
    userAuth,
    adminAuth, 
    guideAuth
};