chatApp.controller('UserListController',
    function UserListController($scope, $routeParams, Users) {
		$scope.allUsers = Users.query();
    }
);