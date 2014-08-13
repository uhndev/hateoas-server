/**
 * FormController
 *
 * @description :: Server-side logic for managing Forms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// load universal HATEOAS JSON response and user model definition
var Q = require('q');    

module.exports = {

    getOne: function(req, res, next) {
        Form.findOne({id: req.param('id')}).exec(function (err, form) {
            if (err) return next(err);
            if (!form) return next(new Error('Form not found'));
            
            // fill promise array with question requests
            var promises = [];
            var questions = [];
            _.map(form.questions, function(q_id) {
                promises.push(Question.findOne({id: q_id})
                    .then(function (question) { return question; })
                    .fail(function (err) { return next(err); })
                );
            });

            // wait for question promises to resolve
            Q.allSettled(promises).then(function (results) {
                results.forEach(function (result) {
                    questions.push(result.value);
                });
            }).then(function() {
                // render ejs view
                res.view('forms/form.ejs', {
                    form: form,
                    questions: questions
                });
            });    
        });
    },

    create: function(req, res, next) {
        var resp = api.init();
        var promises = [];
        var form_questions = req.param('form_questions');
        var question_ids = [];

        // fill promise array with question requests
        _.each(form_questions, function(question) {
            promises.push(Question.create(question)
                .then(function (created) { return created.id; })
                .fail(function (err) { res.send(400, err); })
            )
        })

        // wait for question promises to resolve
        Q.allSettled(promises).then(function (results) {
            results.forEach(function (result) {
                // console.log(result);
                question_ids.push(result.value);
            });
        }).then(function() {
            var form = {
                form_type: req.param('form_type'),
                form_name: req.param('form_name'),
                form_title: req.param('form_title'),
                form_questions: question_ids
            };

            Form.create(form)
            .then(function (created) {
                Form.publishCreate(created.toJSON());
                res.json(resp);
            }).fail(function (err) {
                // console.log(err);
                res.send(400, err);
            });
        });           
    }
};

