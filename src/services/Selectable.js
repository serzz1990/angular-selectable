'use strict';


export default $document => {


	class Selectable {


		constructor() {

			this.listen();

		}


		listen() {

			$document.on('keydown', _private.events.keyDown);

			return this;

		}


		/**
		 * Устанавливает слушателя обновлений
		 *
		 * @param {String} key - namespace
		 * @param {Function} fn - callback
		 */
		addListener(key, fn) {

			if (typeof fn === 'function') _private.calbacks[key] = fn;

		}


		/**
		 * Обновляет выбранные объекты
		 *
		 * @param {Array} selected - массив выбранных объектов
		 */
		update(selected) {

			_private.methods.update(selected);

			return this;

		}


		/**
		 * Сбрасывает положение
		 *
		 * @return {Object}
		 */
		rectReset() {

			_private.methods.getRect().css({top: '-2px', left: '-2px', width: 0, height: 0});

			return this;

		}


		/**
		 * Обновляет состояния у элементов
		 *
		 * @param elements
		 * @param state
		 * @param update
		 * @returns {Selectable}
		 */
		changeState(elements, state, update) {

			_private.methods.changeState(elements, state, update);

			return this;

		}


		/**
		 * Проверяет объекты на выделение
		 *
		 * @returns {Selectable}
		 */
		checkObjects() {

			_private.methods.checkObjects();

			return this;

		}


		/**
		 * Выбирает выделение объекты
		 *
		 * @returns {Selectable}
		 */
		selectSelecting() {


			let selected = _private.cache.filter((child, scope) => {

				scope = child.scope();

				if (scope.isSelecting) {

					scope.isSelecting = false;
					scope.isSelected = (event.ctrlKey || event.metaKey) ? !scope.isSelected : true;
					scope.$apply();

				}

				return scope.isSelected;

			});

			_private.methods.update(selected);

			return this;

		}


		/**
		 * Устанавливает состояние selectable
		 */
		set freeze(state) {

			_private.data.freeze = state;

		}


		/**
		 * Устанавливает конечные координаты хелпера
		 */
		set rectEndPoint(c) {

			_private.data.rect.end = {x: c.x, y: c.y};

			_private.methods.rectUpdate();

			_private.methods.checkObjects();

		}


		/**
		 * Устанавливает начальные координаты хелпера
		 */
		set rectStartPoint(c) {

			_private.data.rect.start = {x: c.x, y: c.y};

		}


		/**
		 * Устанавливает по умолчанию зону выделения
		 * для работы с hot keys
		 * @param zone
		 */
		set defaultZone(zone) {

			_private.data.defaultZone = zone;

		}


		/**
		 * Кэширует элементы в зоне
		 * @param zone
		 */
		set zone(zone) {

			_private.cache = _private.methods.getSelectableElements(zone);

		}


		/**
		 * Получает состояние selectable
		 */
		get freeze() {

			return _private.data.freeze;

		}


		/**
		 * Получает массив выбранных объектов
		 */
		get selected() {

			return _private.cache.filter(child => child.scope().isSelected);

		}


	}





	var _private = {


		// Объект для хнанения функций callback при выделении элементов;
		calbacks: {},

		// Кэш элементов в хоне выделения
		cache: [],

		// Данные
		data: {

			// Замороженние состояние
			freeze : false,

			// Зона по умолчанию, для hot keys
			defaultZone: null,

			// Последний выбранный элемент, для hot key Shift
			// TODO сделать обработку кнопки shift;
			lastSelect: null,

			// Объект выделения
			rect: {
				element: null,
				start: {},
				end: {}
			}

		},


		// Модиффикаторы
		modifiers: {
			rect: 'ng-selectable__helper'
		},


		// Коды горячих кнопок
		keyCode: {
			A: 65,
			ESC: 27
		},


		/**
		 *  Приватные методы
		 */
		methods: {


			/*
			 * Создает элемент выделения
			 */
			rectCreate: () => {

				let element = angular.element('<div/>').addClass(_private.modifiers.rect);

				$document.find('body').eq(0).append(element);

				return element;

			},


			/*
			 * Получает элемент выделения
			 */
			getRect: () => _private.data.rect.elenemt || (_private.data.rect.elenemt = _private.methods.rectCreate()),


			/*
			 * Получает координаты элемент выделения
			 */
			getRectCoord: () => {

				let {end, start} = _private.data.rect,
					temp = {
						end: {x: end.x, y: end.y},
						start: {x: start.x, y: start.y}
					};

				if (start.x > end.x) {
					[temp.end.x, temp.start.x] = [start.x, end.x];
				}

				if (start.y > end.y) {
					[temp.end.y, temp.start.y] = [start.y, end.y];
				}

				return temp;

			},


			/*
			 * Обновляет положение хелпера
			 */
			rectUpdate: () => {

				let {start, end} = _private.methods.getRectCoord();

				_private.methods.getRect().css({
					"top": start.y + "px",
					"left": start.x + "px",
					"width": (end.x - start.x) + "px",
					"height": (end.y - start.y) + "px"
				});

			},


			/*
			 * Получает положение объекта
			 *
			 * @param element
			 * @returns {{top: number, left: number}}
			 */
			offset: element => {

				let doc = element && element.ownerDocument,
					documentElem = doc.documentElement,
					box = (element.getBoundingClientRect) ? element.getBoundingClientRect() : {top: 0, left: 0};


				return ({
					top: box.top + (window.pageYOffset || documentElem.scrollTop) - (documentElem.clientTop || 0),
					left: box.left + (window.pageXOffset || documentElem.scrollLeft) - (documentElem.clientLeft || 0)
				});

			},


			/*
			 * Обновляет состояние элементов
			 */
			changeState: (elements = [], state = false, update = false) => {

				elements = (elements === 'all') ? _private.cache : elements;


				elements.forEach((child, scope) => {

					scope = child.scope();

					if (scope.isSelected != state) {
						scope.isSelecting = false;
						scope.isSelected = state;
						scope.$apply();
					}

				});


				if (update) {

					_private.methods.update(state ? _private.cache : []);

				}


			},


			/*
			 * Вызывает все подписанные callbacks на обновления
			 */
			update: selected => {

				for (let k in _private.calbacks) _private.calbacks[k](selected);

			},


			/*
			 * Проверяет попадание объекта в область выделения
			 *
			 * @param {Object} object
			 * @returns {Boolean}
			 */
			checkHit: object => {

				let hel = _private.methods.getRectCoord(),
					objectOffset = _private.methods.offset(object[0]),
					obj = {
						start: {
							x: objectOffset.left,
							y: objectOffset.top
						},
						end: {
							x: objectOffset.left + object.prop('offsetWidth'),
							y: objectOffset.top + object.prop('offsetHeight')
						}
					};

				return ( hel.start.x <= obj.start.x && obj.start.x <= hel.end.x || obj.start.x <= hel.start.x && hel.start.x <= obj.end.x) &&
					(hel.start.y <= obj.start.y && obj.start.y <= hel.end.y || obj.start.y <= hel.start.y && hel.start.y <= obj.end.y);

			},


			getSelectableElements: element => {

				var out = [];

				Array.prototype.slice.call(element.children())
					.filter((child, scope) => {

						child = angular.element(child);
						scope = child.scope();

						if (scope.isSelectable) {
							scope.unSelect = false;
							out.push(child);
						} else {
							//TODO переписать
							if (scope.$id != element.scope().$id && scope.isSelectableZone === true) {
							}
							else out = out.concat(_private.methods.getSelectableElements(child));
						}

					});

				return out;

			},


			checkObjects: () => {

				_private.cache
					.forEach((child, scope) => {

						let hit = _private.methods.checkHit(child);
						scope = child.scope();


						if (hit && scope.isSelected) {

							scope.isSelected = false;
							scope.isSelecting = false;
							scope.unSelect = true;
							scope.$apply();

						} else if (hit && !scope.unSelect) {

							if (!scope.isSelecting) {
								scope.isSelecting = true;
								scope.$apply();
							}

						} else if (!hit && scope.unSelect) {

							scope.unSelect = false;
							scope.isSelected = true;
							scope.$apply();

						}
						else if (scope.isSelecting) {

							scope.isSelecting = false;
							scope.$apply();

						}

					});

			}


		},


		/**
		 * Обработка событий
		 */
		events: {


			keyDown: event => {

				// Если не существует зона по умолчанию или фокус на элементе формы, то отменяем;
				if (!_private.data.defaultZone || event.target.formTarget != undefined) return;

				_private.cache = _private.methods.getSelectableElements(_private.data.defaultZone);

				if (!_private.cache.length) return;


				if (event.keyCode === _private.keyCode.ESC) {

					_private.methods.changeState('all', false, true);

					return event.preventDefault();
				}


				if (event.keyCode === _private.keyCode.A && (event.ctrlKey || event.metaKey)) {

					_private.methods.changeState('all', true, true);

					return event.preventDefault();

				}

			}


		}

	};



	return new Selectable;


};


module.exports.$inject = [
	'$document'
];