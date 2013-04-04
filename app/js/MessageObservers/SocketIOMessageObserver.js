chatApp.factory('SocketIOMessageObserver', ['PollingMessageObserver', 'ChatService',
	function SocketIOMessageObserver (PollingMessageObserver, ChatService) {

		var observer = {
			subscriptions : [],
			start: PollingMessageObserver.start,
			stop : PollingMessageObserver.stop,
			subscribe : PollingMessageObserver.subscribe,
			unsubscribe : PollingMessageObserver.unsubscribe
		};

		var socket = null;

		observer.start = function() {
			if (socket) return;

			socket = io.connect(ChatService.rootUrl);

			socket.on('message', function(data) {
				var subscriptions = _.filter(observer.subscriptions,
										function(subscription) {
											return subscription.recipient === data.recipient;
										});
				// callback
				_.each(subscriptions, function(subscription) {
					subscription.callback(data.message);
				});
			});
		};

		observer.stop = function() {
			if (socket) {
				socket.disconnect();
				socket = null;
			}
		};

		observer.subscribe = function (subscriber, sender, recipient, callback) {
			PollingMessageObserver.subscribe.call(this, subscriber, sender, recipient, callback);
		};

		observer.unsubscribe = function (subscriber, sender, recipient, callback) {
			PollingMessageObserver.subscribe.call(this, subscriber, sender, recipient);
		};

		return observer;
	}
]);