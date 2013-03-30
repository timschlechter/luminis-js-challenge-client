chatApp.factory('ChatService', function($http) {

	var rootUrl = '';

	return {
		setRootUrl : function(url) {
			rootUrl = url;
		},

		getUsers : function() {
			return $http.get(rootUrl);
		},

		getMessages : function(username) {
			return $http.get(rootUrl + username);
		}
	};
});