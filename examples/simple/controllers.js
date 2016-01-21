'use strict';


angular

	.module('app', ['angularSelectable'])

	.controller('AppController', ['$scope', 'Selectable', function($scope, Selectable) {

		Selectable.addListener('AppController', function(update){

			console.log(update.indexes);

		});

	}]);
