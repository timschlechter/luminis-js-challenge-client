chatApp.factory('MessageObserver', ['PollingMessageObserver',
	function MessageObserver (MessageObserverStrategy) {
		return new MessageObserverStrategy();
	}
]);