chatApp.factory('ChatService', ['$http', '$q',
	function ($http, $q) {
		return {
			rootUrl : '',
			user : {},

			isAuthenticated : function() {
				return !!this.user.name;
			},

			login : function(username) {
				var chatService = this,
					defer = $q.defer();

				this.getUsers()
					.success(function(users) {
						// try find existing user
						chatService.user = _.filter(users, function(user) { return user.name === username; })[0] || {};

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

			logout : function() {
				this.user = {};
			},

			createUser : function(username) {
				var data = { name: username };

				return $http.post(this.rootUrl,  angular.toJson(data))
							.success(function() {
								this.user = { name : username };
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
					"sender": this.user.name,
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