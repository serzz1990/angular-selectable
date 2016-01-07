'use strict';


export default (Selectable, $timeout) => {

	return {

		scope: true,
		restrict: 'A',
		link: (scope, element, attributes) => {

			scope.isSelectable = true;
			scope.isSelecting  = false;
			scope.isSelected   = false;

			element.on('mousedown', event => {

				Selectable.zone = Selectable.findZone(element);


				if( event.target.formTarget != undefined ) {

					return $timeout(()=> Selectable.selectSelecting(), 50);

				}


				if (!event.ctrlKey && !event.metaKey) Selectable.changeState('all', false, false);


				element.scope().isSelected = !element.scope().isSelected;
				element.scope().$apply();

				Selectable.update( Selectable.selected );

				event.stopPropagation();


			});

		}
	};


}


module.exports.$inject = [
	'Selectable',
	'$timeout'
];