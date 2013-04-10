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
							defer.resolve(user);
						} else {
							chatService.createUser(username)
								.success(function (user) {
									// new user created, resolve promise
									defer.resolve(user);
								});
						}
					});

				return defer.promise;
			},

			login : function (username) {
				var chatService = this;

				return this.ensureUserExists(username)
							.then(function(user) {
								chatService.authenticatedUser = user;
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
							.error(this.handleHttpError);
			},
			sendMessage : function (sender, recipient, text) {
				var data = {
					"sender": sender,
					"content": text
				};

				console.log('Send message to ' + recipient + ': ' + data);

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