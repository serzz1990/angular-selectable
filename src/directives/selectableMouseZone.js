'use strict';


export default  ($document, Selectable) => {

	return {

		scope: true,
		restrict: 'A',
		link: (scope, element, attributes) => {


			/**
			 * Method on Mouse Move
			 * @param  {Event} event
			 */
			function mousemove(event) {

				event.preventDefault();

				Selectable.rectEndPoint = {x: event.pageX, y: event.pageY};

			}


			/**
			 * Event on Mouse up
			 * @param  {Event} event
			 */
			function mouseup(event) {

				event.preventDefault();

				Selectable
					.selectSelecting()
					.rectReset();


				// Remove listeners
				$document.off('mousemove', mousemove);
				$document.off('mouseup', mouseup);

			}


			element.on('mousedown', event => {

				if( Selectable.freeze == 'one' ) Selectable.freeze = false;
				else if( !Selectable.freeze && event.target.formTarget == undefined){

					event.preventDefault();

					Selectable.zone = element;

					if (!(event.ctrlKey || event.metaKey)) Selectable.changeState('all', false, false);

					// Update start coordinates
					Selectable.rectStartPoint = {x: event.pageX, y: event.pageY};

					// Set events
					$document.on('mousemove', mousemove);
					$document.on('mouseup', mouseup);

					document.activeElement && document.activeElement.blur();

				}


			});


		}
	};


}


module.exports.$inject = [
	'$document',
	'Selectable'
];