module.exports = {
  create: function(req, res, data) {
    var path = req.url;

    /**
     * Private method creates a HATEOAS Response
     * Once the promise has been resolved, the HATEOAS response is
     * constructed from the links object.
     */
    function makeResponse(links) {
      var HATEOAS_VERSION = '0.1';
      var url = req.protocol + '://' + req.get('host') + req.originalUrl; 

      var response = {
        version: HATEOAS_VERSION,
        rel: 'self',
        href: url,
        items: data
      };

      return _.merge(response, links.noMeta());
    }

    return WorkflowState.findOne({ path: path })
                        .then(makeResponse);
  }
};
