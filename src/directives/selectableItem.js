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

				//Если это элемент формы
				if( event.target.formTarget != undefined ) {

					return;

				}

				if (!event.ctrlKey && !event.metaKey) Selectable.changeState('all', false, false);


				element.scope().isSelected = !element.scope().isSelected;
				element.scope().$apply();

				Selectable.update( Selectable.selected );

				event.stopPropagation();

			});


			element.on('mouseup', event => {

				if( event.target.formTarget != undefined ) {

					$timeout(()=> Selectable.selectSelecting(), 50);

				}

			});

		}
	};


}


module.exports.$inject = [
	'Selectable',
	'$timeout'
];