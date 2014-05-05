angular.module('rui.templates').run(['$templateCache', function($templateCache) {
  'use strict';

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
    "<div class=rui-tree-node-content><span ng-bind=$ruiTreeNode.node.name></span></div>"
  );


  $templateCache.put('rui/tree/templates/node.html',
    "<li class=rui-tree-node><div rui-tree-node-content=rui-tree-node-content></div><div class=rui-tree-node-sub-tree-placeholder></div></li>"
  );


  $templateCache.put('rui/tree/templates/tree.html',
    "<ul class=rui-tree><div ng-transclude=ng-transclude class=templates></div><li ng-repeat=\"$node in $ruiTree.root.children\" rui-tree-node=rui-tree-node class=rui-tree-nodes></li></ul>"
  );


  $templateCache.put('rui/util/transclude/templates/transclude-meta.html',
    "<div class=rui-transclude-meta></div>"
  );

}]);
