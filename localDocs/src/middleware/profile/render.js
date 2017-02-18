module.exports = function (docStore) {
    return function (req, res, next) {
            var username = req.body.profile_name.trim();
            var username = req.body.profile_email.trim();
            var username = req.body.profile_phone.trim();
            var username = req.body.profile_fax.trim();
            var username = req.body.profile_address.trim();
            var username = req.body.profile_website.trim();

            docStore.getDocAsync(req.ctx.uid).then(function(document)
              {
                console.log('hello');
                console.dir(document);
              }).then(function () {
                next();
            }).catch(function (err) {
                next(err);
            });

    };
}
