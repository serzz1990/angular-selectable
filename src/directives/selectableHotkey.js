'use strict';


export default Selectable => {


	return {

		link: (scope, element, attributes) => Selectable.defaultZone = element

	};


}


module.exports.$inject = [
	'Selectable'
];