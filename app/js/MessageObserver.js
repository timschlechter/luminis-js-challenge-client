chatApp.factory('MessageObserver', ['SocketIOMessageObserver',
	function MessageObserver (Strategy) {
		return Strategy;
	}
]);