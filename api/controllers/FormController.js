/**
 * FormController
 *
 * @description :: Server-side logic for managing forms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Q = require('q');    

module.exports = {

    getOne: function(req, res, next) {
        Form.findOne({id: req.param('id')}).exec(function (err, form) {
            if (err) return next(err);
            if (!form) return next(new Error('Form not found'));
            
            // fill promise array with question requests
            var promises = [];
            var questions = [];
            _.map(form.form_questions, function(q_id) {
                promises.push(Question.findOne({id: q_id})
                    .then(function (question) { 
                        delete question.createdAt;
                        delete question.updatedAt;
                        return question; 
                    })
                    .fail(function (err) { return next(err); })
                );
            });

            // wait for question promises to resolve
            Q.allSettled(promises).then(function (results) {
                results.forEach(function (result) {
                    questions.push(result.value);
                });
            }).then(function() {
                delete form.createdAt;
                delete form.updatedAt;
                form.form_questions = questions;
                res.json(form);
            });    
        });
    },

    create: function(req, res, next) {
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
                res.json(form);
            }).fail(function (err) {
                res.send(400, err);
            });
        });           
    },

    update: function(req, res, nex) {
        var form = {
            form_type: req.param('form_type'),
            form_name: req.param('form_name'),
            form_title: req.param('form_title'),
            form_questions: req.param('form_questions')
        };

        // not implemented yet
        console.log(form);
        res.json(form);       
    }  
};

