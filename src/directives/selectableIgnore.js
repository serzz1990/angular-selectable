'use strict';


export default Selectable => {

	return {

		link: (scope, element, attributes) => {

			element.on('mousedown', () => Selectable.freeze = 'one' );

		}
	};

}


module.exports.$inject = [
	'Selectable'
];