chatApp.factory('SocketIOMessageObserver', ['PollingMessageObserver', 'ChatService',
	function (PollingMessageObserver, ChatService) {

		function SocketIOMessageObserver() {
			PollingMessageObserver.call(this);

			this.socket = null;
		}

		SocketIOMessageObserver.prototype = new PollingMessageObserver();
		SocketIOMessageObserver.prototype.constructor = SocketIOMessageObserver;

		SocketIOMessageObserver.prototype.start = function() {

			var observer = this;

			if (this.socket)
				return;

			this.socket = io.connect(ChatService.rootUrl);

			this.socket.on('message', function(data) {
				var subscriptions = _.filter(observer.subscriptions,
										function(subscription) {
											return subscription.recipient === data.recipient;
										});
				// callback
				_.each(subscriptions, function(subscription) {
					subscription.callback.call(subscription.subscriber, data.message);
				});
			});

			io.connect();
		};

		SocketIOMessageObserver.prototype.stop = function() {
			if (this.socket) {
				this.socket.disconnect();
				this.socket = null;
			}
		};

		return SocketIOMessageObserver;
	}
]);