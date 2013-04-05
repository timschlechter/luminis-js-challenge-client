chatApp.factory('MessageObserver', ['SocketIOMessageObserver',
	function MessageObserver (MessageObserverStrategy) {
		return new MessageObserverStrategy();
	}
]);