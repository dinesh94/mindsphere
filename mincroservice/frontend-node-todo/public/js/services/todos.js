angular.module('todoService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Todos', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/rest/todos');
			},
			create : function(todoData) {
				return $http.post('/rest/todos', todoData);
			},
			delete : function(id) {
				return $http.delete('/rest/todos/' + id);
			}
		}
	}]);