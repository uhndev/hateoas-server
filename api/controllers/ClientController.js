/**
 * ClientController
 *
 * @module  controllers/Client
 * @description Server-side logic for managing Clients
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function () {

    var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

    module.exports = {
        findOne: function (req, res) {
            Client.findOne(req.param('id'))
                .populate('person')
                //  .populate('contact')
                .exec(function (err, client) {
                    if (err) {
                        return res.serverError(err);
                    }

                    if (_.isUndefined(client)) {
                        res.notFound();
                    } else {

                        res.ok(client);

                    }
                });
        },

        find: function (req, res, next) {
            req.options.model = sails.models.clientcontact.identity;  //manually override model name for paganation in ok.jd
            console.log('client find');
            var query = clientcontact.find()
                .where(actionUtil.parseCriteria(req))
                .limit(actionUtil.parseLimit(req))
                .skip(actionUtil.parseSkip(req))
                .sort(actionUtil.parseSort(req));

            query.exec(function found(err, groups) {
                console.log(groups);
                if (err) {
                 //   console.log('ERRORRRRR');
                    return res.serverError({
                        title: 'Error',
                        code: err.status,
                        message: err.details
                    });
                }

                res.ok(groups);
            });
        }

    };
})();
