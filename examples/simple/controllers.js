'use strict';


angular

	.module('app', ['angularSelectable'])

	.controller('AppController', ['$scope', 'Selectable', function($scope, Selectable) {

		Selectable.addListener('AppController', function( objects ){

			console.log(objects);

		});


	}]);
