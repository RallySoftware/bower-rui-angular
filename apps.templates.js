angular.module('apps').run(['$templateCache', function($templateCache) {

  $templateCache.put('apps/kanban/kanban.html',
    "<div class=apps-kanban ng-controller=KanbanAppCtrl><div rui-cardboard=\"\" ng-controller=\"KanbanCardboardCtrl as kanbanBoard\"><div rui-column=\"\" ng-repeat=\"column in kanbanBoard.columns\" rui-column-scrollable=kanbanBoard.columns num-columns=4 ng-controller=\"KanbanColumnCtrl as kanbanColumn\" ng-class=\"{'over-capacity': column.wip > 0 && cards.length > column.wip}\" ng-model=column><div class=column-header><div rui-column-scrollbars=\"\" ng-model=column></div><h3 class=title>{{kanbanColumn.column.title}}</h3><div class=wip>{{kanbanColumn.cards.length}} of {{column.wip | wip}}</div></div><div class=column-content rui-sortable=kanbanBoard.sortableOptions ng-model=kanbanColumn.cards><div rui-card=\"\" ng-repeat=\"card1 in kanbanColumn.cards\" ng-controller=\"KanbanCardCtrl as cardCtrl\" ng-model=card1 column=kanbanColumn ng-class=\"{ready:card1.Ready, blocked:card1.Blocked}\" color=card1.color></div></div></div></div></div>"
  );

}]);
