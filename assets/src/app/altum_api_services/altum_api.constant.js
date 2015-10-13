(function () {
    'use strict';
    angular
        .module('dados.program.constants', ['dados.constants'])
        .service('PROGRAM_API', Program);

    Program.$inject = ['API'];

    function Program(API) {
        return {url: API.url() + '/program/:id'};
    }
})();
