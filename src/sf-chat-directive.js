import sfChatController from './sf-chat-ctrl.js';
import sfChatTemplate from './sf-chat.html';

export default /*@ngInject*/ function($http, $timeout) {

	return {
		scope: {
			active: '=',
			placeholder: '@',
			showAvatar: '@',
			position: '@'
		},
		link: function(scope, element, attr, ctrl){

			//listen to service broadcast for chat update
			scope.$on('chat:update', function(event, data){
			if (data.attachment){
				$http({
					method: 'GET',
					url: 'https://api.microlink.io?url=' + data.attachment.link
				})
				.then(res => {
					ctrl.uploadInProgress = false;
					data.attachment_embed = res.data.data;
				});
			}
			scope.$apply();

			//play pop sound for incoming messages
			if (data.senderId !== ctrl.init.user_id){
				ctrl.alertSound.play();
			}
			});

			//listen to service broadcast for chat ready
			scope.$on('chat:ready', function(event, data){
				ctrl.roomTitle = data.name;
				ctrl.chatReady = true;
				$timeout(function() {
					if (!scope.$ctrl.active){return false;}
					element[0].querySelector('.sf-chat__container').scrollTop = element[0].querySelector('.sf-chat__container').scrollHeight;
				}, 800);
			});


			scope.$on('chat:users', function(event, data){
				$timeout(function() {
					ctrl.users = data;
					//console.log(data);
				}, 0);
			});
			
			//scroll down container with each message item
			scope.$watchCollection('$ctrl.messages', function(newVal) {
				if (newVal) {
					$timeout(function() {
						if (!scope.$ctrl.active){return false;}
						element[0].querySelector('.sf-chat__container').scrollTop = element[0].querySelector('.sf-chat__container').scrollHeight;
					}, 0);
				}
			});

			//scroll down when widget is reactivated
			scope.$watchCollection('$ctrl.widgetActive', function(newVal) {
			if (newVal) {
				$timeout(function() {
					element[0].querySelector('.sf-chat__container').scrollTop = element[0].querySelector('.sf-chat__container').scrollHeight;
				}, 0);
			}
			});
			

		},
		controller: sfChatController,
		controllerAs: '$ctrl',
		bindToController: true,
		templateUrl: sfChatTemplate,
		restrict: 'E',
	};
}
