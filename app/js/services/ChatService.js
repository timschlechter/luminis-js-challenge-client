chatApp.factory('ChatService', function($http) {

	var rootUrl = chatApp.chatServiceUrl;

	return {
		getUsers : function() {
			return $http.get(rootUrl);
		},

		getMessages : function(username) {
			return $http.get(rootUrl + username);
		}
	};
});