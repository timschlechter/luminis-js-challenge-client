chatApp.factory('WolframAlpha', ['ChatService', 'MessageObserver', '$http',
	/**
	 * @class  WolframAlpha
	 * @param  {ChatService} ChatService
	 * @param  {MessageObserver} MessageObserver
	 * @param  {$http} $http
	 */
	function WolframAlpha(ChatService, MessageObserver, $http) {

		function getAnswer(data) {
			if (!(data && data[1] && data[1][5] && data[1][5][1]))
				return "I don't understand";

			return data[1][5][3][3][1];
		}

		return {
			name : 'Wolfram Alpha',

			started : false,

			userListeningTo : null,

			start : function () {

				if (this.started)
					return;

				this.userListeningTo = ChatService.authenticatedUser.name;

				var wolframalpha = this,
					timestamp = new Date();

				ChatService.ensureUserExists(this.name);

				// Subscribe to auto respond
				MessageObserver.subscribe(this, this.userListeningTo, this.name, function(message) {

					// Only response to messages received from current authenticated user
					if (message.sender !== wolframalpha.userListeningTo)
						return;

					// Only responsd when message created after starting
					if (new Date(message.timestamp) <= timestamp)
						return;

					$http.get(ChatService.rootUrl + 'api/wolframalpha/6PXV9H-LE2LUEW989/' + message.content)
						.success(function(data) {
							ChatService.sendMessage(wolframalpha.name, message.sender, getAnswer(data));
						})
						.error(function() {
							ChatService.sendMessage(wolframalpha.name, wolframalpha.userListeningTo, "Sorry, I'm busy talking to people on http://MACBOOK-TIM.local:8080/");
						});
				});

				this.started = true;
			},

			stop : function () {
				if (!this.started)
					return;

				MessageObserver.unsubscribe(this, this.userListeningTo, this.name);
				this.started = false;
			}
		};
	}
]);