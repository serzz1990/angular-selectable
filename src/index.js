'use strict';

import Selectable from './services/Selectable';

import directiveSelectable from './directives/selectable';
import directiveSelectableMouseZone from './directives/selectableMouseZone';
import directiveSelectableItem from './directives/selectableItem';
import directiveSelectableIgnore from './directives/selectableIgnore';
import directiveSelectableHotkey from './directives/selectableHotkey';
import directiveSelectableSelectAll from './directives/selectableSelectAll';


angular
    .module('angularSelectable', [])
    .service('Selectable', Selectable)
    .directive('selectable', directiveSelectable)
    .directive('selectableMouseZone', directiveSelectableMouseZone)
    .directive('selectableItem', directiveSelectableItem)
    .directive('selectableIgnore', directiveSelectableIgnore)
    .directive('selectableHotkey', directiveSelectableHotkey)
    .directive('selectableSelectAll', directiveSelectableSelectAll);
