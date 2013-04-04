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
				return '?';

			return data[1][5][3][3][1];// : '?';
		}

		return {
			name : 'Wolfram Alpha',

			start : function () {
				var wolframalpha = this,
					timestamp = new Date();

				ChatService.ensureUserExists(this.name);

				// Subscribe to auto respond
				MessageObserver.subscribe(this, undefined, this.name, function(message) {

					$http.get(ChatService.rootUrl + 'api/wolframalpha/6PXV9H-LE2LUEW989/' + message.content)
						.success(function(data) {

							// Only responsd when message created after starting
							if (new Date(message.timestamp) > timestamp) {
								var answer = getAnswer(data);

								ChatService.sendMessage(wolframalpha.name, message.sender, answer);
							}

						})
						.error(function() {
							ChatService.sendMessage(wolframalpha.name, message.sender, "Sorry, I can't talk to you right now...");
						});
				});
			},

			stop : function () {
				MessageObserver.unsubscribe(this, undefined, this.name);
			}
		};
	}
]);