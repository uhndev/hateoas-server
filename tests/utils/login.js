var superagent = require('superagent'),
    agent = superagent.agent();

exports.login = function(credentials, request, done) {
    request
        .post('/auth/local')
        .send(credentials)
        .end(function (err, res) {
            if (err) throw err;
            agent.saveCookies(res);
            done(agent);
        });
};