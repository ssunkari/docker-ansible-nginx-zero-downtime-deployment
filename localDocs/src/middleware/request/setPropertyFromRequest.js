module.exports = function (propertyName, queryParamName) {
    return function (req, res, next) {
        req.ctx = req.ctx || {};
        req.ctx[propertyName] = req.params[queryParamName] || req.body[queryParamName] || req.query[queryParamName];
        next();
    };
}