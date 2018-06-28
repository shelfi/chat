import sfChatMessageTemplate from './sf-chat-message.html';
export default /*@ngInject*/ function($window) {
	return {
		scope: {
			message: '=',
			avatar: '=',
			block: '='
		},
		link: function($scope, $element, $attrs){
			if ($scope.$ctrl.block){
				$element.addClass('block');
			}
			if ($scope.$parent.$ctrl.init.user_id === $scope.$ctrl.message.senderId){
				$element.addClass('active-user');
			}
		},
		controller: function(){
			this.goToUrl = function(url){
				$window.open(url, '_blank');
			};
		},
		controllerAs: '$ctrl',
		bindToController: true,
		require: '^?sfChat',
		templateUrl: sfChatMessageTemplate,
		restrict: 'E',
	};
}
