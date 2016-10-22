module.exports = function () {
    return function (req, res) {
        console.dir(req.user);
        res.render('addHousemate', {
            title: 'Divider-Add Housemate',
            uid: req.uid,
            user: req.user
        });
    };
}