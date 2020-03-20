const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
                    try {
                        const token = req.header('Authorization').split(' ')[1];
                        var decoded = jwt.verify(token, process.env.JWT_AUTH_KEY);
                        req.userData = decoded;
                        next();
                    }
                    catch(err) {
                        console.log(err);
                        res.status(401).json({
                            message : "Auth failed"
                        });
                    }
                };