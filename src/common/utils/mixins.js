(function() {
	'use strict';

	_.mixin({
		'parseUrl': parseUrl,
		'pathnameToArray': pathnameToArray,
		'convertRestUrl': convertRestUrl,
		'inArray': inArray,
		'sum': sum,
		'capitalizeFirst': capitalizeFirst,
		'objToPair': objToPair
	});

	function parseUrl(location, url) {
    var baseLen = location.absUrl().length - location.url().length;
    return pathnameToArray(url.substring(baseLen));
	}

	function pathnameToArray(pathname) {
		return pathname.split('/').slice(1);
	}

	function convertRestUrl(restURL, prefix) {
		var index = restURL.indexOf(prefix) + prefix.length;
    return restURL.substring(index);
	}

	function inArray(arr, item) {
		return (_.indexOf(arr, item) !== -1);
	}

	function sum(arr) {
		return _.reduce(arr, function(sum, num) { return sum + num; }, 0);
	}

	function capitalizeFirst(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	function objToPair(obj) {
    return _.map(_.keys(obj), function (k) {
      return { 
        name: k,
        value: obj[k]
      };
    });
	}

})();