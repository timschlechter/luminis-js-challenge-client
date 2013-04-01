chatApp.factory('ChatService', ['$http', '$q',
	function ($http, $q) {
		return {
			rootUrl : '',
			authenticatedUser : null,

			login : function(username) {
				var chatService = this,
					defer = $q.defer();

				this.getUsers()
					.success(function(users) {
						// try find existing user
						chatService.authenticatedUser = _.filter(users, function(user) { return user.name === username; })[0] || null;

						// existing found, resolve promise
						if (chatService.authenticatedUser) {
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

			logout : function() {
				this.authenticatedUser = null;
			},

			createUser : function(username) {
				var data = { name: username };

				return $http.post(this.rootUrl,  angular.toJson(data))
							.success(function() {
								this.authenticatedUser = { name : username };
							})
							.error(this.handleHttpError);
			},

			getUsers : function() {
				return $http.get(this.rootUrl)
							.error(this.handleHttpError);
			},

			getMessages : function(username) {
				return $http.get(this.rootUrl + username)
							.success(function(messages) {
								// HACK: force each timestamp to be of type Date
								_.each(messages, function(message) {
									message.timestamp = new Date(message.timestamp);
								});
							})
							.error(this.handleHttpError);
			},

			sendMessage : function(user, text) {
				var data = {
					"sender": this.authenticatedUser.name,
					"content": text
				};

				return $http.post(this.rootUrl + user.name,  angular.toJson(data))
							.error(this.handleHttpError);
			},

			handleHttpError : function(data, status, headers, config) {
				console.log(config);
			}
		};
	}
]);