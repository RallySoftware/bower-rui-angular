(function () {
  var CardboardCtrl, ColumnCtrl, ColumnScrollableCtrl, DropdownCtrl, HighchartsCtrl, HighchartsHtmlCtrl, ItemCtrl, PubSub, TabsetCtrl, ToggleCtrl, TranscludeCtrl, card, cardboard, column, columnscrollable, columnscrollbars, dropdown, highcharts, module, rui, tab, tabset, transclude, util, __bind = function (fn, me) {
      return function () {
        return fn.apply(me, arguments);
      };
    }, __indexOf = [].indexOf || function (item) {
      for (var i = 0, l = this.length; i < l; i++) {
        if (i in this && this[i] === item)
          return i;
      }
      return -1;
    };
  cardboard = angular.module('rui.cardboard', [
    'rui.templates',
    'rui.cardboard.directives.cardboard',
    'rui.cardboard.directives.column',
    'rui.cardboard.directives.card',
    'rui.cardboard.directives.columnscrollable',
    'rui.cardboard.directives.columnscrollbars',
    'rui.cardboard.filters.wip'
  ]);
  angular.module('rui.cardboard.controllers.cardboard', []).controller('rui.cardboard.controllers.cardboard', CardboardCtrl = function () {
    CardboardCtrl.$inject = ['$timeout'];
    function CardboardCtrl($timeout) {
      this.$timeout = $timeout;
      this.columns = [];
      this.columnWidth = 0;
    }
    CardboardCtrl.prototype._adjustColumns = function () {
      var _this = this;
      this.columnWidth = 100 / this.columns.length;
      return angular.forEach(this.columns, function (column) {
        return column.width = '' + _this.columnWidth + '%';
      });
    };
    CardboardCtrl.prototype.addColumn = function (column) {
      var _this = this;
      this.columns.push(column);
      column.cardboard = this;
      if (this.adjustTimer) {
        this.$timeout.cancel(this.adjustTimer);
      }
      return this.adjustTimer = this.$timeout(function () {
        return _this._adjustColumns();
      });
    };
    CardboardCtrl.prototype.removeColumn = function (column) {
      return this.columns = _.filter(this.columns, function (col) {
        return col !== column;
      });
    };
    return CardboardCtrl;
  }());
  angular.module('rui.cardboard.controllers.column', []).controller('rui.cardboard.controllers.column', ColumnCtrl = function () {
    ColumnCtrl.$inject = ['$scope'];
    function ColumnCtrl($scope) {
      this.$scope = $scope;
    }
    ColumnCtrl.prototype.addCard = function (card) {
      return card.column = this;
    };
    ColumnCtrl.prototype.removeCard = function () {
    };
    return ColumnCtrl;
  }());
  angular.module('rui.cardboard.controllers.columnscrollable', []).controller('rui.cardboard.controllers.columnscrollable', ColumnScrollableCtrl = function () {
    ColumnScrollableCtrl.prototype.currentIndex = 0;
    ColumnScrollableCtrl.prototype.scrollableColumns = [];
    ColumnScrollableCtrl.prototype.numColumns = 3;
    ColumnScrollableCtrl.prototype.columns = [];
    ColumnScrollableCtrl.$inject = [
      '$scope',
      '$attrs'
    ];
    function ColumnScrollableCtrl($scope, $attrs) {
      this.scrollLeft = __bind(this.scrollLeft, this);
      this.scrollRight = __bind(this.scrollRight, this);
      var columns, columnsProp, _this = this;
      columnsProp = $attrs.ruiColumnScrollable;
      if ($attrs.numColumns) {
        this.numColumns = +$attrs.numColumns;
      }
      columns = $scope.$eval(columnsProp);
      if (columns != null ? columns.length : void 0) {
        this.initColumns(columns);
      }
      this.columnsWatchListener = $scope.$watch('' + columnsProp + '.length', function (newValue, oldValue) {
        if (oldValue === void 0 || newValue > oldValue) {
          _this.initColumns($scope.$eval(columnsProp));
        }
        if (oldValue === void 0 || newValue < oldValue) {
          return _this.columnsWatchListener();
        }
      });
    }
    ColumnScrollableCtrl.prototype.initColumns = function (columns) {
      this.columns = columns;
      this.scrollableColumns = [].concat(this.columns);
      return this.scrollColumns();
    };
    ColumnScrollableCtrl.prototype.scrollRight = function () {
      this.currentIndex++;
      return this.scrollColumns();
    };
    ColumnScrollableCtrl.prototype.scrollLeft = function () {
      this.currentIndex--;
      return this.scrollColumns();
    };
    ColumnScrollableCtrl.prototype.scrollColumns = function () {
      var _this = this;
      this.columns.length = 0;
      return _.each(this.scrollableColumns.slice(this.currentIndex, this.currentIndex + this.numColumns), function (column, index, columns) {
        _this.columns.push(column);
        column.visible = true;
        column.scrollRight = _this.scrollRight;
        column.scrollLeft = _this.scrollLeft;
        if (index === 0 && _this.columns[0] !== _this.scrollableColumns[0]) {
          column.canScrollLeft = true;
        } else {
          column.canScrollLeft = false;
        }
        if (index === _this.numColumns - 1 && _this.columns[_this.numColumns - 1] !== _this.scrollableColumns[_this.scrollableColumns.length - 1]) {
          column.canScrollRight = true;
        } else {
          column.canScrollRight = false;
        }
        return true;
      });
    };
    return ColumnScrollableCtrl;
  }());
  card = angular.module('rui.cardboard.directives.card', [
    'rui.cardboard.directives.column',
    'rui.cardboard.directives.cardboard'
  ]);
  card.directive('ruiCard', function () {
    return {
      restrict: 'EA',
      transclude: true,
      replace: true,
      require: [
        '^ruiCardboard',
        '^ruiColumn',
        'ngModel'
      ],
      templateUrl: 'rui/cardboard/template/rui-card.html',
      compile: function (tElement, tAttrs, transcludeFn) {
        return function (scope, element, attrs, controllers) {
          var cardboardCtrl, columnCtrl, model;
          cardboardCtrl = controllers[0], columnCtrl = controllers[1], model = controllers[2];
          card = scope.$eval(attrs.ngModel);
          scope.model = card;
          card.fields = _.map(card.displayFields, function (displayField) {
            var field;
            if (card[displayField] !== void 0) {
              return field = {
                name: displayField,
                value: scope.model[displayField]
              };
            }
          });
          if (attrs.color) {
            scope.$watch(attrs.color, function (newValue, oldValue) {
              return element.find('.card-color').css('background-color', newValue);
            });
          }
          columnCtrl.addCard(scope);
          return scope.$emit('cardrendered', card);
        };
      }
    };
  });
  cardboard = angular.module('rui.cardboard.directives.cardboard', ['rui.cardboard.controllers.cardboard']);
  cardboard.directive('ruiCardboard', function () {
    return {
      restrict: 'EA',
      controller: 'rui.cardboard.controllers.cardboard',
      compile: function (tElement, tAttrs) {
        tElement.addClass('rui-cardboard');
        return function (scope, element, attrs, controller) {
        };
      }
    };
  });
  column = angular.module('rui.cardboard.directives.column', [
    'rui.cardboard.controllers.column',
    'rui.cardboard.directives.cardboard'
  ]);
  column.directive('ruiColumn', function () {
    return {
      restrict: 'EA',
      transclude: true,
      require: [
        '^ruiCardboard',
        'ngModel'
      ],
      replace: true,
      templateUrl: 'rui/cardboard/template/rui-column.html',
      controller: 'rui.cardboard.controllers.column',
      compile: function (tElement, tAttr, transcludeFn) {
        return function (scope, element, attrs, controllers) {
          var cardboardCtrl, model;
          cardboardCtrl = controllers[0], model = controllers[1];
          scope.model = scope.$eval(attrs.ngModel);
          cardboardCtrl.addColumn(scope);
          element.on('$destroy', function () {
            return cardboardCtrl.removeColumn(scope);
          });
          return transcludeFn(scope, function (clone) {
            return element.append(clone);
          });
        };
      }
    };
  });
  columnscrollable = angular.module('rui.cardboard.directives.columnscrollable', ['rui.cardboard.controllers.columnscrollable']);
  columnscrollable.directive('ruiColumnScrollable', function () {
    return {
      restrict: 'A',
      priority: 100000,
      controller: 'rui.cardboard.controllers.columnscrollable'
    };
  });
  columnscrollbars = angular.module('rui.cardboard.directives.columnscrollbars', ['rui.cardboard.directives.column']);
  columnscrollbars.directive('ruiColumnScrollbars', function () {
    return {
      restrict: 'A',
      require: [
        'ngModel',
        '^ruiColumn'
      ],
      templateUrl: 'rui/cardboard/template/rui-column-scrollbars.html',
      compile: function (tElement, tAttrs) {
        return function (scope, element, attrs, controllers) {
          var columnCtrl, model;
          model = controllers[0], columnCtrl = controllers[1];
          return scope.model = scope.$eval(attrs.ngModel);
        };
      }
    };
  });
  angular.module('rui.cardboard.filters.wip', []).filter('wip', function () {
    return function (input) {
      if (input === 0) {
        return '\u221e';
      } else {
        return input;
      }
    };
  });
  angular.module('rui.dropdown.directives.controllers.dropdown', []).controller('DropdownCtrl', DropdownCtrl = function () {
    DropdownCtrl.$inject = ['$scope'];
    function DropdownCtrl($scope) {
      this.$scope = $scope;
      this.onBlur = __bind(this.onBlur, this);
      this.toggleOpen = __bind(this.toggleOpen, this);
      this.select = __bind(this.select, this);
      this.$dropdown = this.$scope.$dropdown = this.$scope.$new();
      this.$dropdown.isDisabled = false;
      this.$dropdown.isOpen = false;
      this.$dropdown.toggleOpen = this.toggleOpen;
      this.$dropdown.onBlur = this.onBlur;
    }
    DropdownCtrl.prototype.select = function (value) {
      if (!this.$dropdown.isDisabled) {
        this.$dropdown.selected = value;
        this.toggleOpen(false);
        return true;
      } else {
        return false;
      }
    };
    DropdownCtrl.prototype.toggleOpen = function (open) {
      if (open == null) {
        open = !this.$dropdown.isOpen;
      }
      return this.$dropdown.isOpen = open;
    };
    DropdownCtrl.prototype.onBlur = function (e) {
      return this.$dropdown.isOpen = false;
    };
    return DropdownCtrl;
  }());
  angular.module('rui.dropdown.directives.controllers.item', []).controller('ItemCtrl', ItemCtrl = function () {
    ItemCtrl.$inject = ['$scope'];
    function ItemCtrl($scope) {
      this.$scope = $scope;
      this.select = __bind(this.select, this);
      this.$dropdownItem = this.$scope.$dropdownItem = this.$scope.$new();
      this.$dropdownItem.isSelected = false;
      this.$dropdownItem.select = this.select;
      this.$dropdownItem.value = null;
    }
    ItemCtrl.prototype.select = function () {
      if (!this.$dropdownItem.isDisabled) {
        return this.$dropdownItem.isSelected = this.$dropdownItem.selectItem(this.$dropdownItem.value);
      }
    };
    return ItemCtrl;
  }());
  module = angular.module('rui.dropdown.directives.dropdown', ['rui.dropdown.directives.controllers.dropdown']).directive('ruiDropdown', [function () {
      return {
        restrict: 'EA',
        controller: 'DropdownCtrl',
        require: ['ngModel'],
        transclude: 'true',
        scope: true,
        replace: true,
        templateUrl: 'rui/dropdown/templates/dropdown.html',
        compile: function (tElement, tAttrs, transcludeFn) {
          tElement.addClass('rui-dropdown');
          if (!tElement.attr('tabindex')) {
            tElement.attr('tabindex', 0);
          }
          return function (scope, element, attrs, _arg) {
            var ngModel;
            ngModel = _arg[0];
            scope.$watch('$dropdown.isOpen', function (isOpen) {
              if (isOpen) {
                return $(element).focus();
              }
            });
            $(element).blur(function (e) {
              return scope.$apply(function () {
                return scope.$dropdown.onBlur(e);
              });
            });
            attrs.$observe('disabled', function (isDisabled) {
              return scope.$dropdown.isDisabled = isDisabled;
            });
            scope.$watch('$dropdown.selected', function (value) {
              return ngModel.$setViewValue(value);
            });
            scope.$watch(function () {
              return ngModel.$modelValue;
            }, function (value) {
              return scope.$dropdown.value = value;
            });
            return transcludeFn(scope, function (clone) {
              var theDropdownMenu, theLabelElement;
              theLabelElement = $('.rui-dropdown-label-container', element);
              theLabelElement.addClass('rui-dropdown-label');
              theLabelElement.append($(clone).filter('.rui-dropdown-label, [rui-dropdown-label]'));
              theDropdownMenu = $(clone).filter('.rui-dropdown-menu, [rui-dropdown-menu]');
              theDropdownMenu.addClass('rui-dropdown-menu');
              return element.append(theDropdownMenu);
            });
          };
        }
      };
    }]);
  dropdown = angular.module('rui.dropdown.directives.item', ['rui.dropdown.directives.controllers.item']).directive('ruiDropdownItem', [function () {
      return {
        restrict: 'EA',
        controller: 'ItemCtrl',
        require: [
          'ngModel',
          '^ruiDropdown'
        ],
        transclude: 'true',
        scope: true,
        replace: true,
        templateUrl: 'rui/dropdown/templates/dropdown-item.html',
        compile: function (tElement, tAttrs, transcludeFn) {
          tElement.addClass('rui-dropdown-item');
          return function (scope, element, attrs, _arg) {
            var dropdownController, ngModel;
            ngModel = _arg[0], dropdownController = _arg[1];
            scope.$watch(function () {
              return ngModel.$modelValue;
            }, function (value) {
              return scope.$dropdownItem.value = value;
            });
            scope.$dropdownItem.selectItem = dropdownController.select;
            dropdownController.$dropdown.$watch('selected', function (value) {
              return scope.$dropdownItem.isSelected = value === scope.$dropdownItem.value;
            });
            attrs.$observe('disabled', function (isDisabled) {
              return scope.$dropdownItem.isDisabled = isDisabled;
            });
            return transcludeFn(scope, function (clone) {
              return element.append(clone);
            });
          };
        }
      };
    }]);
  dropdown = angular.module('rui.dropdown', [
    'rui.templates',
    'rui.dropdown.directives.dropdown',
    'rui.dropdown.directives.item'
  ]);
  angular.module('rui.highcharts.directives.controllers.highcharts', []).controller('HighchartsCtrl', HighchartsCtrl = function () {
    var events;
    events = [
      'load',
      'click',
      'redraw',
      'selection'
    ];
    HighchartsCtrl.$inject = [
      '$scope',
      'Highcharts'
    ];
    function HighchartsCtrl($scope, Highcharts) {
      this.$scope = $scope;
      this.Highcharts = Highcharts;
      this._onEvent = __bind(this._onEvent, this);
      this.hideSeries = __bind(this.hideSeries, this);
      this.$scope.$highcharts = this.$scope.$new();
      this.$scope.$highcharts.hideSeries = this.hideSeries;
    }
    HighchartsCtrl.prototype.hideSeries = function (n) {
      var _ref;
      return (_ref = this.$scope.$highcharts.chart.series[n]) != null ? _ref.hide() : void 0;
    };
    HighchartsCtrl.prototype.initHighcharts = function (element, options) {
      var defaults, event, _i, _len, _ref;
      if (options == null) {
        options = {};
      }
      this.events = options != null ? (_ref = options.chart) != null ? _ref.events : void 0 : void 0;
      defaults = {
        chart: {
          renderTo: element[0],
          events: {}
        }
      };
      for (_i = 0, _len = events.length; _i < _len; _i++) {
        event = events[_i];
        defaults.chart.events[event] = this._onEvent(event);
      }
      options = _.merge(options, defaults);
      this.$scope.$highcharts.chart = new this.Highcharts.Chart(options);
      return this.$scope.$highcharts.chart;
    };
    HighchartsCtrl.prototype._onEvent = function (eventName) {
      var _this = this;
      return function (e) {
        var _ref, _ref1;
        if ((_ref = _this.events) != null) {
          if ((_ref1 = _ref[eventName]) != null) {
            _ref1.apply(_this.highcharts, arguments);
          }
        }
        _this.$scope.$broadcast('chart:' + eventName, e);
        if (!_this.$scope.$$phase) {
          return _this.$scope.$digest();
        }
      };
    };
    return HighchartsCtrl;
  }());
  angular.module('rui.highcharts.directives.controllers.html', []).controller('HighchartsHtmlCtrl', HighchartsHtmlCtrl = function () {
    HighchartsHtmlCtrl.$inject = ['$scope'];
    function HighchartsHtmlCtrl($scope) {
      this.$scope = $scope;
      this.$scope.$highchartsHtml = this.$scope.$new();
    }
    return HighchartsHtmlCtrl;
  }());
  angular.module('rui.highcharts.directives.controllers.toggle', []).controller('ToggleCtrl', ToggleCtrl = function () {
    ToggleCtrl.$inject = ['$scope'];
    function ToggleCtrl($scope) {
      var _this = this;
      this.$scope = $scope;
      this.toggleIt = __bind(this.toggleIt, this);
      debugger;
      this.toggleTest = 'test';
      this.$scope.$watch('state', function (state) {
        switch (state) {
        case 'scores':
          return _this.$scope.$highcharts.chart.series[0].hide();
        case 'metric':
          return _this.$scope.$highcharts.chart.series[0].hide();
        }
      });
    }
    ToggleCtrl.prototype.toggleIt = function () {
      debugger;
    };
    return ToggleCtrl;
  }());
  highcharts = angular.module('rui.highcharts.directives.highcharts', [
    'rui.highcharts.directives.controllers.highcharts',
    'rui.highcharts.factories.highcharts'
  ]).directive('ruiHighcharts', [function () {
      return {
        restrict: 'EA',
        controller: 'HighchartsCtrl',
        require: [
          '?ngModel',
          'ruiHighcharts'
        ],
        transclude: true,
        scope: true,
        replace: true,
        templateUrl: 'rui/highcharts/templates/highcharts.html',
        compile: function (tElement, tAttrs, transcludeFn) {
          tElement.addClass('rui-highcharts');
          return function (scope, element, attrs, _arg) {
            var chart, controller, ngModel, options, renderTo;
            ngModel = _arg[0], controller = _arg[1];
            options = scope.$eval(attrs.highchartsConfig);
            renderTo = $('.rui-highcharts-container', element);
            chart = controller.initHighcharts(renderTo, options);
            if (ngModel != null) {
              ngModel.$setViewValue(chart);
            }
            return transcludeFn(scope, function (clone) {
              return $('.rui-highcharts-html-container', element).append(clone);
            });
          };
        }
      };
    }]);
  angular.module('rui.highcharts.directives.html', [
    'rui.highcharts.directives.controllers.highcharts',
    'rui.highcharts.directives.controllers.html'
  ]).directive('ruiHighchartsHtml', [function () {
      return {
        restrict: 'EA',
        transclude: false,
        require: ['^ruiHighcharts'],
        controller: 'HighchartsHtmlCtrl',
        scope: true,
        compile: function (tElement, tAttrs) {
          tElement.addClass('rui-highcharts-html');
          return function (scope, element, attrs, _arg) {
            var highchartsController;
            highchartsController = _arg[0];
            return scope.$highcharts = highchartsController.$scope.$highcharts;
          };
        }
      };
    }]);
  highcharts = angular.module('rui.highcharts.factories.highcharts', []).factory('Highcharts', function () {
    return Highcharts;
  });
  highcharts = angular.module('rui.highcharts', [
    'rui.templates',
    'rui.highcharts.directives.highcharts',
    'rui.highcharts.directives.html',
    'rui.highcharts.factories.highcharts'
  ]);
  angular.module('rui.quickmenu.directives.quickmenu', []).directive('ruiQuickmenu', function () {
    return {
      restrict: 'EA',
      scope: { items: '=' },
      templateUrl: 'rui/menu/quickmenu/template/rui-quickmenu.html',
      compile: function (tElement, tAttrs) {
        tElement.addClass('rui-quickmenu');
        return function (scope, element, attributes) {
          return scope.$watch('items.length', function (newValue, oldValue) {
            return element.width(newValue * 26);
          });
        };
      }
    };
  });
  angular.module('rui.quickmenu', ['rui.quickmenu.directives.quickmenu']);
  angular.module('rui.pubsub', []).service('PubSub', PubSub = function () {
    function PubSub($rootScope) {
      this.$rootScope = $rootScope;
    }
    PubSub.prototype.subscribe = function (event, handler) {
      console.log('subscribe:', event, handler);
      return this.$rootScope.$on(event, handler);
    };
    PubSub.prototype.publish = function (event, data, options) {
      var _ref;
      console.log('publish:', event, data);
      this.$rootScope.$emit(event, data);
      return typeof Rally !== 'undefined' && Rally !== null ? (_ref = Rally.environment) != null ? _ref.getMessageBus().publish.apply(Rally.environment.getMessageBus(), arguments) : void 0 : void 0;
    };
    return PubSub;
  }());
  rui = angular.module('rui', [
    'rui.sortable',
    'rui.highcharts',
    'rui.dropdown',
    'rui.tabs',
    'rui.util'
  ]);
  angular.module('rui.sortable', []).value('ruiSortableConfig', {}).directive('ruiSortable', [
    'ruiSortableConfig',
    function (ruiSortableConfig) {
      return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
          var onReceive, onRemove, onStart, onStop, onUpdate, opts;
          opts = angular.extend({}, ruiSortableConfig, scope.$eval(attrs.ruiSortable));
          if (ngModel) {
            ngModel.$render = function () {
              return element.sortable('refresh');
            };
            onStart = function (e, ui) {
              return ui.item.sortable = {
                startIndex: ui.item.index(),
                startModel: ngModel
              };
            };
            onUpdate = function (e, ui) {
              return ui.item.sortable.resort = ngModel;
            };
            onReceive = function (e, ui) {
              ui.item.sortable.relocate = true;
              return ngModel.$modelValue.splice(ui.item.index(), 0, ui.item.sortable.moved);
            };
            onRemove = function (e, ui) {
              if (ngModel.$modelValue.length === 1) {
                return ui.item.sortable.moved = ngModel.$modelValue.splice(0, 1)[0];
              } else {
                return ui.item.sortable.moved = ngModel.$modelValue.splice(ui.item.sortable.startIndex, 1)[0];
              }
            };
            onStop = function (e, ui) {
              var end, start;
              if (ui.item.sortable.resort) {
                ui.item.sortable.endIndex = ui.item.index();
                ui.item.sortable.endModel = ui.item.sortable.resort;
              }
              if (ui.item.sortable.resort && !ui.item.sortable.relocate) {
                start = ui.item.sortable.startIndex;
                end = ui.item.sortable.endIndex;
                ui.item.sortable.resort.$modelValue.splice(end, 0, ui.item.sortable.resort.$modelValue.splice(start, 1)[0]);
              }
              if (ui.item.sortable.resort || ui.item.sortable.relocate) {
                return scope.$apply();
              }
            };
            opts.start = function (_start) {
              return function (e, ui) {
                onStart(e, ui);
                if (typeof _start === 'function') {
                  return _start(e, ui);
                }
              };
            }(opts.start);
            opts.stop = function (_stop) {
              return function (e, ui) {
                onStop(e, ui);
                if (typeof _stop === 'function') {
                  return _stop(e, ui);
                }
              };
            }(opts.stop);
            opts.update = function (_update) {
              return function (e, ui) {
                onUpdate(e, ui);
                if (typeof _update === 'function') {
                  return _update(e, ui);
                }
              };
            }(opts.update);
            opts.receive = function (_receive) {
              return function (e, ui) {
                onReceive(e, ui);
                if (typeof _receive === 'function') {
                  return _receive(e, ui);
                }
              };
            }(opts.receive);
            opts.remove = function (_remove) {
              return function (e, ui) {
                onRemove(e, ui);
                if (typeof _remove === 'function') {
                  return _remove(e, ui);
                }
              };
            }(opts.remove);
          }
          return element.sortable(opts);
        }
      };
    }
  ]);
  angular.module('rui.tabs.directives.controllers.tab', []).controller('TabCtrl', TabsetCtrl = function () {
    TabsetCtrl.$inject = ['$scope'];
    function TabsetCtrl($scope) {
      var _this = this;
      this.$scope = $scope;
      this.headingClasses = __bind(this.headingClasses, this);
      this.select = __bind(this.select, this);
      this.$tab = this.$scope.$tab = this.$scope.$new();
      this.$tab.model = {};
      this.$tab.select = this.select;
      this.$tab.headingClasses = this.headingClasses;
      this.$tab.contentClasses = this.headingClasses;
      this.$tabset = this.$scope.$tabset;
      this.$tabset.registerTab(this.$tab.model);
      this.$tabset.$watch('state.activeTab', function (tab) {
        return _this.$tab.model.isActive = tab === _this.$tab.model;
      });
      return this;
    }
    TabsetCtrl.prototype.select = function () {
      return this.$tab.model.isActive = this.$tab.selectTab(this.$tab.model);
    };
    TabsetCtrl.prototype.headingClasses = function () {
      return { active: this.$tab.model.isActive };
    };
    return TabsetCtrl;
  }());
  angular.module('rui.tabs.directives.controllers.tabset', []).controller('TabsetCtrl', TabsetCtrl = function () {
    TabsetCtrl.$inject = [
      '$scope',
      '$transclude'
    ];
    function TabsetCtrl($scope, $transclude) {
      this.$scope = $scope;
      this.$transclude = $transclude;
      this.registerTab = __bind(this.registerTab, this);
      this.select = __bind(this.select, this);
      this.$tabset = this.$scope.$tabset = this.$scope.$new();
      this.$tabset.state = {};
      this.$tabset.registerTab = this.registerTab;
      return this;
    }
    TabsetCtrl.prototype.select = function (tab) {
      this.$tabset.state.activeTab = tab;
      return true;
    };
    TabsetCtrl.prototype.registerTab = function (tab) {
      if (!this.$tabset.state.activeTab) {
        return this.select(tab);
      }
    };
    return TabsetCtrl;
  }());
  tab = angular.module('rui.tabs.directives.tab', ['rui.tabs.directives.controllers.tab']).directive('ruiTab', [function () {
      return {
        restrict: 'EA',
        require: [
          '?ngModel',
          '^ruiTabset'
        ],
        controller: 'TabCtrl',
        scope: true,
        link: {
          post: function (scope, element, attrs, _arg) {
            var $content, $element, $heading, $tabset, ngModel, tabsetController;
            ngModel = _arg[0], tabsetController = _arg[1];
            $element = $(element);
            $heading = $element.children('.rui-tab-heading, [rui-tab-heading]');
            $content = $element.children('.rui-tab-content, [rui-tab-content]');
            $tabset = $element.parents('.rui-tabset');
            $tabset.find('ul.nav-tabs').append($heading);
            $tabset.find('.tab-content').append($content);
            scope.$tab.selectTab = tabsetController.select;
            return this;
          }
        }
      };
    }]);
  tab = angular.module('rui.tabs.directives.tabContent', []).directive('ruiTabContent', [function () {
      return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        scope: true,
        templateUrl: 'rui/tabs/templates/tab-content.html',
        link: function (scope, element, attrs) {
          return this;
        }
      };
    }]);
  tabset = angular.module('rui.tabs.directives.tabHeading', []).directive('ruiTabHeading', [function () {
      return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        scope: true,
        require: [
          '?^ngModel',
          '^ruiTab'
        ],
        templateUrl: 'rui/tabs/templates/tab-heading.html',
        link: function ($scope, element, attrs, _arg) {
          var ngModel, tabCtrl;
          ngModel = _arg[0], tabCtrl = _arg[1];
          $scope.$tabHeading = $scope.$new();
          $scope.$tabHeading.select = tabCtrl.select;
          $scope.$tabHeading.headingClasses = tabCtrl.headingClasses;
          return this;
        }
      };
    }]);
  tabset = angular.module('rui.tabs.directives.tabset', ['rui.tabs.directives.controllers.tabset']).directive('ruiTabset', [function () {
      return {
        restrict: 'EA',
        require: ['?ngModel'],
        transclude: true,
        scope: true,
        replace: true,
        templateUrl: 'rui/tabs/templates/tabset.html',
        controller: 'TabsetCtrl',
        link: {
          post: function (scope, element, attrs, _arg) {
            var ngModel;
            ngModel = _arg[0];
            return this;
          }
        }
      };
    }]);
  module = angular.module('rui.tabs', [
    'rui.templates',
    'rui.util.transclude',
    'rui.tabs.directives.tabset',
    'rui.tabs.directives.tab',
    'rui.tabs.directives.tabHeading',
    'rui.tabs.directives.tabContent'
  ]);
  angular.module('rui.templates', []);
  angular.module('rui.test.phantom', []).run([
    '$log',
    function ($log) {
      var dispatchEvent;
      $log.debug('Initializing native click events');
      dispatchEvent = function (eventType) {
        var doc, evt;
        doc = this.ownerDocument;
        evt = doc.createEvent('MouseEvents');
        evt.initMouseEvent(eventType, true, true, doc.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        return this.dispatchEvent(evt);
      };
      $.fn.nativeMouseEvent = function (eventType) {
        return this.each(function () {
          return dispatchEvent.apply(this, [eventType]);
        });
      };
      return $.fn.nativeClick = function () {
        return this.each(function () {
          var _ref;
          if (_ref = !'createEvent', __indexOf.call(document, _ref) >= 0) {
            this.click();
          } else {
          }
          return dispatchEvent.apply(this, ['click']);
        });
      };
    }
  ]);
  angular.module('rui.util.transclude.directives.controllers.transclude', []).controller('TranscludeCtrl', TranscludeCtrl = function () {
    TranscludeCtrl.$inject = [
      '$scope',
      '$transclude',
      '$window'
    ];
    function TranscludeCtrl($scope, $transclude, $window) {
      this.$scope = $scope;
      this.$transclude = $transclude;
      this.$window = $window;
      this.transclude = __bind(this.transclude, this);
      this.filter = __bind(this.filter, this);
      if (!this.$transclude) {
        throw 'ruiTransclude:orphan,\nIllegal use of ruiTransclude directive in the template!\nNo parent directive that requires a transclusion found.\nElement: {#$element}\n';
      }
    }
    TranscludeCtrl.prototype.filter = function (clone, filter) {
      var $clone, filtered, postMeta, sorted;
      $clone = $(clone);
      filtered = $clone.filter(filter);
      postMeta = [];
      _.each(filtered, function (e) {
        var $e, index;
        $e = $(e);
        if ($e.hasClass('rui-transclude-meta')) {
          index = $clone.index($e);
          e = _.find(clone, function (node, i) {
            return i > index && node.nodeType !== 3;
          });
        }
        return postMeta.push(e);
      });
      sorted = _.sortBy(postMeta, function (e) {
        return _.indexOf(clone, e);
      });
      return sorted;
    };
    TranscludeCtrl.prototype.transclude = function ($element, filter, required) {
      var boundTranscludeFn, _this = this;
      if (required == null) {
        required = true;
      }
      boundTranscludeFn = function (clone) {
        var toAppend;
        if (filter) {
          toAppend = _this.filter(clone, filter);
        } else {
          toAppend = clone;
        }
        if (required && !toAppend.length > 0) {
          throw 'ruiTransclude:empty,\n  Illegal use of ruiTransclude. Can\'t find elements to transclude in the clone.\n  Maybe you\'re using directives that result in virtual elements like ng-repeat or ng-if? If so, try \n  using an element wrapper or comment before the node (<!-- directive: rui-transclude-class myClass -->) to\n  tell rui-transclude what to pull.\n  Element: ' + $element + '\n  Filter: ' + filter + '\n';
        }
        $element.html('');
        return $element.append(toAppend);
      };
      return this.$transclude(this.$scope, boundTranscludeFn);
    };
    return TranscludeCtrl;
  }());
  transclude = angular.module('rui.util.transclude.directives.attribute', []).directive('ruiTranscludeAttr', [function () {
      return {
        restrict: 'M',
        templateUrl: 'rui/util/transclude/templates/transclude-meta.html',
        replace: true,
        compile: function (tElem, tAttr, transcludeFn) {
          return {
            post: function ($scope, $element, $attrs) {
            },
            pre: function ($scope, $element) {
              return $element.remove();
            }
          };
        }
      };
    }]);
  transclude = angular.module('rui.util.transclude.directives.class', []).directive('ruiTranscludeClass', [
    '$compile',
    function ($compile) {
      return {
        restrict: 'M',
        templateUrl: 'rui/util/transclude/templates/transclude-meta.html',
        transclude: 'element',
        replace: true,
        compile: function (tElem, tAttr, transcludeFn) {
          tElem.addClass(tAttr.ruiTranscludeClass);
          return {
            post: function ($scope, $element, $attrs) {
            },
            pre: function ($scope, $element) {
              return $element.remove();
            }
          };
        }
      };
    }
  ]);
  module = angular.module('rui.util.transclude.directives.transclude', ['rui.util.transclude.directives.controllers.transclude']).directive('ruiTransclude', [
    '$timeout',
    function ($timeout) {
      return {
        restrict: 'A',
        controller: 'TranscludeCtrl',
        link: {
          post: function ($scope, $element, $attrs, controller) {
            var filter, required;
            filter = $attrs.ruiTransclude;
            if (filter == null) {
              filter = filter.trim();
            }
            if (filter != null === 'rui-transclude' || filter != null === '') {
              filter = null;
            }
            required = $attrs.ruiTranscludeOptional != null ? false : true;
            return $scope.$evalAsync(function () {
              return controller.transclude($element, filter, required);
            });
          }
        }
      };
    }
  ]);
  transclude = angular.module('rui.util.transclude', [
    'rui.templates',
    'rui.util.transclude.directives.transclude',
    'rui.util.transclude.directives.class',
    'rui.util.transclude.directives.attribute'
  ]);
  util = angular.module('rui.util', ['rui.util.transclude']);
}.call(this));
angular.module('rui.templates').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('rui/cardboard/template/rui-card.html',
    "<div class=rui-card><div class=card-color></div><div class=card-content><span aria-hidden=true class=\"picto icon-defect\" ng-if=\"model.type == 'defect'\"></span><div class=avatar><img class=small ng-src=\"{{ model.avatarUrl }}\"></div><div class=card-owner>{{ model.ownerName }}</div><div class=card-id>{{ model.formattedId }}</div><div class=card-field ng-repeat=\"field in model.fields\">{{ field.value }}</div><div ng-transclude=\"\"></div></div></div>"
  );


  $templateCache.put('rui/cardboard/template/rui-column-scrollbars.html',
    "<i class=\"picto icon-small-chevron-left scroll left\" ng-show=model.canScrollLeft ng-click=model.scrollLeft()></i><i class=\"picto icon-small-chevron-right scroll right\" ng-show=model.canScrollRight ng-click=model.scrollRight()></i>"
  );


  $templateCache.put('rui/cardboard/template/rui-column.html',
    "<div class=rui-column ng-style=\"{width: width}\"></div>"
  );


  $templateCache.put('rui/dropdown/templates/dropdown-item.html',
    "<li ng-class=\"{active: $dropdownItem.isSelected, disabled: $dropdownItem.isDisabled}\" ng-click=$dropdownItem.select() class=dropdown-item></li>"
  );


  $templateCache.put('rui/dropdown/templates/dropdown.html',
    "<div ng-class=\"{open: $dropdown.isOpen}\" class=dropdown-container><div ng-click=$dropdown.toggleOpen() class=\"field dropdown\"><span class=rui-dropdown-label-container></span><span ng-click=$dropdown.toggle() class=\"icons icon-chevron-down\"></span></div></div>"
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


  $templateCache.put('rui/util/transclude/templates/transclude-meta.html',
    "<div class=rui-transclude-meta></div>"
  );

}]);
