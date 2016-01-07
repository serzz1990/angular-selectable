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

				zone.on('update', function (event, selected, all){

					element[0].checked = (selected.length == all.length);

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