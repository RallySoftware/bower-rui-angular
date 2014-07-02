angular.module('rui.templates').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('rui/alm/projectPicker/templates/projectPicker.html',
    "<div rui-alm-project-picker-ctrl=rui-alm-project-picker-ctrl class=rui-alm-project-picker><div ng-class=\"{ dropdown: $ruiAlmProjectPicker.useDropdown, open: $ruiAlmProjectPicker.dropdownIsOpen }\" rui-focus-me=$ruiAlmProjectPicker.dropdownIsOpen tabindex=0 class=rui-alm-project-picker-dropdown><span ng-if=$ruiAlmProjectPicker.isLoading class=\"is-loading icon-spin icon-progress\"></span><a ng-click=$ruiAlmProjectPicker.toggleDropdown($event) ng-show=$ruiAlmProjectPicker.useDropdown class=rui-alm-project-picker-dropdown-toggle><span ng-bind=$ruiAlmProjectPicker.triggerText></span><span class=\"trigger-icon icon-chevron-down\"></span></a><div ng-class=\"{ 'dropdown-menu': $ruiAlmProjectPicker.useDropdown }\" class=rui-alm-project-picker-dropdown-menu><div class=rui-alm-project-picker-search><input placeholder=Search ng-model=$ruiAlmProjectPicker.searchTerm ui-keypress=\"{'escape': $ruiAlmProjectPicker.clearSearch()}\" ui-event=\"{ blur : '$ruiAlmProjectPicker.onBlur($event)' }\"><span class=search-indicators><span ng-if=$ruiAlmProjectPicker.searchInProgress class=\"search-in-progress icon-progress icon-spin\"></span><a ng-if=$ruiAlmProjectPicker.isSearching ng-click=$ruiAlmProjectPicker.clearSearch() class=\"clear-search icon-cancel\"></a></span></div><div class=tree-container><ul rui-tree=\"$ruiAlmProjectPicker.workspaces track by oid\" rui-tree-expandable=\"\" rui-tree-search=\"$ruiAlmProjectPicker.searchTerm search by name\" rui-tree-selectable=\"\" rui-tree-selected-node=$ruiAlmProjectPicker.selectedNode rui-alm-project-picker-tree=\"\" class=rui-tree></ul></div></div></div></div>"
  );


  $templateCache.put('rui/cardboard/template/rui-card.html',
    "<div class=rui-cardboard-card><div class=card-color ng-style=\"{backgroundColor: $card.color}\"></div><div class=card-content ng-transclude=\"\"></div></div>"
  );


  $templateCache.put('rui/cardboard/template/rui-cardboard.html',
    "<div class=rui-cardboard ng-transclude=\"\"></div>"
  );


  $templateCache.put('rui/cardboard/template/rui-column-scrollbars.html',
    "<i class=\"picto icon-small-chevron-left scroll left\" ng-show=model.canScrollLeft ng-click=model.scrollLeft()></i> <i class=\"picto icon-small-chevron-right scroll right\" ng-show=model.canScrollRight ng-click=model.scrollRight()></i>"
  );


  $templateCache.put('rui/cardboard/template/rui-column.html',
    "<div class=rui-cardboard-column ng-style=\"{width: width}\" ng-transclude=\"\"></div>"
  );


  $templateCache.put('rui/dropdown/templates/dropdown-item.html',
    "<li ng-class=\"{active: $dropdownItem.isSelected, disabled: $dropdownItem.isDisabled}\" ng-click=$dropdownItem.select() class=dropdown-item></li>"
  );


  $templateCache.put('rui/dropdown/templates/dropdown.html',
    "<div ng-class=\"{open: $dropdown.isOpen}\" class=dropdown-container><div ng-click=$dropdown.toggleOpen() class=\"field dropdown\"><span class=rui-dropdown-label-container></span><span ng-click=$dropdown.toggle() class=\"icons icon-chevron-down\"></span></div></div>"
  );


  $templateCache.put('rui/forms/input/number/templates/number.html',
    "<div class=rui-input-number><div ng-transclude=\"\" class=rui-input-number-container></div><div class=rui-input-number-spin-btn-container><div ng-click=$inputNumber.step(1) class=\"rui-input-number-spin-btn rui-input-number-spin-btn-up icon-full-arrow-up\"></div><div ng-click=$inputNumber.step(-1) class=\"rui-input-number-spin-btn rui-input-number-spin-btn-down icon-full-arrow-down\"></div></div></div>"
  );


  $templateCache.put('rui/highcharts/templates/highcharts.html',
    "<div class=rui-hightcharts><div class=rui-highcharts-container></div><div class=rui-highcharts-html-container></div></div>"
  );


  $templateCache.put('rui/menu/quickmenu/template/rui-quickmenu.html',
    "<div class=\"picto icon-{{item.icon}}\" title={{item.title}} ng-repeat=\"item in items\"></div>"
  );


  $templateCache.put('rui/tabs/templates/tab-content.html',
    "<div rui-transclude=\"\" ng-class=$tab.contentClasses() class=tab-pane></div>"
  );


  $templateCache.put('rui/tabs/templates/tab-heading.html',
    "<li ng-class=$tab.headingClasses()><a rui-transclude=\"\" ng-click=$tab.select()></a></li>"
  );


  $templateCache.put('rui/tabs/templates/tabset.html',
    "<div class=rui-tabset><ul class=\"nav nav-tabs\"></ul><div class=tab-content></div><div rui-transclude=\".rui-tab, [rui-tab]\" class=\"tabs meta\"></div></div>"
  );


  $templateCache.put('rui/tree/templates/content.html',
    "<div class=rui-tree-node-content><span ng-bind=$ruiTreeNode.node.name class=name></span></div>"
  );


  $templateCache.put('rui/tree/templates/expandCollapse.html',
    "<div rui-tree-node-expand-collapse-ctrl=rui-tree-node-expand-collapse-ctrl class=rui-tree-node-expand-toggle-area><span ng-click=$ruiTreeNode.toggleExpand() ng-if=$ruiTreeNode.canToggleExpand ng-class=\"{'rui-tree-node-toggle-disabled': $ruiTreeNode.toggleDisabled}\" class=rui-tree-node-expand-toggle><a ng-if=$ruiTreeNode.canExpand class=icon-expand></a><a ng-if=$ruiTreeNode.canCollapse class=icon-collapse></a></span></div>"
  );


  $templateCache.put('rui/tree/templates/node.html',
    "<li rui-tree-node-ctrl=rui-tree-node-ctrl rui-tree-node-throttle-sub-tree=true class=rui-tree-node><div class=rui-tree-node-container><div rui-tree-node-content=rui-tree-node-content class=rui-tree-node-content></div></div><div class=rui-tree-node-sub-tree-placeholder></div></li>"
  );


  $templateCache.put('rui/tree/templates/searchContent.html',
    "<span ng-bind-html=$ruiTreeNode.state.searchMatchName ng-if=\"$ruiTree.rootState.isSearching &amp;&amp; $ruiTreeNode.state.searchMatch\" class=name-with-match></span>"
  );


  $templateCache.put('rui/tree/templates/tree.html',
    "<ul rui-tree-ctrl=rui-tree-ctrl class=rui-tree><div ng-transclude=ng-transclude class=templates></div><li ng-repeat=\"$node in $ruiTree.root.children\" rui-tree-node=$node class=rui-tree-nodes></li></ul>"
  );


  $templateCache.put('rui/util/transclude/templates/transclude-meta.html',
    "<div class=rui-transclude-meta></div>"
  );

}]);
