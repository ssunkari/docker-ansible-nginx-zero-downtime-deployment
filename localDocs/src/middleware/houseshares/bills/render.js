module.exports =
    function (req, res) {
        res.render('houseshares', {
            title: 'Divider-Add Housemate',
            uid: req.uid,
            user: req.user
        });
    }