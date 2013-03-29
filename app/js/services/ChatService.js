chatApp.factory('ChatService', function($http) {
	return {
		getUsers : function() {
			return $http.get(chatApp.chatServiceUrl);
		}
	};
});