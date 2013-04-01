chatApp.factory('WolframAlpha', ['ChatService', 'MessagesObserver', '$http',
	/**
	 * @class  WolframAlpha
	 * @param  {ChatService} ChatService
	 * @param  {MessagesObserver} MessagesObserver
	 * @param  {$http} $http
	 */
	function WolframAlpha(ChatService, MessagesObserver, $http) {

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
				MessagesObserver.subscribe(this, undefined, this.name, function(message) {

					$http.get(ChatService.rootUrl + 'api/wolframalpha/***/' + message.content)
						.success(function(data) {

							// Only responsd when message created after starting
							if (message.timestamp > timestamp) {
								var answer = getAnswer(data);

								ChatService.sendMessage(wolframalpha.name, message.sender, answer);
							}

						});
				});
			},

			stop : function () {
				MessagesObserver.unsubscribe(this, undefined, this.name);
			}
		};
	}
]);