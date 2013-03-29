chatApp.factory('Users', function($resource) {
	return $resource(chatApp.chatServiceUrl);
});