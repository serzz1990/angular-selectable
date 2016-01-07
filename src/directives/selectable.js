'use strict';


export default  ($document, Selectable) => {

	return {

		scope: true,
		restrict: 'A',
		link: (scope, element, attributes) => {

			scope.isSelectableZone = true;
			element.data('isSelectableZone', true);

		}
	};


}


module.exports.$inject = [
	'$document',
	'Selectable'
];