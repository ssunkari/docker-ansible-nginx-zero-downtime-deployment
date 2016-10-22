module.exports = function (propertyName) {
    return function (req, res, next) {
        req.uid = req.params[propertyName] || req.body[propertyName] || req.query[propertyName];
        next();
    };
}