module.exports = {
	index: function(req, res) {
		var navItems = [
			{url: '/about', cssClass: 'fa fa-infoc-circle', title: 'About'},
			{url: '/users', cssClass: 'fa fa-infoc-circle', title: 'Users'},
			{url: '/forms', cssClass: 'fa fa-infoc-circle', title: 'Forms'},
			{url: '/formbuilder', cssClass: 'fa fa-infoc-circle', title: 'Form Builder'},
		];
		if (req.session.authenticated) {
			navItems.push({url: '/logout', cssClass: 'fa fa-comments', title: 'Logout'});
		}
		else {			
			navItems.push({url: '/login', cssClass: 'fa fa-comments', title: 'Login'});
		}

		res.view({
			title: 'Home',
			navItems: navItems,
			currentUser: req.user
		});
	}
};