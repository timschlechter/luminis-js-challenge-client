chatApp.factory('ChatService', function($http, $q) {

	return {
		rootUrl : '',
		user : null,

		getUsers : function() {
			return $http.get(this.rootUrl)
						.error(this.handleHttpError);
		},

		getMessages : function(username) {
			return $http.get(this.rootUrl + username)
						.error(this.handleHttpError);
		},
		createUser : function(username) {
			return $http.post(this.rootUrl,  angular.toJson({name: username}))
						.success(function() {
							this.user = { name : username };
						})
						.error(this.handleHttpError);
		},
		login : function(username) {
			var chatService = this,
				defer = $q. defer();

			this.getUsers()
				.success(function(users) {
					// try find existing user
					chatService.user = _.filter(users, function(user) { return user.name === username; })[0];

					// existing found, resolve promise
					if (chatService.isAuthenticated()) {
						defer.resolve();
					} else {
						chatService.createUser(username)
							.success(function() {
								// new user created, resolve promise
								defer.resolve();
							});
					}
				});

			return defer.promise;
		},
		handleHttpError : function(data, status, headers, config) {
			console.log(config);
		},
		isAuthenticated : function() {
			return !!this.user;
		}
	};
});