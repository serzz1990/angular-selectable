'use strict';


export default (Selectable, $timeout) => {

	return {

		scope: true,
		restrict: 'A',
		link: (scope, element, attributes) => {

			var zone;

			$timeout(() => {

				zone = Selectable.findZone(element);

				if( !zone ) return;

				zone.on('update', function (event, data){

					element[0].checked = (data.selected.length == data.elements.length);

				});

			}, 100);



			element.on('change', event => {

				if( !zone ) return;

				Selectable.zone = zone;

				Selectable.changeState('all', event.target.checked, true);

			});



		}
	};


}


module.exports.$inject = [
	'Selectable',
	'$timeout'
];