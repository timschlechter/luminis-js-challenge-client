chatApp.factory('ChatService', ['$http', '$q',
	function ($http, $q) {

		var chatService = {
			rootUrl : '',
			authenticatedUser : null,

			ensureUserExists : function (username) {
				var chatService = this,
					defer = $q.defer();

				this.getUsers()
					.success(function (users) {
						// try find existing user
						var user = _.filter(users, function (user) { return user.name === username; })[0] || null;

						// existing found, resolve promise
						if (user) {
							defer.resolve();
						} else {
							chatService.createUser(username)
								.success(function () {
									// new user created, resolve promise
									defer.resolve();
								});
						}
					});

				return defer.promise;
			},

			login : function (username) {
				var chatService = this;

				return this.ensureUserExists(username)
							.then(function() {
								chatService.getUsers()
									.success(function (users) {
										// try find existing user
										chatService.authenticatedUser = _.filter(users, function (user) { return user.name === username; })[0] || null;
									});
							});
			},

			logout : function () {
				this.authenticatedUser = null;
			},

			createUser : function (username) {
				var data = { name: username };

				return $http.post(this.rootUrl,  angular.toJson(data))
							.success(function () {
								this.authenticatedUser = { name : username };
							})
							.error(this.handleHttpError);
			},

			getUsers : function () {
				return $http.get(this.rootUrl)
							.error(this.handleHttpError);
			},

			getMessages : function (username) {
				return $http.get(this.rootUrl + username)
							.success(function (messages) {
								// HACK: force each timestamp to be of type Date
								_.each(messages, function (message) {
									message.timestamp = new Date(message.timestamp);
								});
							})
							.error(this.handleHttpError);
			},
			sendMessage : function (sender, recipient, text) {
				var data = {
					"sender": sender,
					"content": text
				};

				return $http.post(this.rootUrl + recipient, angular.toJson(data))
							.error(this.handleHttpError);
			},

			handleHttpError : function (data, status, headers, config) {
				console.log(config);
			}
		};

		return chatService;
	}
]);