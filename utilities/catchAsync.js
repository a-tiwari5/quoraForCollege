module.exports.catchAsync = (func) => {
    return function (req, res, next) {
        func(req, res, next).catch(next)
    }
}