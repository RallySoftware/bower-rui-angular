(function() {
  angular.module('rui.alm', ['rui.alm.projectPicker', 'rui.alm.services']);

}).call(this);

(function() {
  var RuiAlmProjectPickerCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.alm.projectPicker.controllers.projectPicker', []).controller('RuiAlmProjectPickerCtrl', RuiAlmProjectPickerCtrl = (function() {
    function RuiAlmProjectPickerCtrl($scope, $timeout, $log, $q) {
      this.$scope = $scope;
      this.$timeout = $timeout;
      this.$log = $log;
      this.$q = $q;
      this.clearSearch = __bind(this.clearSearch, this);
      this.watchSearchTerm = __bind(this.watchSearchTerm, this);
      this.watchSelectedNode = __bind(this.watchSelectedNode, this);
      this.setDropdownIsOpen = __bind(this.setDropdownIsOpen, this);
      this.focusOut = __bind(this.focusOut, this);
      this.toggleDropdown = __bind(this.toggleDropdown, this);
      this.updateWorkspaces = __bind(this.updateWorkspaces, this);
      this.onSearchInProgress = __bind(this.onSearchInProgress, this);
      this.onSelectedNode = __bind(this.onSelectedNode, this);
      this.selectNode = __bind(this.selectNode, this);
      this.watchDropdownToExpand = __bind(this.watchDropdownToExpand, this);
      this.$scope.$ruiAlmProjectPicker = {
        dropdownIsOpen: false,
        useDropdown: true,
        toggleDropdown: this.toggleDropdown,
        onBlur: this.onBlur,
        clearSearch: this.clearSearch
      };
      this.$scope.$watch('$ruiAlmProjectPicker.selectedNode', this.watchSelectedNode);
      this.$scope.$watch('$ruiAlmProjectPicker.searchTerm', this.watchSearchTerm);
      this.$scope.$watch('$ruiAlmProjectPicker.dropdownIsOpen', this.watchDropdownToExpand);
      this.$scope.$on('rui-tree:selectedNode', this.onSelectedNode);
      this.$scope.$on('rui-tree:searchInProgress', this.onSearchInProgress);
    }

    RuiAlmProjectPickerCtrl.prototype.watchDropdownToExpand = function(isOpen, oldIsOpen) {
      if ((this.$scope.$ruiAlmProjectPicker.selectedNode != null) && isOpen && !oldIsOpen) {
        return this.$scope.$broadcast('rui-tree:expand-to-node', this.$scope.$ruiAlmProjectPicker.selectedNode);
      }
    };

    RuiAlmProjectPickerCtrl.prototype.selectNode = function(node) {
      return this.$scope.$ruiAlmProjectPicker.selectedNode = node;
    };

    RuiAlmProjectPickerCtrl.prototype.onSelectedNode = function(event, selectedNode) {
      this.$scope.$ruiAlmProjectPicker.dropdownIsOpen = false;
      return event.stopPropagation();
    };

    RuiAlmProjectPickerCtrl.prototype.onSearchInProgress = function(event, searchInProgress) {
      this.$scope.$ruiAlmProjectPicker.searchInProgress = searchInProgress;
      return event.stopPropagation();
    };

    RuiAlmProjectPickerCtrl.prototype.updateWorkspaces = function(workspaces) {
      return this.$scope.$ruiAlmProjectPicker.workspaces = workspaces;
    };

    RuiAlmProjectPickerCtrl.prototype.toggleDropdown = function($event) {
      return this.$scope.$ruiAlmProjectPicker.dropdownIsOpen = !this.$scope.$ruiAlmProjectPicker.dropdownIsOpen;
    };

    RuiAlmProjectPickerCtrl.prototype.focusOut = function($event, $projectPickerElement) {
      var _this = this;
      return this.$timeout(function() {
        var activeIsInPicker;
        activeIsInPicker = $.contains($projectPickerElement[0], document.activeElement);
        return _this.$scope.$ruiAlmProjectPicker.dropdownIsOpen = activeIsInPicker;
      });
    };

    RuiAlmProjectPickerCtrl.prototype.setDropdownIsOpen = function(value) {
      return this.$scope.$ruiAlmProjectPicker.dropdownIsOpen = value;
    };

    RuiAlmProjectPickerCtrl.prototype.watchSelectedNode = function(node) {
      return this.$scope.$ruiAlmProjectPicker.triggerText = (node != null ? node.name : void 0) ? node.name : '[no project selected]';
    };

    RuiAlmProjectPickerCtrl.prototype.watchSearchTerm = function(term) {
      return this.$scope.$ruiAlmProjectPicker.isSearching = !!term;
    };

    RuiAlmProjectPickerCtrl.prototype.clearSearch = function() {
      return this.$scope.$ruiAlmProjectPicker.searchTerm = '';
    };

    return RuiAlmProjectPickerCtrl;

  })());

}).call(this);

(function() {
  angular.module('rui.alm.projectPicker.controllers', ['rui.alm.projectPicker.controllers.projectPicker']);

}).call(this);

(function() {
  angular.module('rui.alm.projectPicker.directives', ['rui.alm.projectPicker.directives.projectPicker', 'rui.alm.projectPicker.directives.projectPickerNode', 'rui.alm.projectPicker.directives.projectPickerTree', 'rui.alm.projectPicker.directives.projectPickerContent']);

}).call(this);

/**
 * @ngdoc directive
 * @name rui.alm.projectPicker:ruiAlmProjectPicker
 * @description
 * A project picker
 * @example
		<example module="App">
				<file name="script.js">
						angular.module('App', ['rui.alm.projectPicker'])
						.controller('Ctrl',
							function Ctrl($scope, $filter) { 
								$scope.workspaces = [
									{oid: 'A', name: 'WorkspaceA', isWorkspace: true, children: [{oid: 'A.1', name: 'Project A.1', children:[{oid: 'A.1.a', name: 'Project A.1.a'}]},{oid: 'A.1.b', name: 'Project A.1.b'}]},
									{oid: 'B', name: 'WorkspaceB', isWorkspace: true}
								]

								$scope.state = {
									theSelectedProject: $scope.workspaces[0].children[0]
								}

							}
						);
				</file>
				<file name="index.html">
						<div ng-controller="Ctrl">

							<h3>Default</h3>
							<div>You have selected {{state.theSelectedProject.name}}</div>
							<div rui-alm-project-picker="workspaces" rui-project-picker-open="true" rui-alm-project-picker-selected="state.theSelectedProject"/>

						</div>
				</file>
		</example>
*/


(function() {
  angular.module('rui.alm.projectPicker.directives.projectPicker', ['rui.templates', 'rui.util.bootstrap', 'rui.tree', 'rui.alm.projectPicker.controllers.projectPicker', 'rui.alm.projectPicker.factories.treeBuilder', 'rui.util.element.directives.focusMe']).directive('ruiAlmProjectPickerCtrl', function($parse, ruiAlmProjectPickerTreeBuilder) {
    return {
      restrict: 'EA',
      require: ['ruiAlmProjectPickerCtrl'],
      scope: true,
      controller: 'RuiAlmProjectPickerCtrl',
      link: function($scope, $element, $attrs, _arg) {
        var controller, expression,
          _this = this;
        controller = _arg[0];
        $element.focusout(function($event) {
          return $scope.$apply(function() {
            return controller.focusOut($event, $element);
          });
        });
        if ($attrs.ruiAlmProjectPickerRoot) {
          $scope.$watch($attrs.ruiAlmProjectPickerRoot, function(workspaces) {
            return controller.updateWorkspaces(workspaces);
          });
        } else {
          $scope.$ruiAlmProjectPicker.isLoading = true;
          ruiAlmProjectPickerTreeBuilder.getWorkspaces().then(controller.updateWorkspaces)['finally'](function() {
            return $scope.$ruiAlmProjectPicker.isLoading = false;
          });
        }
        if ($attrs.ruiAlmProjectPickerOpen != null) {
          $scope.$watch($parse($attrs.ruiAlmProjectPickerOpen), controller.setDropdownIsOpen);
        }
        if ($attrs.ruiAlmProjectPickerStartExpanded != null) {
          $scope.$watch($parse($attrs.ruiAlmProjectPickerStartExpanded), function(expanded) {
            return $scope.$ruiAlmProjectPicker.startExpanded = expanded;
          });
        }
        if ($attrs.ruiAlmProjectPickerSelected != null) {
          expression = $parse($attrs.ruiAlmProjectPickerSelected);
          $scope.$watch(expression, controller.selectNode);
          $scope.$watch('$ruiAlmProjectPicker.selectedNode', function(node) {
            return expression.assign($scope, node);
          });
        }
        if ($attrs.ruiAlmProjectPickerThrottleSubTree) {
          $scope.$ruiAlmProjectPicker.throttleSubTree = $scope.$eval($attrs.ruiAlmProjectPickerThrottleSubTree);
        }
        if ($attrs.ruiAlmProjectPickerEagerBuild) {
          return $scope.$ruiAlmProjectPicker.eagerBuild = $scope.$eval($attrs.ruiAlmProjectPickerEagerBuild);
        }
      }
    };
  }).directive('ruiAlmProjectPicker', function() {
    return {
      replace: true,
      templateUrl: 'rui/alm/projectPicker/templates/projectPicker.html',
      scope: true,
      compile: function($element, $attrs) {
        $attrs.$set('ruiAlmProjectPickerRoot', $attrs.ruiAlmProjectPicker);
        if ($attrs.ruiAlmProjectPickerAllowDeselect) {
          return $element.find('.rui-tree').attr('rui-tree-selectable', 'deselect');
        }
      }
    };
  });

}).call(this);

(function() {
  angular.module('rui.alm.projectPicker.directives.projectPickerContent', []).directive('ruiAlmProjectPickerContent', function() {
    return {
      compile: function($element, $attrs) {
        $element.append('<span class="is-workspace" ng-if="$ruiTreeNode.node.isWorkspace">&nbsp;(workspace)</span>');
        return function() {};
      }
    };
  });

}).call(this);

(function() {
  angular.module('rui.alm.projectPicker.directives.projectPickerNode', []).directive('ruiAlmProjectPickerNode', function() {
    return {
      require: ['ruiTreeNodeCtrl'],
      compile: function($element, $attrs) {
        $element.find('.rui-tree-node-content').attr('rui-alm-project-picker-content', '');
        return function() {};
      }
    };
  });

}).call(this);

(function() {
  angular.module('rui.alm.projectPicker.directives.projectPickerTree', []).directive('ruiAlmProjectPickerTree', function() {
    return {
      require: ['ruiTreeCtrl'],
      compile: function($element, $attrs) {
        $element.find('.rui-tree-nodes').attr('rui-alm-project-picker-node', '');
        return function() {};
      }
    };
  });

}).call(this);

(function() {
  angular.module('rui.alm.projectPicker.factories', ['rui.alm.projectPicker.factories.treeBuilder']);

}).call(this);

/**
 * @ngdoc service
 * @name rui.alm.projectPicker:ruiAlmProjectPickerTreeBuilder
 * @description
 * Factory that returns a builder to query wsapi/slm.
 * This will query the stateful ALM endpoints for getting tree data, but will not
*/


(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  angular.module('rui.alm.projectPicker.factories.treeBuilder', ['rui.alm.services.wsapi', 'rui.util.cache', 'rui.util.lodash', 'rui.util.async']).factory('ruiAlmProjectPickerTreeBuilderFactory', function($cacheFactory, $injector, async) {
    var RuiAlmProjectPickerTreeBuilder, defaultCache, factory;
    defaultCache = $cacheFactory('ruiAlmProjectPickerTree');
    RuiAlmProjectPickerTreeBuilder = RuiAlmProjectPickerTreeBuilder = (function() {
      RuiAlmProjectPickerTreeBuilder.CACHE_KEY = '$tree';

      function RuiAlmProjectPickerTreeBuilder(cache, $slm, $wsapi, $log, $cacheWrap, $q, $rootScope, $http) {
        this.cache = cache;
        this.$slm = $slm;
        this.$wsapi = $wsapi;
        this.$log = $log;
        this.$cacheWrap = $cacheWrap;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$http = $http;
        this._onError = __bind(this._onError, this);
        this._setSelectedProject = __bind(this._setSelectedProject, this);
        this._findSelectedProject = __bind(this._findSelectedProject, this);
        this._eachProjectInTree = __bind(this._eachProjectInTree, this);
        this._fetchSelectedProject = __bind(this._fetchSelectedProject, this);
        this._fetchProjectsForWorkspaceUsingOidAndSetCurrentOid = __bind(this._fetchProjectsForWorkspaceUsingOidAndSetCurrentOid, this);
        this._findAProjectOidInAWorkspace = __bind(this._findAProjectOidInAWorkspace, this);
        this._transformProjectsAndReturnWorkspace = __bind(this._transformProjectsAndReturnWorkspace, this);
        this._fetchProjectsForWorkspace = __bind(this._fetchProjectsForWorkspace, this);
        this._buildWorkspaceFromProjects = __bind(this._buildWorkspaceFromProjects, this);
        this._wrapStateful = __bind(this._wrapStateful, this);
        this.sortWorkspaces = __bind(this.sortWorkspaces, this);
        this.getWorkspace = __bind(this.getWorkspace, this);
        this.getWorkspaces = __bind(this.getWorkspaces, this);
        this.get = __bind(this.get, this);
        this._buildCustomParseChain = __bind(this._buildCustomParseChain, this);
        this.$cacheWrap = this.$cacheWrap(this.cache, this.cacheKey);
        this.projectTreeCustomParseChain = this._buildCustomParseChain();
      }

      RuiAlmProjectPickerTreeBuilder.prototype._buildCustomParseChain = function() {
        var projectTreeCustomParseChain;
        projectTreeCustomParseChain = _.map(this.$http.defaults.transformResponse, function(transformer) {
          return transformer;
        });
        projectTreeCustomParseChain.unshift(function(data) {
          return data != null ? typeof data.replace === "function" ? data.replace(/\\\'/g, "'") : void 0 : void 0;
        });
        return projectTreeCustomParseChain;
      };

      RuiAlmProjectPickerTreeBuilder.prototype.cacheKey = function(key) {
        if (key == null) {
          key = "";
        }
        return [RuiAlmProjectPickerTreeBuilder.CACHE_KEY].concat(key.split('.')).join('.');
      };

      RuiAlmProjectPickerTreeBuilder.prototype.get = function() {
        return this.getWorkspaces();
      };

      RuiAlmProjectPickerTreeBuilder.prototype.getWorkspaces = function(resetState) {
        var _this = this;
        if (resetState == null) {
          resetState = true;
        }
        return this.$cacheWrap('workspaces', function() {
          return _this._wrapStateful(function() {
            var params;
            params = {
              start: 1,
              pagesize: 200,
              query: '(State = "Open")',
              fetch: 'Name,ObjectID',
              workspace: 'null'
            };
            return _this.$wsapi.get("/workspace", {
              cache: _this.cache,
              params: params
            }).then(function(_arg) {
              var data;
              data = _arg.data;
              return data.QueryResult.Results;
            }, _this._onError).then(function(workspaces) {
              return _this.$q.all(_.map(workspaces, function(workspace) {
                return _this.getWorkspace(workspace, false);
              }));
            });
          }, resetState).then(_this.sortWorkspaces);
        });
      };

      RuiAlmProjectPickerTreeBuilder.prototype.getWorkspace = function(workspace, resetState) {
        var _this = this;
        if (resetState == null) {
          resetState = true;
        }
        return this.$cacheWrap("workspace." + workspace.ObjectID, function() {
          return _this._wrapStateful(function() {
            return _this._fetchProjectsForWorkspace(workspace).then(function(projects) {
              return _this._buildWorkspaceFromProjects(workspace, projects);
            });
          }, resetState);
        });
      };

      RuiAlmProjectPickerTreeBuilder.prototype.sortWorkspaces = function(workspaces) {
        return this.$q.when(_.sortBy(workspaces, 'name'));
      };

      RuiAlmProjectPickerTreeBuilder.prototype._wrapStateful = function(func, resetState) {
        var _this = this;
        if (resetState == null) {
          resetState = true;
        }
        if (!resetState) {
          return this.$q.when(func());
        }
        return this._fetchSelectedProject().then(function(selectedProject) {
          var funcPromise;
          funcPromise = _this.$q.when(func());
          funcPromise['finally'](function() {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return _this._setSelectedProject(selectedProject != null ? selectedProject.oid : void 0).then(function() {
              var _ref;
              return (_ref = _this.$q).when.apply(_ref, args);
            });
          });
          return funcPromise.then(function() {
            var args, _ref;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return (_ref = _this.$q).when.apply(_ref, args);
          });
        });
      };

      RuiAlmProjectPickerTreeBuilder.prototype._buildWorkspaceFromProjects = function(workspace, projects) {
        workspace = {
          oid: workspace.ObjectID,
          workspaceOid: workspace.ObjectID,
          name: workspace.Name,
          isWorkspace: true
        };
        return this._transformProjectsAndReturnWorkspace(workspace, projects);
      };

      RuiAlmProjectPickerTreeBuilder.prototype._fetchProjectsForWorkspace = function(workspace) {
        var _this = this;
        return this._findAProjectOidInAWorkspace(workspace).then(function(projectOidInWorkspace) {
          return _this._fetchProjectsForWorkspaceUsingOidAndSetCurrentOid(projectOidInWorkspace);
        });
      };

      RuiAlmProjectPickerTreeBuilder.prototype._transformProjectsAndReturnWorkspace = function(workspace, rootProjectNodes) {
        var deferred,
          _this = this;
        workspace.children = rootProjectNodes;
        if (workspace.children == null) {
          workspace.children = [];
        }
        if ((rootProjectNodes != null ? rootProjectNodes.length : void 0) > 0) {
          deferred = this.$q.defer();
          this._eachProjectInTree(workspace, rootProjectNodes, function(parent, project, callback) {
            project.workspaceOid = workspace.oid;
            project.parentOid = parent != null ? parent.oid : void 0;
            return callback();
          }, function(selectedProject) {
            deferred.resolve(workspace);
            if (!_this.$rootScope.$$phase) {
              return _this.$rootScope.$digest();
            }
          });
          return deferred.promise;
        } else {
          return this.$q.when(workspace);
        }
      };

      RuiAlmProjectPickerTreeBuilder.prototype._findAProjectOidInAWorkspace = function(workspace) {
        var params,
          _this = this;
        if ((workspace != null ? workspace._ref : void 0) == null) {
          return this.$q.reject('Workspace with _ref is required');
        }
        params = {
          start: 1,
          pagesize: 1,
          fetch: 'ObjectID',
          workspace: workspace._ref
        };
        return this.$wsapi.get("/project", {
          cache: this.cache,
          params: params
        }).then(function(_arg) {
          var data, message, projectOidInWorkspace;
          data = _arg.data;
          if (data.QueryResult.Results.length !== 1) {
            message = 'Unexpected results retrieving a project from workspace';
            _this.$log.error(message, workspace, data);
            return _this.$q.reject(message);
          } else {
            projectOidInWorkspace = data.QueryResult.Results[0].ObjectID;
            return projectOidInWorkspace;
          }
        }, this._onError);
      };

      RuiAlmProjectPickerTreeBuilder.prototype._fetchProjectsForWorkspaceUsingOidAndSetCurrentOid = function(projectOidInWorkspace) {
        var options;
        options = {
          cache: this.cache,
          transformResponse: this.projectTreeCustomParseChain
        };
        if (projectOidInWorkspace != null) {
          options.params = {
            cpoid: projectOidInWorkspace
          };
        }
        return this.$slm.get("/pjt/build.sp", options).then(function(_arg) {
          var data;
          data = _arg.data;
          return data;
        }, this._onError);
      };

      RuiAlmProjectPickerTreeBuilder.prototype._fetchSelectedProject = function() {
        return this._fetchProjectsForWorkspaceUsingOidAndSetCurrentOid().then(this._findSelectedProject);
      };

      RuiAlmProjectPickerTreeBuilder.prototype._eachProjectInTree = function(parent, projectNodes, projectIterator, callback) {
        var _this = this;
        return async.eachSeries(projectNodes, function(project, projectCompleteCallback) {
          return projectIterator(parent, project, function(err) {
            if (err != null) {
              return projectCompleteCallback(err);
            } else if (project != null ? project.children : void 0) {
              return _this._eachProjectInTree(project, project.children, projectIterator, projectCompleteCallback);
            } else {
              return projectCompleteCallback();
            }
          });
        }, callback);
      };

      RuiAlmProjectPickerTreeBuilder.prototype._findSelectedProject = function(rootProjectNodes) {
        var deferred,
          _this = this;
        if (rootProjectNodes != null ? rootProjectNodes.length : void 0) {
          deferred = this.$q.defer();
          this._eachProjectInTree(null, rootProjectNodes, function(parent, project, callback) {
            if (project.selected) {
              return callback(project);
            } else {
              return callback();
            }
          }, function(selectedProject) {
            deferred.resolve(selectedProject);
            if (!_this.$rootScope.$$phase) {
              return _this.$rootScope.$digest();
            }
          });
          return deferred.promise;
        } else {
          return this.$q.when();
        }
      };

      RuiAlmProjectPickerTreeBuilder.prototype._setSelectedProject = function(selectedProjectOid) {
        return this._fetchProjectsForWorkspaceUsingOidAndSetCurrentOid(selectedProjectOid);
      };

      RuiAlmProjectPickerTreeBuilder.prototype._onError = function(_arg) {
        var config, data, headers, status;
        data = _arg.data, status = _arg.status, headers = _arg.headers, config = _arg.config;
        this.$log.error("url: " + config.url + " Error. Data, status", data, status);
        return this.$q.when.apply(this, arguments);
      };

      return RuiAlmProjectPickerTreeBuilder;

    })();
    factory = function(locals) {
      if (locals == null) {
        locals = {};
      }
      locals = _.pick(locals, 'cache');
      if (locals.cache == null) {
        locals.cache = defaultCache;
      }
      return $injector.instantiate(RuiAlmProjectPickerTreeBuilder, locals);
    };
    factory.defaultCache = defaultCache;
    return factory;
  }).factory('ruiAlmProjectPickerTreeBuilder', function(ruiAlmProjectPickerTreeBuilderFactory) {
    return ruiAlmProjectPickerTreeBuilderFactory();
  });

}).call(this);

(function() {
  angular.module('rui.alm.projectPicker', ['rui.alm.projectPicker.factories', 'rui.alm.projectPicker.directives', 'rui.alm.projectPicker.controllers']);

}).call(this);

(function() {
  angular.module('rui.alm.services', ['rui.alm.services.slm', 'rui.alm.services.wsapi']);

}).call(this);

/**
 * @ngdoc service
 * @name rui.alm.services:$slm
 * @description
 * @example
*/


(function() {
  angular.module('rui.alm.services.slm', ['rui.util.http']).provider('$slm', function() {
    var _this = this;
    this.baseUrl = '/slm/';
    this.setBaseUrl = function(baseUrl) {
      _this.baseUrl = baseUrl;
    };
    this.$get = function(ruiHttpWrapper) {
      return ruiHttpWrapper(_this.baseUrl);
    };
    return this;
  });

}).call(this);

/**
 * @ngdoc service
 * @name rui.alm.services:$wsapi
 * @description
 * Abstracts $http calls to a wsapi base url. Can be configured at config/provider time to use a particular base url.
 * @example
		<example module="App">
				<file name="script.js">
						angular.module('App', ['rui.alm.services.wsapi'])
						.config(function($wsapiProvider){
							$wsapiProvider.setBaseUrl('/test/');
						})
						.controller('Ctrl',
							function Ctrl($scope, $httpBackend, $wsapi) {
								$scope.$wsapi = $wsapi;
								console.log('backend', $httpBackend)
								console.log('backend.whenGET', $httpBackend.whenGET)
								$httpBackend.whenGET('/test/sub/url').respond(200, {foo: 'bar'});
								$wsapi({method: 'GET', url: '/sub/url/'}).then(function(data, status){
									$scope.data = data
									$scope.status = status
								});
							}
						);
				</file>
				<file name="index.html">
						<div ng-controller="Ctrl">
							<div>Wsapi base url: {{$wsapi.baseUrl}}</div>
							<div>data: {{data}}</div>
							<div>status: {{status}}</div>
						</div>
				</file>
		</example>
*/


(function() {
  angular.module('rui.alm.services.wsapi', ['rui.alm.services.slm', 'rui.util.http']).provider('$wsapi', function() {
    var _this = this;
    this.baseUrl = '/webservice/v2.0/';
    this.setBaseUrl = function(baseUrl) {
      _this.baseUrl = baseUrl;
    };
    this.$get = function(ruiHttpWrapper, $slm) {
      return ruiHttpWrapper(_this.baseUrl, $slm);
    };
    return this;
  });

}).call(this);

(function() {
  var cardboard;

  cardboard = angular.module('rui.cardboard', ['rui.templates', 'rui.cardboard.directives.cardboard', 'rui.cardboard.directives.column', 'rui.cardboard.directives.card', 'rui.cardboard.directives.columnscrollable', 'rui.cardboard.directives.columnscrollbars', 'rui.cardboard.filters.wip']);

}).call(this);

(function() {
  var CardCtrl, module;

  module = angular.module('rui.cardboard.controllers.card', []);

  module.controller('rui.cardboard.controllers.card', CardCtrl = (function() {
    CardCtrl.$inject = ['$scope', '$attrs'];

    function CardCtrl($scope, $attrs) {
      var _this = this;
      this.$scope = $scope;
      this.$card = this.$scope.$card = this.$scope.$new();
      if ($attrs.ruiCardColor) {
        $attrs.$observe('ruiCardColor', function(color) {
          return _this.$card.color = color;
        });
      }
    }

    return CardCtrl;

  })());

}).call(this);

(function() {
  var CardboardCtrl, module;

  module = angular.module('rui.cardboard.controllers.cardboard', []);

  module.controller('rui.cardboard.controllers.cardboard', CardboardCtrl = (function() {
    CardboardCtrl.$inject = ['$timeout'];

    function CardboardCtrl($timeout) {
      this.$timeout = $timeout;
      this.columns = [];
      this.columnWidth = 0;
    }

    CardboardCtrl.prototype._adjustColumns = function() {
      var _this = this;
      this.columnWidth = 100 / this.columns.length;
      return angular.forEach(this.columns, function(column) {
        return column.width = "" + _this.columnWidth + "%";
      });
    };

    /**
    * @ngdoc function
    * @name rui.cardboard.controllers.cardboard#addColumn
    * @methodOf rui.cardboard.directives:ruiCardboard
    * @param {Object} scope The column's scope
    * @description
    * This should be called by a column within a cardboard. This method will tie a column and cardboard together.
    * This method will eventually coordinate the width of each column within the cardboard
    */


    CardboardCtrl.prototype.addColumn = function(column) {
      var _this = this;
      this.columns.push(column);
      column.cardboard = this;
      if (this.adjustTimer) {
        this.$timeout.cancel(this.adjustTimer);
      }
      return this.adjustTimer = this.$timeout(function() {
        return _this._adjustColumns();
      });
    };

    /**
    * @ngdoc function
    * @name rui.cardboard.controllers.cardboard#removeColumn
    * @methodOf rui.cardboard.directives:ruiCardboard
    * @param {Object} scope The column's scope
    * @description
    * This should be called by a column within a cardboard. This method will remove the column from the columns
    * tracked by the cardboard.
    * This method will eventually coordinate the width of each column within the cardboard
    */


    CardboardCtrl.prototype.removeColumn = function(column) {
      var _this = this;
      this.columns = _.filter(this.columns, function(col) {
        return col !== column;
      });
      if (this.adjustTimer) {
        this.$timeout.cancel(this.adjustTimer);
      }
      return this.adjustTimer = this.$timeout(function() {
        return _this._adjustColumns();
      });
    };

    return CardboardCtrl;

  })());

}).call(this);

(function() {
  var ColumnCtrl, module;

  module = angular.module('rui.cardboard.controllers.column', []);

  module.controller('rui.cardboard.controllers.column', ColumnCtrl = (function() {
    function ColumnCtrl() {}

    /**
    * @ngdoc function
    * @name rui.cardboard.controllers.column#addCard
    * @methodOf rui.cardboard.directives:ruiColumn
    * @param {Object} scope The card's scope
    * @description
    * This should be called by a card within a column when a card is rendered. This method will tie a card and column together
    */


    ColumnCtrl.prototype.addCard = function(card) {
      return card.column = this;
    };

    /**
    * @ngdoc function
    * @name rui.cardboard.controllers.column#removeCard
    * @methodOf rui.cardboard.directives:ruiColumn
    * @param {Object} scope The card's scope
    * @description
    * This should be called by a card within a column when a card is removed
    */


    ColumnCtrl.prototype.removeCard = function(card) {};

    return ColumnCtrl;

  })());

}).call(this);

(function() {
  var ColumnScrollableCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.cardboard.controllers.columnscrollable', []).controller('rui.cardboard.controllers.columnscrollable', ColumnScrollableCtrl = (function() {
    ColumnScrollableCtrl.prototype.currentIndex = 0;

    ColumnScrollableCtrl.prototype.scrollableColumns = [];

    ColumnScrollableCtrl.prototype.numColumns = 3;

    ColumnScrollableCtrl.prototype.columns = [];

    ColumnScrollableCtrl.$inject = ['$scope', '$attrs'];

    function ColumnScrollableCtrl($scope, $attrs) {
      this.scrollLeft = __bind(this.scrollLeft, this);
      this.scrollRight = __bind(this.scrollRight, this);
      var columns, columnsProp,
        _this = this;
      columnsProp = $attrs.ruiColumnScrollable;
      if ($attrs.numColumns) {
        this.numColumns = +$attrs.numColumns;
      }
      columns = $scope.$eval(columnsProp);
      if (columns != null ? columns.length : void 0) {
        this.initColumns(columns);
      }
      this.columnsWatchListener = $scope.$watch("" + columnsProp + ".length", function(newValue, oldValue) {
        if (oldValue === void 0 || newValue > oldValue) {
          _this.initColumns($scope.$eval(columnsProp));
        }
        if (oldValue === void 0 || newValue < oldValue) {
          return _this.columnsWatchListener();
        }
      });
    }

    ColumnScrollableCtrl.prototype.initColumns = function(columns) {
      this.columns = columns;
      this.scrollableColumns = [].concat(this.columns);
      return this.scrollColumns();
    };

    /**
    * @ngdoc function
    * @name rui.cardboard.controllers.columnscrollable#scrollRight
    * @methodOf rui.cardboard.directives:ruiColumnScrollable
    * @description
    * This method will scroll the visible columns to the right
    */


    ColumnScrollableCtrl.prototype.scrollRight = function() {
      this.currentIndex++;
      return this.scrollColumns();
    };

    /**
    * @ngdoc function
    * @name rui.cardboard.controllers.columnscrollable#scrollLeft
    * @methodOf rui.cardboard.directives:ruiColumnScrollable
    * @description
    * This method will scroll the visible columns to the left
    */


    ColumnScrollableCtrl.prototype.scrollLeft = function() {
      this.currentIndex--;
      return this.scrollColumns();
    };

    ColumnScrollableCtrl.prototype.scrollColumns = function() {
      var _this = this;
      this.columns.length = 0;
      return _.each(this.scrollableColumns.slice(this.currentIndex, this.currentIndex + this.numColumns), function(column, index, columns) {
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

  })());

}).call(this);

(function() {
  var module;

  module = angular.module('rui.cardboard.directives.card', ['rui.cardboard.directives.column', 'rui.cardboard.controllers.card']);

  /**
  * @ngdoc directive
  * @name rui.cardboard.directives:ruiCard
  * @restrict EA
  * @param {string} ngModel An object on the current scope that should be managed by this directive
  * @param {expression=} ruiCardColor An angular expression that represents a color
  * @description
  * This component is meant to go in the column-content section of an {@link api/rui.cardboard.directives:ruiColumn ruiColumn}
  * This component will add a new scope represented by `$card`
  *
  * @example
    <example module="App">
      <file name="script.js">
        angular.module('App', ['rui.cardboard'])
        .controller('Ctrl',
          function Ctrl($scope) {
            $scope.card = {
              avatarUrl: 'https://www.tomtom.com/en_gb/images/homer_morevoices_tcm131-16571.gif',
              name: 'Card 1',
              ownerName: 'Bart',
              formattedId: 'US123'
            };
          }
        );
      </file>
      <file name="index.html">
        <div ng-controller="Ctrl">
          <rui-card ng-model="card" rui-card-color="red">
            <div class="avatar">
              <img class="small" ng-src="{{ card.avatarUrl }}"/>
            </div>
            <div class="card-owner">{{ card.ownerName }}</div>
            <div class="card-id">
              <span class="icon icon-story" class="icon-story"></span>
              {{ card.formattedId }}
            </div>
            <div class="card-field">{{ card.name }}</div>
          </rui-card>
        </div>
      </file>
    </example>
  */


  module.directive('ruiCard', function() {
    return {
      restrict: 'EA',
      transclude: true,
      replace: true,
      require: ['ngModel', '^?ruiColumn'],
      templateUrl: 'rui/cardboard/template/rui-card.html',
      controller: 'rui.cardboard.controllers.card',
      compile: function(tElement, tAttrs, transcludeFn) {
        return function(scope, element, attrs, _arg) {
          var card, columnCtrl, ngModel;
          ngModel = _arg[0], columnCtrl = _arg[1];
          card = scope.$eval(attrs.ngModel);
          if (columnCtrl != null) {
            columnCtrl.addCard(card);
          }
          scope.$emit('cardrendered', card);
          return element.on('$destroy', function() {
            return columnCtrl != null ? columnCtrl.removeCard(card) : void 0;
          });
        };
      }
    };
  });

}).call(this);

(function() {
  var cardboard;

  cardboard = angular.module('rui.cardboard.directives.cardboard', ['rui.cardboard.controllers.cardboard']);

  /**
  * @ngdoc directive
  * @name rui.cardboard.directives:ruiCardboard
  * @restrict EA
  * @description
  * The parent cardboard directive - it coordinates column and card directives
  * @example
    <example module="App">
      <file name="script.js">
        angular.module('App', ['rui.cardboard', 'rui.sortable'])
        .controller('Ctrl',
          function Ctrl($scope) {
            $scope.columns = [
              {
                title: "On Deck",
                wip: 2,
                cards: [
                  {
                    formattedId: 'DE23',
                    type: 'defect',
                    name: 'Card 1',
                    ownerName: 'Homer',
                    avatarUrl: 'https://www.tomtom.com/en_gb/images/homer_morevoices_tcm131-16571.gif'
                  }
                ]
              },
              {
                title: "Ready To Pull",
                wip: 1,
                cards: [
                  {
                    formattedId: 'US123',
                    type: 'story',
                    name: 'Card 2',
                    ownerName: 'Bart',
                    color: '#00A9E0',
                    avatarUrl: 'http://images3.wikia.nocookie.net/__cb20100530014758/lossimpson/es/images/thumb/6/65/Bart_Simpson.png/170px-Bart_Simpson.png'
                  }
                ]
              },
              {
                title: "In Progress",
                wip: 1,
                cards: []
              },
              {
                title: "Testing",
                wip: 1,
                cards: []
              }
            ];
  
            $scope.scrollOptions = {
              connectWith: '.column-content',
              placeholder: 'card-placeholder'
            }
          }
        );
      </file>
      <file name="index.html">
        <div ng-controller="Ctrl">
          <rui-cardboard>
            <rui-column ng-repeat="column in columns" ng-model="column" rui-column-scrollable="columns" num-columns="3" ng-class="{'over-capacity': column.wip > 0 && column.cards.length > column.wip}">
              <div class="column-header">
                <div rui-column-scrollbars ng-model="column"></div>
                <h3 class="title">{{column.title}}</h3>
                <div class="wip">{{column.cards.length}} of {{column.wip | wip}}</div>
              </div>
              <div class="column-content" rui-sortable="scrollOptions" ng-model="column.cards">
                <rui-card ng-repeat="card in column.cards" color="card.color" ng-model="card">
                  <div class="avatar">
                    <img class="small" ng-src="{{ card.avatarUrl }}"/>
                  </div>
                  <div class="card-owner">{{ card.ownerName }}</div>
                  <div class="card-id">
                    <span class="icon icon-story" ng-class="'icon-'+card.type"></span>
                    {{ card.formattedId }}
                  </div>
                  <div class="card-field">{{card.name}}</div>
                </rui-card>
              </div>
            </rui-column>
          </rui-cardboard>
        </div>
      </file>
    </example>
  */


  cardboard.directive('ruiCardboard', function() {
    return {
      restrict: 'EA',
      transclude: true,
      replace: true,
      controller: 'rui.cardboard.controllers.cardboard',
      templateUrl: 'rui/cardboard/template/rui-cardboard.html',
      compile: function(tElement, tAttrs) {
        return function(scope, element, attrs, controller) {};
      }
    };
  });

}).call(this);

(function() {
  var column;

  column = angular.module('rui.cardboard.directives.column', ['rui.cardboard.controllers.column', 'rui.cardboard.directives.cardboard']);

  /**
  * @ngdoc directive
  * @name rui.cardboard.directives:ruiColumn
  * @param {string} ngModel An object on the current scope that should be managed by this directive
  * @restrict EA
  * @description
  * The column directive adds a column
  * @example
    <example module="App">
      <file name="script.js">
        angular.module('App', ['rui.cardboard', 'rui.sortable'])
        .controller('Ctrl',
          function Ctrl($scope) {
            $scope.column = {
              title: 'Column Title',
              wip: 1
            };
          }
        );
      </file>
      <file name="index.html">
        <div ng-controller="Ctrl">
          <rui-cardboard><!-- a column is meant to be in a cardboard -->
            <rui-column ng-model="column">
              <div class="column-header">
                <h3 class="title">{{ column.title }}</h3>
                <div class="wip">0 of {{ column.wip }}</div>
              </div>
              <div class="column-content">
                <!-- cards go here -->
              </div>
            </rui-column>
          </rui-cardboard>
        </div>
      </file>
    </example>
  */


  column.directive('ruiColumn', function() {
    return {
      restrict: 'EA',
      transclude: true,
      require: ['ngModel', '^?ruiCardboard'],
      replace: true,
      templateUrl: 'rui/cardboard/template/rui-column.html',
      controller: 'rui.cardboard.controllers.column',
      compile: function(tElement, tAttr, transcludeFn) {
        return function(scope, element, attrs, _arg) {
          var cardboardCtrl, ngModel;
          ngModel = _arg[0], cardboardCtrl = _arg[1];
          column = scope.$eval(attrs.ngModel);
          if (cardboardCtrl != null) {
            cardboardCtrl.addColumn(column);
          }
          return element.on('$destroy', function() {
            return cardboardCtrl != null ? cardboardCtrl.removeColumn(column) : void 0;
          });
        };
      }
    };
  });

}).call(this);

(function() {
  var module;

  module = angular.module('rui.cardboard.directives.columnscrollable', ['rui.cardboard.controllers.columnscrollable']);

  /**
  * @ngdoc directive
  * @name rui.cardboard.directives:ruiColumnScrollable
  * @restrict A
  * @param {string} ngModel An array variable on the current scope that should be managed by this directive
  * @description
  * This directive allows an {@link api/rui.cardboard.directives:ruiColumn ruiColumn} directive to
  *   become scrollable if there are too many columns to display
  */


  module.directive('ruiColumnScrollable', function() {
    return {
      restrict: 'A',
      /*
      Make this a high priority
      It needs to be run before any other directive is run since it changes the model property
      that is set to this directive
      */

      priority: 100000,
      controller: 'rui.cardboard.controllers.columnscrollable'
    };
  });

}).call(this);

(function() {
  var columnscrollbars;

  columnscrollbars = angular.module('rui.cardboard.directives.columnscrollbars', ['rui.cardboard.directives.column']);

  /**
  * @ngdoc directive
  * @name rui.cardboard.directives:ruiColumnScrollbars
  * @restrict A
  * @description
  * This directive is a simple component to show scrollbars.
  * It is meant to be used with the {@link rui.cardboard.directives:ruiColumnScrollable ruiColumnScrollable}
  *   directive. It should be used in the content-header of an {@link api/rui.cardboard.directives:ruiColumn ruiColumn}
  */


  columnscrollbars.directive('ruiColumnScrollbars', function() {
    return {
      restrict: 'A',
      require: ['ngModel', '^ruiColumn'],
      templateUrl: 'rui/cardboard/template/rui-column-scrollbars.html',
      compile: function(tElement, tAttrs) {
        return function(scope, element, attrs, controllers) {
          var columnCtrl, model;
          model = controllers[0], columnCtrl = controllers[1];
          return scope.model = scope.$eval(attrs.ngModel);
        };
      }
    };
  });

}).call(this);

(function() {
  angular.module('rui.cardboard.filters.wip', []).filter('wip', function() {
    return function(input) {
      if (input === 0) {
        return '∞';
      } else {
        return input;
      }
    };
  });

}).call(this);

(function() {
  var DropdownCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.dropdown.directives.controllers.dropdown', []).controller('DropdownCtrl', DropdownCtrl = (function() {
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

    DropdownCtrl.prototype.select = function(value) {
      if (!this.$dropdown.isDisabled) {
        this.$dropdown.selected = value;
        this.toggleOpen(false);
        return true;
      } else {
        return false;
      }
    };

    DropdownCtrl.prototype.toggleOpen = function(open) {
      if (open == null) {
        open = !this.$dropdown.isOpen;
      }
      return this.$dropdown.isOpen = open;
    };

    DropdownCtrl.prototype.onBlur = function(e) {
      return this.$dropdown.isOpen = false;
    };

    return DropdownCtrl;

  })());

}).call(this);

(function() {
  var ItemCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.dropdown.directives.controllers.item', []).controller('ItemCtrl', ItemCtrl = (function() {
    ItemCtrl.$inject = ['$scope'];

    function ItemCtrl($scope) {
      this.$scope = $scope;
      this.select = __bind(this.select, this);
      this.$dropdownItem = this.$scope.$dropdownItem = this.$scope.$new();
      this.$dropdownItem.isSelected = false;
      this.$dropdownItem.select = this.select;
      this.$dropdownItem.value = null;
    }

    ItemCtrl.prototype.select = function() {
      if (!this.$dropdownItem.isDisabled) {
        return this.$dropdownItem.isSelected = this.$dropdownItem.selectItem(this.$dropdownItem.value);
      }
    };

    return ItemCtrl;

  })());

}).call(this);

/**
 * @ngdoc directive
 * @name rui.dropdown.directives:ruiDropdown
 * @description
 * Container for rui dropdown menus
 * @example
    <example module="App">
        <file name="script.js">
            angular.module('App', ['rui.dropdown'])
            .controller('Ctrl',
              function Ctrl($scope) {
                $scope.options = [
                  {name: 'Option1'},
                  {name: 'Option2'}
                ];
              }
            );
        </file>
        <file name="index.html">
            <div ng-controller="Ctrl">              
              <div rui-dropdown ng-model="selectedOption">
                <div rui-dropdown-label>{{selectedOption.name}}</div>
                <ul rui-dropdown-menu>
                  <li rui-dropdown-item ng-repeat="option in options" ng-model="option" ng-bind="option.name">
                </ul>
              </div>
            </div>
        </file>
    </example>
*/


(function() {
  var module;

  module = angular.module('rui.dropdown.directives.dropdown', ['rui.dropdown.directives.controllers.dropdown']).directive('ruiDropdown', [
    function() {
      return {
        restrict: 'EA',
        controller: 'DropdownCtrl',
        require: ['ngModel'],
        transclude: 'true',
        scope: true,
        replace: true,
        templateUrl: 'rui/dropdown/templates/dropdown.html',
        compile: function(tElement, tAttrs, transcludeFn) {
          tElement.addClass('rui-dropdown');
          if (!tElement.attr('tabindex')) {
            tElement.attr('tabindex', 0);
          }
          return function(scope, element, attrs, _arg) {
            var ngModel;
            ngModel = _arg[0];
            scope.$watch('$dropdown.isOpen', function(isOpen) {
              if (isOpen) {
                return $(element).focus();
              }
            });
            $(element).blur(function(e) {
              return scope.$apply(function() {
                return scope.$dropdown.onBlur(e);
              });
            });
            attrs.$observe('disabled', function(isDisabled) {
              return scope.$dropdown.isDisabled = isDisabled;
            });
            scope.$watch('$dropdown.selected', function(value) {
              return ngModel.$setViewValue(value);
            });
            scope.$watch((function() {
              return ngModel.$modelValue;
            }), function(value) {
              return scope.$dropdown.value = value;
            });
            return transcludeFn(scope, function(clone) {
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
    }
  ]);

}).call(this);

/**
 * @ngdoc directive
 * @name rui.dropdown.directives:ruiDropdownItem
 * @description
 * Denotes a selectable item from the dropdown menu
*/


(function() {
  var dropdown;

  dropdown = angular.module('rui.dropdown.directives.item', ['rui.dropdown.directives.controllers.item']).directive('ruiDropdownItem', [
    function() {
      return {
        restrict: 'EA',
        controller: 'ItemCtrl',
        require: ['ngModel', '^ruiDropdown'],
        transclude: 'true',
        scope: true,
        replace: true,
        templateUrl: 'rui/dropdown/templates/dropdown-item.html',
        compile: function(tElement, tAttrs, transcludeFn) {
          tElement.addClass('rui-dropdown-item');
          return function(scope, element, attrs, _arg) {
            var dropdownController, ngModel;
            ngModel = _arg[0], dropdownController = _arg[1];
            scope.$watch((function() {
              return ngModel.$modelValue;
            }), function(value) {
              return scope.$dropdownItem.value = value;
            });
            scope.$dropdownItem.selectItem = dropdownController.select;
            dropdownController.$dropdown.$watch('selected', function(value) {
              return scope.$dropdownItem.isSelected = value === scope.$dropdownItem.value;
            });
            attrs.$observe('disabled', function(isDisabled) {
              return scope.$dropdownItem.isDisabled = isDisabled;
            });
            return transcludeFn(scope, function(clone) {
              return element.append(clone);
            });
          };
        }
      };
    }
  ]);

}).call(this);

(function() {
  var dropdown;

  dropdown = angular.module('rui.dropdown', ['rui.templates', 'rui.dropdown.directives.dropdown', 'rui.dropdown.directives.item']);

}).call(this);

(function() {
  angular.module('rui.forms', ['rui.forms.input', 'rui.forms.select']);

}).call(this);

(function() {
  angular.module('rui.forms.input', ['rui.forms.input.services', 'rui.forms.input.number', 'rui.forms.input.pattern']);

}).call(this);

(function() {
  angular.module('rui.forms.input.number.controllers', ['rui.forms.input.number.controllers.number', 'rui.forms.input.number.controllers.percentage']);

}).call(this);

(function() {
  var InputNumberCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.forms.input.number.controllers.number', ['rui.forms.input.number.services.number']).controller('InputNumberCtrl', InputNumberCtrl = (function() {
    InputNumberCtrl.numericRegEx = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

    function InputNumberCtrl($scope, $timeout, InputNumberService) {
      var _base;
      this.$scope = $scope;
      this.$timeout = $timeout;
      this.InputNumberService = InputNumberService;
      this.validate = __bind(this.validate, this);
      this.parse = __bind(this.parse, this);
      this.format = __bind(this.format, this);
      this.step = __bind(this.step, this);
      this.stepKey = __bind(this.stepKey, this);
      this.blur = __bind(this.blur, this);
      this.blurCheckLeadingZeros = __bind(this.blurCheckLeadingZeros, this);
      this.blurCheckTrim = __bind(this.blurCheckTrim, this);
      this.blurCheckEmpty = __bind(this.blurCheckEmpty, this);
      this.setValue = __bind(this.setValue, this);
      if ((_base = this.$scope).$inputNumber == null) {
        _base.$inputNumber = {};
      }
      this.$scope.$inputNumber.step = this.step;
      this.validityKey = 'Numeric';
    }

    InputNumberCtrl.prototype.setValue = function(value) {
      this.$scope.$inputNumber.ngModel.$setViewValue(value);
      return this.$scope.$inputNumber.ngModel.$render();
    };

    InputNumberCtrl.prototype.blurCheckEmpty = function(e) {
      var viewValue,
        _this = this;
      viewValue = this.$scope.$inputNumber.ngModel.$viewValue;
      if (viewValue === '' && (this.$scope.$inputNumber.emptyDefault != null)) {
        return this.$scope.$apply(function() {
          return _this.setValue(_this.$scope.$inputNumber.emptyDefault);
        });
      }
    };

    InputNumberCtrl.prototype.blurCheckTrim = function(e) {
      var inputValue, target,
        _this = this;
      target = $(e.target);
      inputValue = target.val();
      if (inputValue.trim() !== inputValue) {
        return this.$scope.$apply(function() {
          return target.val(inputValue.trim());
        });
      }
    };

    InputNumberCtrl.prototype.blurCheckLeadingZeros = function(e) {
      var trimmed, viewValue,
        _this = this;
      viewValue = "" + this.$scope.$inputNumber.ngModel.$viewValue;
      if (viewValue.indexOf('0') === 0) {
        trimmed = ("" + viewValue).replace(/^(-)?0+(?=\d)/, "$1");
        return this.$scope.$apply(function() {
          return _this.setValue(trimmed);
        });
      }
    };

    InputNumberCtrl.prototype.blur = function(e) {
      this.blurCheckEmpty(e);
      this.blurCheckTrim(e);
      return this.blurCheckLeadingZeros(e);
    };

    InputNumberCtrl.prototype.stepKey = function(e) {
      var handler,
        _this = this;
      if (e.keyCode === 38) {
        handler = function() {
          return _this.step(+1);
        };
      }
      if (e.keyCode === 40) {
        handler = function() {
          return _this.step(+(-1));
        };
      }
      if (handler) {
        this.$timeout(function() {
          return _this.$scope.$apply(handler);
        });
        e.preventDefault();
        return false;
      }
      return true;
    };

    InputNumberCtrl.prototype.step = function(upOrDown) {
      var increment, value, viewValue;
      if (this.$scope.$inputNumber.isDisabled) {
        return;
      }
      increment = parseFloat(upOrDown * this.$scope.$inputNumber.stepValue);
      viewValue = parseFloat(this.$scope.$inputNumber.ngModel.$viewValue);
      if ((viewValue != null) && !isNaN(viewValue)) {
        value = viewValue + increment;
        value = _.min([this.$scope.$inputNumber.maxValue, value]);
        value = _.max([this.$scope.$inputNumber.minValue, value]);
      } else {
        value = 0;
        if (upOrDown === 1 && (this.$scope.$inputNumber.minValue != null)) {
          value = this.$scope.$inputNumber.minValue;
        }
        if (upOrDown === -1 && (this.$scope.$inputNumber.maxValue != null)) {
          value = this.$scope.$inputNumber.maxValue;
        }
      }
      return this.setValue(value);
    };

    InputNumberCtrl.prototype.format = function(value) {
      return this.validate(value);
    };

    InputNumberCtrl.prototype.parse = function(value) {
      return this.validate(value);
    };

    InputNumberCtrl.prototype.validate = function(value) {
      var isValidNumber, number;
      isValidNumber = this.InputNumberService.isValidNumber(value);
      number = this.InputNumberService.toFloat(value);
      this.$scope.$inputNumber.ngModel.$setValidity(this.validityKey, isValidNumber);
      if (isValidNumber) {
        return number;
      } else {
        return void 0;
      }
    };

    return InputNumberCtrl;

  })());

}).call(this);

(function() {
  var InputNumberPercentageCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.forms.input.number.controllers.percentage', ['rui.forms.input.number.services.number']).controller('InputNumberPercentageCtrl', InputNumberPercentageCtrl = (function() {
    function InputNumberPercentageCtrl($scope, InputNumberService) {
      var _base, _base1;
      this.$scope = $scope;
      this.InputNumberService = InputNumberService;
      this.format = __bind(this.format, this);
      this.parse = __bind(this.parse, this);
      this.validate = __bind(this.validate, this);
      if ((_base = this.$scope).$inputNumber == null) {
        _base.$inputNumber = {};
      }
      if ((_base1 = this.$scope.$inputNumber).precision == null) {
        _base1.precision = 2;
      }
      this.validityKey = 'PercentagePrecision';
    }

    InputNumberPercentageCtrl.prototype.validate = function(value, precision, formatter) {
      var asFloat, formatted, isValid;
      isValid = this.InputNumberService.isValidNumber(value);
      asFloat = this.InputNumberService.toFloat(value);
      if (!this.InputNumberService.isWithinPrecision(asFloat, precision)) {
        isValid = false;
      }
      this.$scope.$inputNumber.ngModel.$setValidity(this.validityKey, isValid);
      if (isValid) {
        formatted = formatter(value);
      }
      if (isValid) {
        return formatted;
      } else {
        return void 0;
      }
    };

    InputNumberPercentageCtrl.prototype.parse = function(value) {
      var _this = this;
      return this.validate(value, this.$scope.$inputNumber.precision - 2, function(value) {
        return _this.InputNumberService.toPrecision(value / 100, _this.$scope.$inputNumber.precision);
      });
    };

    InputNumberPercentageCtrl.prototype.format = function(value) {
      var _this = this;
      return this.validate(value, this.$scope.$inputNumber.precision, function(value) {
        return _this.InputNumberService.toPrecision(value * 100, _this.$scope.$inputNumber.precision - 2);
      });
    };

    return InputNumberPercentageCtrl;

  })());

}).call(this);

(function() {
  angular.module('rui.forms.input.number.directives', ['rui.forms.input.number.directives.number', 'rui.forms.input.number.directives.percentage']);

}).call(this);

(function() {
  angular.module('rui.forms.input.number.directives.number', ['rui.forms.input.services', 'rui.forms.input.number.controllers.number', 'rui.forms.input.number.services.number']).directive('ruiInputNumber', function(InputNumberService, NgModelHelper) {
    return {
      restrict: 'EA',
      require: ['ruiInputNumber', 'ngModel'],
      templateUrl: 'rui/forms/input/number/templates/number.html',
      transclude: 'element',
      replace: true,
      scope: true,
      controller: 'InputNumberCtrl',
      priority: 999,
      link: function($scope, $element, $attrs, _arg) {
        var controller, ngModel, parentNgModel, theInputElement,
          _this = this;
        controller = _arg[0], parentNgModel = _arg[1];
        if ($scope.$inputNumber == null) {
          $scope.$inputNumber = {};
        }
        theInputElement = $('input', $element);
        theInputElement.keydown(controller.stepKey);
        theInputElement.blur(controller.blur);
        ngModel = angular.element(theInputElement).controller('ngModel');
        $scope.$inputNumber.ngModel = ngModel;
        NgModelHelper.orderedValidatorInsert(ngModel.$parsers, controller.parse);
        NgModelHelper.orderedValidatorInsert(ngModel.$formatters, controller.format);
        $attrs.$observe('step', function(stepValue) {
          return $scope.$inputNumber.stepValue = InputNumberService.toInteger(stepValue);
        });
        $attrs.$observe('max', function(maxValue) {
          return $scope.$inputNumber.maxValue = InputNumberService.toInteger(maxValue);
        });
        $attrs.$observe('min', function(minValue) {
          return $scope.$inputNumber.minValue = InputNumberService.toInteger(minValue);
        });
        $attrs.$observe('emptyDefault', function(emptyDefault) {
          return $scope.$inputNumber.emptyDefault = InputNumberService.toFloat(emptyDefault);
        });
        return $scope.$watch(function() {
          return theInputElement.attr('disabled');
        }, function(disabledAttr) {
          return $scope.$inputNumber.isDisabled = disabledAttr === 'disabled';
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('rui.forms.input.number.directives.percentage', ['rui.forms.input.number.controllers.percentage', 'rui.forms.input.number.services.number', 'rui.forms.input.number.directives.number']).directive('ruiInputNumberPercentage', function(InputNumberService) {
    return {
      restrict: 'EA',
      require: ['^ruiInputNumber', 'ruiInputNumberPercentage'],
      controller: 'InputNumberPercentageCtrl',
      link: function($scope, $element, $attrs, _arg) {
        var controller, inputCtrl, ngModel;
        inputCtrl = _arg[0], controller = _arg[1];
        $scope.$inputNumber = inputCtrl.$scope.$inputNumber;
        $attrs.$observe('ruiInputNumberPercentage', function(precision) {
          return $scope.$inputNumber.precision = InputNumberService.toInteger(precision);
        });
        ngModel = angular.element($($element, 'input')).controller('ngModel');
        ngModel.$formatters.push(controller.format);
        return ngModel.$parsers.push(controller.parse);
      }
    };
  });

}).call(this);

(function() {
  angular.module('rui.forms.input.number', ['rui.forms.input.number.directives', 'rui.forms.input.number.controllers', 'rui.forms.input.number.services']);

}).call(this);

(function() {
  angular.module('rui.forms.input.number.services', ['rui.forms.input.number.services.number']);

}).call(this);

(function() {
  var InputNumberService,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.forms.input.number.services.number', []).service('InputNumberService', InputNumberService = (function() {
    function InputNumberService() {
      this.toInteger = __bind(this.toInteger, this);
      this.toFloat = __bind(this.toFloat, this);
    }

    InputNumberService.numericRegEx = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

    InputNumberService.prototype.isValidNumber = function(number) {
      var string;
      if ((number == null) || isNaN(number)) {
        return false;
      }
      string = "" + number;
      return InputNumberService.numericRegEx.test(number);
    };

    InputNumberService.prototype.isWithinPrecision = function(number, precision) {
      var decimal, string, whole, _ref;
      if ((number == null) || isNaN(number)) {
        return false;
      }
      string = "" + number;
      _ref = string.split('.'), whole = _ref[0], decimal = _ref[1];
      if (decimal != null) {
        return decimal.length <= precision;
      } else {
        return true;
      }
    };

    InputNumberService.prototype.toFloat = function(number) {
      return this.toPrecision(number, null);
    };

    InputNumberService.prototype.toPrecision = function(number, precision) {
      var decimal, string, whole, _ref;
      if (precision == null) {
        precision = null;
      }
      if ((number == null) || isNaN(number)) {
        return NaN;
      }
      if (precision == null) {
        return parseFloat(number);
      }
      string = "" + number;
      _ref = string.split('.'), whole = _ref[0], decimal = _ref[1];
      if (whole == null) {
        whole = 0;
      }
      if (precision > 0 && (decimal != null)) {
        decimal = decimal.slice(0, +(precision - 1) + 1 || 9e9);
        return parseFloat([whole, decimal].join('.'));
      } else {
        return parseInt(whole);
      }
    };

    InputNumberService.prototype.toInteger = function(number) {
      return parseInt(number);
    };

    return InputNumberService;

  })());

}).call(this);

(function() {
  angular.module('rui.forms.input.pattern', ['rui.forms.input.pattern.restrict']);

}).call(this);

(function() {
  var InputPatternRestrictCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.forms.input.pattern.restrict.controllers.restrict', []).controller('InputPatternRestrictCtrl', InputPatternRestrictCtrl = (function() {
    function InputPatternRestrictCtrl($scope) {
      var _base;
      this.$scope = $scope;
      this.clean = __bind(this.clean, this);
      this.isValid = __bind(this.isValid, this);
      this.onViewValueChange = __bind(this.onViewValueChange, this);
      if ((_base = this.$scope).$inputPattern == null) {
        _base.$inputPattern = {};
      }
      this.$scope.$inputPattern.restrictPattern = /^(.*)$/;
      this.$scope.$watch('$inputPattern.ngModel.$viewValue', this.onViewValueChange);
    }

    InputPatternRestrictCtrl.prototype.onViewValueChange = function(viewValue) {
      return this.$scope.$inputPattern.history = viewValue;
    };

    InputPatternRestrictCtrl.prototype.isValid = function(value) {
      return this.$scope.$inputPattern.restrictPattern.test(value);
    };

    InputPatternRestrictCtrl.prototype.clean = function(value) {
      var clean, isValid;
      isValid = this.isValid("" + value);
      if (isValid) {
        return value;
      } else {
        clean = this.$scope.$inputPattern.history || '';
        if (value !== clean) {
          this.$scope.$inputPattern.ngModel.$setViewValue(clean);
          this.$scope.$inputPattern.ngModel.$render();
        }
        return clean;
      }
    };

    return InputPatternRestrictCtrl;

  })());

}).call(this);

(function() {
  angular.module('rui.forms.input.pattern.restrict.directives.restrict', ['rui.forms.input.services', 'rui.forms.input.pattern.restrict.controllers.restrict']).directive('ruiInputPatternRestrict', function(NgModelHelper) {
    return {
      restrict: 'A',
      require: ['ruiInputPatternRestrict', 'ngModel'],
      controller: 'InputPatternRestrictCtrl',
      link: function($scope, $element, $attrs, _arg) {
        var controller, ngModel, parser;
        controller = _arg[0], ngModel = _arg[1];
        $scope.$inputPattern = controller.$scope.$inputPattern;
        $scope.$inputPattern.ngModel = ngModel;
        $attrs.$observe('ruiInputPatternRestrict', function(pattern) {
          return $scope.$inputPattern.restrictPattern = new RegExp(pattern);
        });
        parser = controller.clean;
        parser.order = -100;
        return NgModelHelper.orderedValidatorInsert(ngModel.$parsers, parser);
      }
    };
  });

}).call(this);

(function() {
  angular.module('rui.forms.input.pattern.restrict', ['rui.forms.input.pattern.restrict.controllers.restrict', 'rui.forms.input.pattern.restrict.directives.restrict']);

}).call(this);

(function() {
  angular.module('rui.forms.input.services', ['rui.forms.input.services.ngModelHelper']);

}).call(this);

(function() {
  var NgModelHelper;

  angular.module('rui.forms.input.services.ngModelHelper', ['rui.util.lodash']).service('NgModelHelper', NgModelHelper = (function() {
    function NgModelHelper() {}

    NgModelHelper.prototype.orderedValidatorInsert = function(validators, toInsert) {
      var validator, _i, _len;
      for (_i = 0, _len = validators.length; _i < _len; _i++) {
        validator = validators[_i];
        if (validator.order == null) {
          validator.order = 0;
        }
      }
      if (toInsert.order == null) {
        toInsert.order = 0;
      }
      return _.sortedInsert(validators, toInsert, 'order');
    };

    return NgModelHelper;

  })());

}).call(this);

(function() {
  angular.module('rui.forms.select.directives', ['rui.forms.select.directives.select']);

}).call(this);

(function() {
  angular.module('rui.forms.select.directives.select', []).directive('ngDisabled', function() {
    return function($scope, $element, $attrs) {
      return $scope.$watch($attrs['ngDisabled'], function(disabled) {
        if (disabled) {
          return $element.attr('disabled', 'disabled');
        } else {
          return $element.removeAttr('disabled');
        }
      });
    };
  });

}).call(this);

(function() {
  angular.module('rui.forms.select', ['rui.forms.select.directives']);

}).call(this);

(function() {
  var HighchartsCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.highcharts.directives.controllers.highcharts', []).controller('HighchartsCtrl', HighchartsCtrl = (function() {
    var events;

    events = ['load', 'click', 'redraw', 'selection'];

    HighchartsCtrl.$inject = ['$scope', 'Highcharts'];

    function HighchartsCtrl($scope, Highcharts) {
      this.$scope = $scope;
      this.Highcharts = Highcharts;
      this._onEvent = __bind(this._onEvent, this);
      this.hideSeries = __bind(this.hideSeries, this);
      this.$scope.$highcharts = this.$scope.$new();
      this.$scope.$highcharts.hideSeries = this.hideSeries;
    }

    HighchartsCtrl.prototype.hideSeries = function(n) {
      var _ref;
      return (_ref = this.$scope.$highcharts.chart.series[n]) != null ? _ref.hide() : void 0;
    };

    /*
    @param {element}
    @param {options} Highcharts configuration object
    @public
    */


    HighchartsCtrl.prototype.initHighcharts = function(element, options) {
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

    /*
    Delegate to highcharts events from the config, then broadcast the chart 
    events down the directive scope.
    */


    HighchartsCtrl.prototype._onEvent = function(eventName) {
      var _this = this;
      return function(e) {
        var _ref, _ref1;
        if ((_ref = _this.events) != null) {
          if ((_ref1 = _ref[eventName]) != null) {
            _ref1.apply(_this.highcharts, arguments);
          }
        }
        _this.$scope.$broadcast("chart:" + eventName, e);
        if (!_this.$scope.$$phase) {
          return _this.$scope.$digest();
        }
      };
    };

    return HighchartsCtrl;

  })());

}).call(this);

(function() {
  var HighchartsHtmlCtrl;

  angular.module('rui.highcharts.directives.controllers.html', []).controller('HighchartsHtmlCtrl', HighchartsHtmlCtrl = (function() {
    HighchartsHtmlCtrl.$inject = ['$scope'];

    function HighchartsHtmlCtrl($scope) {
      this.$scope = $scope;
      this.$scope.$highchartsHtml = this.$scope.$new();
    }

    return HighchartsHtmlCtrl;

  })());

}).call(this);

(function() {


}).call(this);

(function() {
  var ToggleCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.highcharts.directives.controllers.toggle', []).controller('ToggleCtrl', ToggleCtrl = (function() {
    ToggleCtrl.$inject = ['$scope'];

    function ToggleCtrl($scope) {
      var _this = this;
      this.$scope = $scope;
      this.toggleIt = __bind(this.toggleIt, this);
      debugger;
      this.toggleTest = 'test';
      this.$scope.$watch('state', function(state) {
        switch (state) {
          case 'scores':
            return _this.$scope.$highcharts.chart.series[0].hide();
          case 'metric':
            return _this.$scope.$highcharts.chart.series[0].hide();
        }
      });
    }

    ToggleCtrl.prototype.toggleIt = function() {
      debugger;
    };

    return ToggleCtrl;

  })());

}).call(this);

(function() {
  angular.module('rui.highcharts.decorators', ['rui.highcharts.decorators.useHtml', 'rui.highcharts.decorators.tooltip']);

}).call(this);

(function() {
  var __slice = [].slice;

  angular.module('rui.highcharts.decorators.tooltip', ['rui.highcharts.decorators.useHtml']).config(function($provide) {
    return $provide.decorator('Highcharts', function($delegate, $compile) {
      $delegate.Tooltip.prototype.init = _.wrap($delegate.Tooltip.prototype.init, function() {
        var args, chart, initFn, ngTemplateUrl, options;
        initFn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        chart = args[0], options = args[1];
        if (options.ngTemplateUrl) {
          options.useHTML = true;
          ngTemplateUrl = options.ngTemplateUrl;
          options.formatter = function(tooltip) {
            var $scope;
            $scope = angular.element(tooltip.label.div).scope();
            $scope.$chart = chart;
            $scope.$tooltip = this;
            return "<div ng-include=\"'" + ngTemplateUrl + "'\">";
          };
        }
        return initFn.apply(this, args);
      });
      return $delegate;
    });
  });

}).call(this);

(function() {
  var __slice = [].slice;

  angular.module('rui.highcharts.decorators.useHtml', ['rui.highcharts.factories.highcharts']).config(function($provide) {
    return $provide.decorator('Highcharts', function($delegate, $compile) {
      $delegate.Chart.prototype.getContainer = _.wrap($delegate.Chart.prototype.getContainer, function() {
        var $scope, args, getContainerFn, result;
        getContainerFn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        result = getContainerFn.apply(this, args);
        $scope = angular.element(this.renderTo).scope().$new();
        this.$scope = $scope;
        $scope.$chart = this;
        $compile(this.container)(this.$scope);
        return result;
      });
      $delegate.Renderer.prototype.html = _.wrap($delegate.Renderer.prototype.html, function() {
        var $innerScope, $scope, args, htmlFn, htmlWrapper, _ref, _ref1;
        htmlFn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        htmlWrapper = htmlFn.apply(this, args);
        $scope = angular.element(this.box).scope().$new();
        $compile(htmlWrapper.element)($scope);
        $(htmlWrapper.element).on("remove", function() {
          return $scope.$destroy();
        });
        $innerScope = null;
        if ((_ref = htmlWrapper.attrSetters) != null) {
          _ref.text = _.wrap((_ref1 = htmlWrapper.attrSetters) != null ? _ref1.text : void 0, function() {
            var args, result, textFn;
            textFn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            result = textFn.apply(this, args);
            $innerScope = $scope.$new();
            $compile($(this.element).contents())($innerScope);
            if (!$innerScope.$$phase) {
              $innerScope.$digest();
            }
            return result;
          });
        }
        return htmlWrapper;
      });
      return $delegate;
    });
  });

}).call(this);

/**
 * @ngdoc directive
 * @name rui.highcharts.directives:ruiHighcharts
 * @description
 * The base for highcharts directives. This creates a new Highcharts.Chart rendered to the directive's template.
 * @example
    <example module="App">
        <file name="script.js">
            angular.module('App', ['rui.highcharts'])
            .controller('Ctrl',
              function Ctrl($scope, $templateCache) {
                  $templateCache.put("templates/myTooltip.html",
                    "<span>x: {{$tooltip.x}} y: {{$tooltip.y}}</span>");

                  $scope.highchartsConfig = {
                    xAxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    },
                    
                    series: [{
                        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]        
                    }, {
                        data: [194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4]        
                    }],
                    tooltip: {
                      ngTemplateUrl: 'templates/myTooltip.html'
                    }
                  }
              }
            );
        </file>
        <file name="index.html">
            <div ng-controller="Ctrl">              
              <div rui-highcharts highcharts-config="highchartsConfig"></div>
            </div>
        </file>
    </example>
*/


(function() {
  var highcharts;

  highcharts = angular.module('rui.highcharts.directives.highcharts', ['rui.highcharts.directives.controllers.highcharts', 'rui.highcharts.factories.highcharts']).directive('ruiHighcharts', [
    function() {
      return {
        restrict: 'EA',
        controller: 'HighchartsCtrl',
        require: ['?ngModel', 'ruiHighcharts'],
        transclude: true,
        scope: true,
        replace: true,
        templateUrl: 'rui/highcharts/templates/highcharts.html',
        compile: function(tElement, tAttrs, transcludeFn) {
          tElement.addClass('rui-highcharts');
          return function(scope, element, attrs, _arg) {
            var chart, controller, ngModel, options, renderTo;
            ngModel = _arg[0], controller = _arg[1];
            options = scope.$eval(attrs.highchartsConfig);
            renderTo = $('.rui-highcharts-container', element);
            chart = controller.initHighcharts(renderTo, options);
            if (ngModel != null) {
              ngModel.$setViewValue(chart);
            }
            return transcludeFn(scope, function(clone) {
              return $('.rui-highcharts-html-container', element).append(clone);
            });
          };
        }
      };
    }
  ]);

}).call(this);

/**
 * @ngdoc directive
 * @name rui.highcharts.directives:ruiHighchartsHtml
 * @description
 * The directive adds and absolute positioned html block that can be positioned with ng-style over the chart.
 * @example
    <example module="App">
        <file name="script.js">
            angular.module('App', ['rui.highcharts'])
            .controller('Ctrl',
              function Ctrl($scope) {
                  $scope.highcharts = {
                    config: {
                      chart: {
                        type: 'bar'
                      },
                      series: [
                        {
                          name: 'Year 1800',
                          data: [107, 31, 635, 203, 2]
                        }
                      ]
                    }
                  };
                  $scope.overlayStyle = function(){
                    var top = ($scope.highcharts.chart.chartHeight - 50)
                    var left = ($scope.highcharts.chart.chartWidth - 100)
                    var style = {top: top+'px', left: left+'px'}
                    return style;
                  };
                  $scope.toggleSeries = function(){
                    var series = $scope.highcharts.chart.series[0];
                    $scope.toggle = !$scope.toggle;
                    if($scope.toggle) {
                      series.hide();
                    } else {
                      series.show();
                    }                    
                  };
              }
            );
        </file>
        <file name="index.html">
            <div ng-controller="Ctrl">              
              <div rui-highcharts highcharts-config="highcharts.config" ng-model="highcharts.chart">
                <div rui-highcharts-html ng-style="overlayStyle()" ng-click="toggleSeries()">Toggle Series on/off</div>
              </div>
            </div>
        </file>
    </example>
*/


(function() {
  angular.module('rui.highcharts.directives.html', ['rui.highcharts.directives.controllers.highcharts', 'rui.highcharts.directives.controllers.html']).directive('ruiHighchartsHtml', [
    function() {
      return {
        restrict: 'EA',
        transclude: false,
        require: ['^ruiHighcharts'],
        controller: 'HighchartsHtmlCtrl',
        scope: true,
        compile: function(tElement, tAttrs) {
          tElement.addClass('rui-highcharts-html');
          return function(scope, element, attrs, _arg) {
            var highchartsController;
            highchartsController = _arg[0];
            return scope.$highcharts = highchartsController.$scope.$highcharts;
          };
        }
      };
    }
  ]);

}).call(this);

/**
 * @ngdoc service
 * @name rui.highcharts.factories:Highcharts
 * @description
 * Returns the global Highcharts module. Allows for decorating or mocking.
*/


(function() {
  var highcharts;

  highcharts = angular.module('rui.highcharts.factories.highcharts', []).factory('Highcharts', function() {
    return Highcharts;
  });

}).call(this);

(function() {
  var highcharts;

  highcharts = angular.module('rui.highcharts', ['rui.templates', 'rui.highcharts.directives.highcharts', 'rui.highcharts.directives.html', 'rui.highcharts.factories.highcharts', 'rui.highcharts.decorators']);

}).call(this);

(function() {
  angular.module('rui.quickmenu.directives.quickmenu', []).directive('ruiQuickmenu', function() {
    return {
      restrict: 'EA',
      scope: {
        items: '='
      },
      templateUrl: 'rui/menu/quickmenu/template/rui-quickmenu.html',
      compile: function(tElement, tAttrs) {
        tElement.addClass('rui-quickmenu');
        return function(scope, element, attributes) {
          return scope.$watch('items.length', function(newValue, oldValue) {
            return element.width(newValue * 26);
          });
        };
      }
    };
  });

}).call(this);

(function() {
  angular.module('rui.quickmenu', ['rui.quickmenu.directives.quickmenu']);

}).call(this);

(function() {
  var PubSub;

  angular.module('rui.pubsub', []).service('PubSub', PubSub = (function() {
    function PubSub($rootScope) {
      this.$rootScope = $rootScope;
    }

    PubSub.prototype.subscribe = function(event, handler) {
      console.log('subscribe:', event, handler);
      return this.$rootScope.$on(event, handler);
    };

    PubSub.prototype.publish = function(event, data, options) {
      var _ref;
      console.log('publish:', event, data);
      this.$rootScope.$emit(event, data);
      return typeof Rally !== "undefined" && Rally !== null ? (_ref = Rally.environment) != null ? _ref.getMessageBus().publish.apply(Rally.environment.getMessageBus(), arguments) : void 0 : void 0;
    };

    return PubSub;

  })());

}).call(this);

(function() {
  var rui;

  rui = angular.module('rui', ['rui.sortable', 'rui.highcharts', 'rui.dropdown', 'rui.tabs', 'rui.util', 'rui.scroll', 'rui.forms', 'rui.tree', 'rui.alm']);

}).call(this);

(function() {
  angular.module('rui.scroll', ['rui.scroll.when']);

}).call(this);

(function() {
  angular.module('rui.scroll.when.directives.when', []).directive('ruiScrollWhen', function($timeout) {
    return {
      restrict: 'A',
      scope: {
        ruiScrollWhen: '='
      },
      link: function($scope, $element, $attrs) {
        return $scope.$watch('ruiScrollWhen', function(value) {
          if (value) {
            return $timeout(function() {
              var _ref;
              return (_ref = angular.element($element != null ? $element[0] : void 0)) != null ? _ref.scrollIntoView() : void 0;
            });
          }
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('rui.scroll.when', ['rui.scroll.when.directives.when']);

}).call(this);

(function() {
  var module;

  module = angular.module("rui.sortable", []);

  module.value("ruiSortableConfig", {});

  /**
  * @ngdoc directive
  * @name rui.sortable:ruiSortable
  * @restrict A
  * @param {string} ruiSortable An object that represents sortable options. This directive wraps around
  *   the jQuery UI sortable widget and all those options are supported
  * @param {string=} ngModel An array on the current scope to be controlled by this directive. Sorting
  *   and drag/drop will change the scope object of this `ngModel` and possibly the `ngModel` of connected
  *   `ruiSortable` directives
  * @description
  * This directive makes an element sortable
  */


  module.directive("ruiSortable", [
    "ruiSortableConfig", "$timeout", "$log", function(ruiSortableConfig, $timeout, $log) {
      return {
        require: "?ngModel",
        link: function(scope, element, attrs, ngModel) {
          var callbacks, combineCallbacks, opts, savedNodes;
          combineCallbacks = function(first, second) {
            if (second && (typeof second === "function")) {
              return function(e, ui) {
                first(e, ui);
                return second(e, ui);
              };
            }
            return first;
          };
          savedNodes = void 0;
          opts = angular.extend({}, ruiSortableConfig, scope.$eval(attrs.ruiSortable));
          callbacks = {
            receive: null,
            remove: null,
            start: null,
            stop: null,
            update: null
          };
          if (ngModel) {
            scope.$watch(attrs.ngModel + ".length", function() {
              return $timeout(function() {
                return element.sortable("refresh");
              });
            });
            callbacks.start = function(e, ui) {
              return ui.item.sortable = {
                startIndex: ui.item.index(),
                startModel: ngModel,
                index: ui.item.index(),
                cancel: function() {
                  return ui.item.sortable._isCanceled = true;
                },
                isCanceled: function() {
                  return ui.item.sortable._isCanceled;
                },
                _isCanceled: false
              };
            };
            callbacks.activate = function(e, ui) {
              var excludes, placeholder;
              savedNodes = element.contents();
              placeholder = element.sortable("option", "placeholder");
              if (placeholder && placeholder.element && typeof placeholder.element === "function") {
                excludes = element.find("[class=\"" + placeholder.element().attr("class") + "\"]");
                return savedNodes = savedNodes.not(excludes);
              }
            };
            callbacks.update = function(e, ui) {
              if (!ui.item.sortable.received) {
                ui.item.sortable.dropindex = ui.item.index();
                element.sortable("cancel");
              }
              savedNodes.detach().appendTo(element);
              if (ui.item.sortable.received && !ui.item.sortable.isCanceled()) {
                return scope.$apply(function() {
                  return ngModel.$modelValue.splice(ui.item.sortable.dropindex, 0, ui.item.sortable.moved);
                });
              }
            };
            callbacks.stop = function(e, ui) {
              if (ui.item.sortable.resort) {
                ui.item.sortable.endIndex = ui.item.index();
                ui.item.sortable.endModel = ui.item.sortable.resort;
              }
              if (!ui.item.sortable.received && ("dropindex" in ui.item.sortable) && !ui.item.sortable.isCanceled()) {
                return scope.$apply(function() {
                  return ngModel.$modelValue.splice(ui.item.sortable.dropindex, 0, ngModel.$modelValue.splice(ui.item.sortable.index, 1)[0]);
                });
              }
            };
            callbacks.receive = function(e, ui) {
              return ui.item.sortable.received = true;
            };
            callbacks.remove = function(e, ui) {
              if (!ui.item.sortable.isCanceled()) {
                return scope.$apply(function() {
                  return ui.item.sortable.moved = ngModel.$modelValue.splice(ui.item.sortable.index, 1)[0];
                });
              }
            };
            scope.$watch(attrs.uiSortable, (function(newVal, oldVal) {
              return angular.forEach(newVal, function(value, key) {
                if (callbacks[key]) {
                  if (key === "stop") {
                    value = combineCallbacks(value, function() {
                      return scope.$apply();
                    });
                  }
                  value = combineCallbacks(callbacks[key], value);
                }
                return element.sortable("option", key, value);
              });
            }), true);
            angular.forEach(callbacks, function(value, key) {
              return opts[key] = combineCallbacks(value, opts[key]);
            });
          } else {
            $log.info("ui.sortable: ngModel not provided!", element);
          }
          return element.sortable(opts);
        }
      };
    }
  ]);

}).call(this);

(function() {
  var TabsetCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.tabs.directives.controllers.tab', []).controller('TabCtrl', TabsetCtrl = (function() {
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
      this.$tabset.$watch('state.activeTab', function(tab) {
        return _this.$tab.model.isActive = tab === _this.$tab.model;
      });
      return this;
    }

    TabsetCtrl.prototype.select = function() {
      return this.$tab.model.isActive = this.$tab.selectTab(this.$tab.model);
    };

    TabsetCtrl.prototype.headingClasses = function() {
      return {
        active: this.$tab.model.isActive
      };
    };

    return TabsetCtrl;

  })());

}).call(this);

(function() {
  var TabsetCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.tabs.directives.controllers.tabset', []).controller('TabsetCtrl', TabsetCtrl = (function() {
    TabsetCtrl.$inject = ['$scope', '$transclude'];

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

    TabsetCtrl.prototype.select = function(tab) {
      this.$tabset.state.activeTab = tab;
      return true;
    };

    TabsetCtrl.prototype.registerTab = function(tab) {
      if (!this.$tabset.state.activeTab) {
        return this.select(tab);
      }
    };

    return TabsetCtrl;

  })());

}).call(this);

/*
*/


(function() {
  var tab;

  tab = angular.module('rui.tabs.directives.tab', ['rui.tabs.directives.controllers.tab']).directive('ruiTab', [
    function() {
      return {
        restrict: 'EA',
        require: ['?ngModel', '^ruiTabset'],
        controller: "TabCtrl",
        scope: true,
        link: {
          post: function(scope, element, attrs, _arg) {
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
    }
  ]);

}).call(this);

/*
*/


(function() {
  var tab;

  tab = angular.module('rui.tabs.directives.tabContent', []).directive('ruiTabContent', [
    function() {
      return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        scope: true,
        templateUrl: 'rui/tabs/templates/tab-content.html',
        link: function(scope, element, attrs) {
          return this;
        }
      };
    }
  ]);

}).call(this);

/*
*/


(function() {
  var tabset;

  tabset = angular.module('rui.tabs.directives.tabHeading', []).directive('ruiTabHeading', [
    function() {
      return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        scope: true,
        require: ['?^ngModel', '^ruiTab'],
        templateUrl: 'rui/tabs/templates/tab-heading.html',
        link: function($scope, element, attrs, _arg) {
          var ngModel, tabCtrl;
          ngModel = _arg[0], tabCtrl = _arg[1];
          $scope.$tabHeading = $scope.$new();
          $scope.$tabHeading.select = tabCtrl.select;
          $scope.$tabHeading.headingClasses = tabCtrl.headingClasses;
          return this;
        }
      };
    }
  ]);

}).call(this);

/**
 * @ngdoc directive
 * @name rui.tabs.directives:ruiTabset
 * @description
 * Implementation of bootstrap tabs
 * @example
    <example module="App">
        <file name="script.js">
            angular.module('App', ['rui.tabs'])
            .controller('Ctrl',
              function Ctrl($scope) {
                  $scope.tabs = [
                    { name: 'tab1', active: true },
                    { name: 'tab2', disabled: true },
                    { name: 'tab3' }
                  ];
                  $scope.blah = "blah";
                  $scope.addTab = function(){
                    $scope.tabs.push({name:'tab4'});
                  };
                  $scope.removeTab = function(){
                    $scope.tabs.splice(0, 1);
                  };
              }
            );
        </file>
        <file name="index.html">
            <div ng-controller="Ctrl">
              <div>
                <a ng-click="addTab()">Add a tab</a>
                <br>
                <a ng-click="removeTab()">Remove a tab</a>
              </div>
              <div rui-tabset ng-model="selectedTab">
                <!-- directive: rui-transclude-class rui-tab -->
                <div ng-repeat="tab in tabs" rui-tab ng-model="tab">
                  <div rui-tab-heading>{{tab.name}}</div>
                  <div rui-tab-content ng-class="{active: tab.active}">{{tab.name}} - content</div>
              	</div>
              </div>
            </div>
        </file>
    </example>
*/


(function() {
  var tabset;

  tabset = angular.module('rui.tabs.directives.tabset', ['rui.tabs.directives.controllers.tabset']).directive('ruiTabset', [
    function() {
      return {
        restrict: 'EA',
        require: ['?ngModel'],
        transclude: true,
        scope: true,
        replace: true,
        templateUrl: 'rui/tabs/templates/tabset.html',
        controller: 'TabsetCtrl',
        link: {
          post: function(scope, element, attrs, _arg) {
            var ngModel;
            ngModel = _arg[0];
            return this;
          }
        }
      };
    }
  ]);

}).call(this);

(function() {
  var module;

  module = angular.module('rui.tabs', ['rui.templates', 'rui.util.transclude', 'rui.tabs.directives.tabset', 'rui.tabs.directives.tab', 'rui.tabs.directives.tabHeading', 'rui.tabs.directives.tabContent']);

}).call(this);

(function() {
  angular.module('rui.templates', []);

}).call(this);

(function() {
  var RuiTreeCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.tree.controllers.tree', ['rui.util.lodash']).controller('RuiTreeCtrl', RuiTreeCtrl = (function() {
    function RuiTreeCtrl($scope, $log) {
      var isRootTree, rootState, state, _ref, _ref1;
      this.$scope = $scope;
      this.$log = $log;
      this.setTrackBy = __bind(this.setTrackBy, this);
      this.trackBy = __bind(this.trackBy, this);
      this.getNodeState = __bind(this.getNodeState, this);
      this.getNodeId = __bind(this.getNodeId, this);
      this.getParent = __bind(this.getParent, this);
      this.getIndexedNode = __bind(this.getIndexedNode, this);
      this.updateIndex = __bind(this.updateIndex, this);
      this.updateRoot = __bind(this.updateRoot, this);
      this.index = __bind(this.index, this);
      isRootTree = this.$scope.$ruiTree == null;
      rootState = ((_ref = this.$scope.$ruiTree) != null ? _ref.rootState : void 0) || {};
      state = ((_ref1 = this.$scope.$ruiTree) != null ? _ref1.state : void 0) || {};
      if (rootState.index == null) {
        rootState.index = {};
      }
      if (rootState.parentIndex == null) {
        rootState.parentIndex = {};
      }
      this.$scope.$ruiTree = {
        state: state,
        isRootTree: isRootTree,
        rootState: rootState,
        getNodeState: this.getNodeState,
        getNodeId: this.getNodeId,
        getParent: this.getParent,
        getIndexedNode: this.getIndexedNode
      };
      this.$scope.$watch('$ruiTree.root', this.updateIndex);
    }

    RuiTreeCtrl.prototype.index = function(node) {
      var _this = this;
      this.$scope.$ruiTree.rootState.index[this.getNodeId(node)] = node;
      return _.each(node.children, function(child) {
        _this.$scope.$ruiTree.rootState.parentIndex[_this.getNodeId(child)] = node;
        return _this.index(child);
      });
    };

    RuiTreeCtrl.prototype.updateRoot = function(root) {
      if (root == null) {
        root = [];
      }
      if (_.isArray(root)) {
        root = {
          children: root
        };
      }
      if (root.children == null) {
        root.children = [];
      }
      this.$scope.$ruiTree.rootState.isIndexed = this.$scope.$ruiTree.root === root;
      return this.$scope.$ruiTree.root = root;
    };

    RuiTreeCtrl.prototype.updateIndex = function(root) {
      var _this = this;
      if (this.$scope.$ruiTree.isRootTree) {
        _.each(root != null ? root.children : void 0, function(node) {
          return _this.index(node);
        });
        this.$scope.$ruiTree.rootState.isIndexed = true;
        return this.$scope.$emit('rui-tree:index');
      }
    };

    RuiTreeCtrl.prototype.getIndexedNode = function(node) {
      return this.$scope.$ruiTree.rootState.index[this.getNodeId(node)];
    };

    RuiTreeCtrl.prototype.getParent = function(node) {
      return this.$scope.$ruiTree.rootState.parentIndex[this.getNodeId(node)];
    };

    RuiTreeCtrl.prototype.getNodeId = function(node) {
      var id;
      node.$$hashKey = "" + (this.trackBy(node));
      id = (node != null ? node.$$hashKey : void 0) != null ? node.$$hashKey : node;
      id = "" + id;
      return id;
    };

    RuiTreeCtrl.prototype.getNodeState = function(node) {
      var id, state;
      id = this.getNodeId(node);
      state = this.$scope.$ruiTree.state[id];
      if (state == null) {
        state = {};
      }
      return this.$scope.$ruiTree.state[id] = state;
    };

    RuiTreeCtrl.prototype.trackBy = function(node) {
      return this.$scope.$ruiTree.rootState.trackBy(node);
    };

    RuiTreeCtrl.prototype.setTrackBy = function(trackBy) {
      if (this.$scope.$ruiTree.isRootTree) {
        return this.$scope.$ruiTree.rootState.trackBy = trackBy;
      }
    };

    return RuiTreeCtrl;

  })());

}).call(this);

(function() {
  var RuiTreeExpandCollapseCtrl, RuiTreeNodeExpandCollapseCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.tree.controllers.expandCollapse', ['rui.util.lodash']).controller('RuiTreeExpandCollapseCtrl', RuiTreeExpandCollapseCtrl = (function() {
    function RuiTreeExpandCollapseCtrl($scope, $timeout) {
      this.$scope = $scope;
      this.$timeout = $timeout;
      this.getParent = __bind(this.getParent, this);
      this.getNodeState = __bind(this.getNodeState, this);
      this.expandTo = __bind(this.expandTo, this);
      this.expand = __bind(this.expand, this);
      this.onExpandEvent = __bind(this.onExpandEvent, this);
      this.onExpandToEvent = __bind(this.onExpandToEvent, this);
      if (this.$scope.$ruiTree.isRootTree) {
        this.$scope.$on('rui-tree:expand-to-node', this.onExpandToEvent);
        this.$scope.$on('rui-tree:expand-node', this.onExpandEvent);
      }
    }

    RuiTreeExpandCollapseCtrl.prototype.onExpandToEvent = function($event, nodes) {
      var _this = this;
      nodes = _.isArray(nodes) ? nodes : [nodes];
      return this.$timeout(function() {
        return _.each(nodes, function(node) {
          return _this.expandTo(node);
        });
      });
    };

    RuiTreeExpandCollapseCtrl.prototype.onExpandEvent = function($event, nodes) {
      var _this = this;
      nodes = _.isArray(nodes) ? nodes : [nodes];
      return this.$timeout(function() {
        return _.each(nodes, function(node) {
          return _this.expand(node);
        });
      });
    };

    RuiTreeExpandCollapseCtrl.prototype.expand = function(node) {
      return this.getNodeState(node).expand = true;
    };

    RuiTreeExpandCollapseCtrl.prototype.expandTo = function(expandTo) {
      var node, _results;
      node = this.getParent(expandTo);
      _results = [];
      while (node != null) {
        this.expand(node);
        _results.push(node = this.getParent(node));
      }
      return _results;
    };

    RuiTreeExpandCollapseCtrl.prototype.getNodeState = function(node) {
      return this.$scope.$ruiTree.getNodeState(node);
    };

    RuiTreeExpandCollapseCtrl.prototype.getParent = function(node) {
      return this.$scope.$ruiTree.getParent(node);
    };

    return RuiTreeExpandCollapseCtrl;

  })()).controller('RuiTreeNodeExpandCollapseCtrl', RuiTreeNodeExpandCollapseCtrl = (function() {
    function RuiTreeNodeExpandCollapseCtrl($scope) {
      this.$scope = $scope;
      this.watchToShowSubTree = __bind(this.watchToShowSubTree, this);
      this.watchChildrenAndExpand = __bind(this.watchChildrenAndExpand, this);
      this.toggleExpand = __bind(this.toggleExpand, this);
      this.getState = __bind(this.getState, this);
      _.assign(this.$scope.$ruiTreeNode, {
        toggleExpand: this.toggleExpand
      });
      this.$scope.$watch('$ruiTreeNode.hasChildren', this.watchChildrenAndExpand);
      this.$scope.$watch('$ruiTreeNode.toggleDisabled', this.watchChildrenAndExpand);
      this.$scope.$watch('$ruiTreeNode.state.expand', this.watchChildrenAndExpand);
      this.$scope.$watch('$ruiTreeNode.hasChildrenAndExpanded', this.watchToShowSubTree);
    }

    RuiTreeNodeExpandCollapseCtrl.prototype.getState = function() {
      return this.$scope.$ruiTreeNode.state;
    };

    RuiTreeNodeExpandCollapseCtrl.prototype.toggleExpand = function() {
      var state;
      if (this.$scope.$ruiTreeNode.toggleDisabled) {
        return;
      }
      state = this.getState();
      return state.expand = !state.expand;
    };

    RuiTreeNodeExpandCollapseCtrl.prototype.watchChildrenAndExpand = function() {
      var canCollapse, canExpand, canToggleExpand, expanded, hasChildren, hasChildrenAndExpanded, _ref;
      hasChildren = this.$scope.$ruiTreeNode.hasChildren;
      expanded = (_ref = this.getState()) != null ? _ref.expand : void 0;
      hasChildrenAndExpanded = this.$scope.$ruiTreeNode.hasChildrenAndExpanded = hasChildren && expanded;
      canExpand = this.$scope.$ruiTreeNode.canExpand = hasChildren && !expanded;
      canCollapse = this.$scope.$ruiTreeNode.canCollapse = hasChildren && expanded;
      return canToggleExpand = this.$scope.$ruiTreeNode.canToggleExpand = canExpand || canCollapse;
    };

    RuiTreeNodeExpandCollapseCtrl.prototype.watchToShowSubTree = function() {
      var hasChildrenAndExpanded;
      hasChildrenAndExpanded = this.$scope.$ruiTreeNode.hasChildrenAndExpanded;
      return this.$scope.$ruiTreeNode.shouldShowChildren.expand = hasChildrenAndExpanded;
    };

    return RuiTreeNodeExpandCollapseCtrl;

  })());

}).call(this);

(function() {
  var RuiTreeNodeCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.tree.controllers.node', ['rui.util.lodash', 'rui.tree.factories.timeoutThrottle']).constant('RuiTreeNodePlaceHolderWarning', "$ruiTreeNode has children but template doesn't define a subtree placeholder with 'rui-tree-node-sub-tree-placeholder'. No sub-tree will be displayed.").controller('RuiTreeNodeCtrl', RuiTreeNodeCtrl = (function() {
    function RuiTreeNodeCtrl($scope, ruiTreeTimeoutThrottle, $timeout, $compile, $log, RuiTreeNodePlaceHolderWarning) {
      var _ref;
      this.$scope = $scope;
      this.ruiTreeTimeoutThrottle = ruiTreeTimeoutThrottle;
      this.$timeout = $timeout;
      this.$compile = $compile;
      this.$log = $log;
      this.RuiTreeNodePlaceHolderWarning = RuiTreeNodePlaceHolderWarning;
      this.manageSubTree = __bind(this.manageSubTree, this);
      this.getSubTreeTemplate = __bind(this.getSubTreeTemplate, this);
      this.shouldShowSubTree = __bind(this.shouldShowSubTree, this);
      this.watchChildren = __bind(this.watchChildren, this);
      this.setSubTreePlaceholder = __bind(this.setSubTreePlaceholder, this);
      this.setThrottle = __bind(this.setThrottle, this);
      this.watchNodeAndUpdateState = __bind(this.watchNodeAndUpdateState, this);
      this.manageShowChildren = __bind(this.manageShowChildren, this);
      this.subTree = null;
      this.setSubTreeTemplate('<ul class="rui-tree-node-subtree" rui-tree="$ruiTreeNode.node"/>');
      this.subTreeDirectives = [];
      this.$scope.$ruiTreeNode = {
        hasChildren: false,
        shouldShowChildren: {}
      };
      this.$scope.$watch('$ruiTreeNode.node', this.watchNodeAndUpdateState);
      this.$scope.$watch('$ruiTreeNode.node.children.length', this.watchChildren, (_ref = this.$scope.$ruiTree) != null ? _ref.deepWatch : void 0);
      this.$scope.$watch('$ruiTreeNode.hasChildren', this.manageShowChildren);
      this.$scope.$watch('$ruiTreeNode.shouldShowChildren', this.manageShowChildren, true);
      this.$scope.$watch('$ruiTreeNode.showChildren', this.manageSubTree);
    }

    RuiTreeNodeCtrl.prototype.manageShowChildren = function() {
      var shouldShowChildren;
      shouldShowChildren = this.$scope.$ruiTreeNode.shouldShowChildren;
      return this.$scope.$ruiTreeNode.showChildren = this.$scope.$ruiTreeNode.hasChildren && _.any(_.values(shouldShowChildren));
    };

    RuiTreeNodeCtrl.prototype.watchNodeAndUpdateState = function(node) {
      if (node) {
        return this.$scope.$ruiTreeNode.state = this.$scope.$ruiTree.getNodeState(node);
      }
    };

    RuiTreeNodeCtrl.prototype.setThrottle = function(throttle) {
      if (throttle) {
        if (_.isFunction(throttle)) {
          return this.$timeout = throttle;
        } else {
          return this.$timeout = this.ruiTreeTimeoutThrottle;
        }
      }
    };

    RuiTreeNodeCtrl.prototype.setSubTreePlaceholder = function(subTreePlaceholder) {
      this.subTreePlaceholder = subTreePlaceholder;
    };

    RuiTreeNodeCtrl.prototype.watchChildren = function(numOfChildren) {
      return this.$scope.$ruiTreeNode.hasChildren = numOfChildren > 0;
    };

    RuiTreeNodeCtrl.prototype.shouldShowSubTree = function() {
      var shouldShow;
      shouldShow = this.$scope.$ruiTreeNode.showChildren || (this.$scope.$ruiTreeNode.hasChildren && this.$scope.$ruiTreeNode.eagerBuild);
      return shouldShow;
    };

    RuiTreeNodeCtrl.prototype.setSubTreeTemplate = function(template) {
      return this.subTreeTemplate = template;
    };

    RuiTreeNodeCtrl.prototype.addSubTreeDirective = function(name, value) {
      return this.subTreeDirectives.push({
        name: name,
        value: value
      });
    };

    RuiTreeNodeCtrl.prototype.getSubTreeTemplate = function() {
      var name, template, value, _i, _len, _ref, _ref1, _ref2;
      template = $(this.subTreeTemplate);
      if ((_ref = this.subTreeDirectives) != null ? _ref.length : void 0) {
        _ref1 = this.subTreeDirectives;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          _ref2 = _ref1[_i], name = _ref2.name, value = _ref2.value;
          template.attr(name, value);
        }
      }
      return template;
    };

    RuiTreeNodeCtrl.prototype.manageSubTree = function() {
      var showSubTree, _ref,
        _this = this;
      this.subTreePlaceholder;
      showSubTree = this.shouldShowSubTree();
      if (showSubTree && (this.subTree == null)) {
        this.$timeout(function() {
          if (_this.shouldShowSubTree() && (_this.subTree == null)) {
            if (_this.subTreePlaceholder == null) {
              _this.$log.warn(_this.RuiTreeNodePlaceHolderWarning);
            }
            return _this.$compile(_this.getSubTreeTemplate())(_this.$scope.$new(), function(node, scope) {
              var _ref;
              if ((_ref = _this.subTreePlaceholder) != null) {
                _ref.append(node);
              }
              return _this.subTree = scope;
            });
          }
        }, 1, false);
      }
      if (!showSubTree) {
        if (this.subTree != null) {
          this.subTree.$destroy();
          if ((_ref = this.subTreePlaceholder) != null) {
            _ref.children().remove();
          }
          return this.subTree = null;
        }
      }
    };

    return RuiTreeNodeCtrl;

  })());

}).call(this);

(function() {
  var RuiTreeNodeSearchCtrl, RuiTreeSearchCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.tree.controllers.search', ['rui.util.lodash', 'rui.tree.factories.search']).controller('RuiTreeSearchCtrl', RuiTreeSearchCtrl = (function() {
    function RuiTreeSearchCtrl($scope, $parse, ruiTreeSearchFactory) {
      var _this = this;
      this.$scope = $scope;
      this.$parse = $parse;
      this.ruiTreeSearchFactory = ruiTreeSearchFactory;
      this.getNodeState = __bind(this.getNodeState, this);
      this.search = __bind(this.search, this);
      this.updateSearchTerm = __bind(this.updateSearchTerm, this);
      this.setSearchAttribute = __bind(this.setSearchAttribute, this);
      if (this.$scope.$ruiTree.isRootTree) {
        this.$scope.$watch('$ruiTree.rootState.searchTerm', this.search);
        this.$scope.$watch('$ruiTree.rootState.searchInProgress', function(searchInProgress) {
          return _this.$scope.$emit('rui-tree:searchInProgress', searchInProgress);
        });
        this.$scope.$on('rui-tree:index', this.search);
      }
      this.$scope.$ruiTree.search = this.search;
    }

    RuiTreeSearchCtrl.prototype.setSearchAttribute = function(attributeValue) {
      var nodeExp, searchTermExp, _ref;
      if (!this.$scope.$ruiTree.isRootTree) {
        return;
      }
      _ref = attributeValue.split('search by'), searchTermExp = _ref[0], nodeExp = _ref[1];
      if (searchTermExp) {
        searchTermExp = this.$parse(searchTermExp);
      } else {
        throw new Error("A search expression was expected like '_searchTerm_ [search by _nodeProperty_]'");
      }
      this.nodeExp = nodeExp ? this.$parse(nodeExp) : this.$parse('name');
      return this.$scope.$watch(searchTermExp, this.updateSearchTerm);
    };

    RuiTreeSearchCtrl.prototype.updateSearchTerm = function(term) {
      return this.$scope.$ruiTree.rootState.searchTerm = term;
    };

    RuiTreeSearchCtrl.prototype.search = function() {
      var mySearch, term, _ref,
        _this = this;
      term = this.$scope.$ruiTree.rootState.searchTerm;
      this.$scope.$ruiTree.rootState.isSearching = !!term;
      if ((_ref = this.currentSearch) != null) {
        if (typeof _ref.cancel === "function") {
          _ref.cancel();
        }
      }
      if (term) {
        this.$scope.$ruiTree.rootState.searchInProgress = true;
        mySearch = this.currentSearch = this.ruiTreeSearchFactory(term, this.nodeExp, this);
        return this.currentSearch.search(this.$scope.$ruiTree.root, 1000)['finally'](function() {
          if (mySearch === _this.currentSearch) {
            return _this.$scope.$ruiTree.rootState.searchInProgress = false;
          }
        });
      }
    };

    RuiTreeSearchCtrl.prototype.getNodeState = function(node) {
      return this.$scope.$ruiTree.getNodeState(node);
    };

    return RuiTreeSearchCtrl;

  })()).controller('RuiTreeNodeSearchCtrl', RuiTreeNodeSearchCtrl = (function() {
    function RuiTreeNodeSearchCtrl($scope) {
      this.$scope = $scope;
      this.watchMatchPathToShowSubTree = __bind(this.watchMatchPathToShowSubTree, this);
      this.watchSearchAndMatch = __bind(this.watchSearchAndMatch, this);
      this.$scope.$watch('$ruiTreeNode.state.searchMatch', this.watchSearchAndMatch);
      this.$scope.$watch('$ruiTreeNode.state.inSearchMatchPath', this.watchSearchAndMatch);
      this.$scope.$watch('$ruiTree.rootState.isSearching', this.watchSearchAndMatch);
      this.$scope.$watch('$ruiTreeNode.inSearchAndMatch', this.watchMatchPathToShowSubTree);
    }

    RuiTreeNodeSearchCtrl.prototype.watchSearchAndMatch = function() {
      var inSearchMatchPath, isSearchMatch, isSearching, _ref, _ref1;
      inSearchMatchPath = (_ref = this.$scope.$ruiTreeNode.state) != null ? _ref.inSearchMatchPath : void 0;
      isSearchMatch = (_ref1 = this.$scope.$ruiTreeNode.state) != null ? _ref1.searchMatch : void 0;
      isSearching = this.$scope.$ruiTree.rootState.isSearching;
      this.$scope.$ruiTreeNode.inSearchAndMatch = isSearching && inSearchMatchPath;
      this.$scope.$ruiTreeNode.showNode = isSearching ? inSearchMatchPath : true;
      return this.$scope.$ruiTreeNode.showSearchMatch = isSearching && isSearchMatch;
    };

    RuiTreeNodeSearchCtrl.prototype.watchMatchPathToShowSubTree = function() {
      var inSearchAndMatch;
      inSearchAndMatch = this.$scope.$ruiTreeNode.inSearchAndMatch;
      return this.$scope.$ruiTreeNode.shouldShowChildren.search = inSearchAndMatch;
    };

    return RuiTreeNodeSearchCtrl;

  })());

}).call(this);

(function() {
  var RuiTreeNodeSelectionCtrl, RuiTreeSelectionCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  angular.module('rui.tree.controllers.selection', ['rui.util.lodash']).controller('RuiTreeSelectionCtrl', RuiTreeSelectionCtrl = (function() {
    function RuiTreeSelectionCtrl($scope, $parse) {
      var _base,
        _this = this;
      this.$scope = $scope;
      this.$parse = $parse;
      this.watchSelectedNodes = __bind(this.watchSelectedNodes, this);
      this.bubbleSelectPath = __bind(this.bubbleSelectPath, this);
      this.getParent = __bind(this.getParent, this);
      this.toggleNodeSelection = __bind(this.toggleNodeSelection, this);
      this.getIndexedNode = __bind(this.getIndexedNode, this);
      this.selectNode = __bind(this.selectNode, this);
      this.getNodeState = __bind(this.getNodeState, this);
      this.allowDeselect = __bind(this.allowDeselect, this);
      this.allowMultiSelect = __bind(this.allowMultiSelect, this);
      this.updateNodesFromIndex = __bind(this.updateNodesFromIndex, this);
      this.onBindingSelectNodes = __bind(this.onBindingSelectNodes, this);
      this.onBindingSelectNode = __bind(this.onBindingSelectNode, this);
      this.getIndexedNode = __bind(this.getIndexedNode, this);
      this.bindSelectedNodes = __bind(this.bindSelectedNodes, this);
      this.bindSelectedNode = __bind(this.bindSelectedNode, this);
      if ((_base = this.$scope.$ruiTree.rootState).selection == null) {
        _base.selection = {
          nodes: []
        };
      }
      _.assign(this.$scope.$ruiTree, {
        toggleNodeSelection: this.toggleNodeSelection,
        selectNode: this.selectNode
      });
      if (this.$scope.$ruiTree.isRootTree) {
        this.$scope.$watchCollection('$ruiTree.rootState.selection.nodes', this.watchSelectedNodes);
        this.$scope.$watch('$ruiTree.rootState.selection.node', function(node) {
          return _this.$scope.$emit('rui-tree:selectedNode', node);
        });
        this.$scope.$watchCollection('$ruiTree.rootState.selection.nodes', function(nodes) {
          return _this.$scope.$emit('rui-tree:selectedNodes', nodes);
        });
        this.$scope.$on('rui-tree:index', this.updateNodesFromIndex);
      }
    }

    RuiTreeSelectionCtrl.prototype.bindSelectedNode = function(attrExpression) {
      var expression,
        _this = this;
      expression = this.$parse(attrExpression);
      this.$scope.$watchCollection(expression, function(node) {
        return _this.onBindingSelectNode(node);
      });
      return this.$scope.$watchCollection('$ruiTree.rootState.selection.nodes', function(nodes) {
        return expression.assign(_this.$scope, _.first(nodes));
      });
    };

    RuiTreeSelectionCtrl.prototype.bindSelectedNodes = function(attrExpression) {
      var expression,
        _this = this;
      expression = this.$parse(attrExpression);
      this.$scope.$watchCollection(expression, function(nodes) {
        return _this.onBindingSelectNodes(nodes);
      });
      return this.$scope.$watchCollection('$ruiTree.rootState.selection.nodes', function(nodes) {
        return expression.assign(_this.$scope, nodes);
      });
    };

    RuiTreeSelectionCtrl.prototype.getIndexedNode = function(node) {
      return this.$scope.$ruiTree.getIndexedNode(node);
    };

    RuiTreeSelectionCtrl.prototype.onBindingSelectNode = function(node) {
      var nodes;
      nodes = node != null ? [node] : [];
      return this.onBindingSelectNodes(nodes);
    };

    RuiTreeSelectionCtrl.prototype.onBindingSelectNodes = function(nodes) {
      var dirty, toDeselect,
        _this = this;
      toDeselect = _.without.apply(_, [this.$scope.$ruiTree.rootState.selection.nodes].concat(__slice.call(nodes != null ? nodes : [])));
      _.each(toDeselect, function(currentlySelectedNode) {
        return _this.toggleNodeSelection(currentlySelectedNode);
      });
      dirty = false;
      _.each(nodes, function(toSelect) {
        if (toSelect !== _this.getIndexedNode(toSelect)) {
          dirty = true;
        }
        return _this.selectNode(toSelect);
      });
      if (dirty && this.$scope.$ruiTree.rootState.isIndexed) {
        return this.updateNodesFromIndex();
      }
    };

    RuiTreeSelectionCtrl.prototype.updateNodesFromIndex = function() {
      var _this = this;
      return _.each(this.$scope.$ruiTree.rootState.selection.nodes, function(node, i) {
        var indexedNode;
        _this.bubbleSelectPath(node, true);
        indexedNode = _this.getIndexedNode(node);
        if (indexedNode) {
          return _this.$scope.$ruiTree.rootState.selection.nodes[i] = indexedNode;
        }
      });
    };

    RuiTreeSelectionCtrl.prototype.allowMultiSelect = function(allow) {
      if (this.$scope.$ruiTree.isRootTree) {
        return this.$scope.$ruiTree.rootState.selection.allowMultiSelect = allow;
      }
    };

    RuiTreeSelectionCtrl.prototype.allowDeselect = function(allow) {
      if (this.$scope.$ruiTree.isRootTree) {
        return this.$scope.$ruiTree.rootState.selection.allowDeselect = allow;
      }
    };

    RuiTreeSelectionCtrl.prototype.getNodeState = function(node) {
      return this.$scope.$ruiTree.getNodeState(node);
    };

    RuiTreeSelectionCtrl.prototype.selectNode = function(node) {
      if (!this.getNodeState(node).selected) {
        return this.toggleNodeSelection(node);
      }
    };

    RuiTreeSelectionCtrl.prototype.getIndexedNode = function(node) {
      return this.$scope.$ruiTree.getIndexedNode(node);
    };

    RuiTreeSelectionCtrl.prototype.toggleNodeSelection = function(node) {
      var selection, state,
        _this = this;
      selection = this.$scope.$ruiTree.rootState.selection;
      state = this.getNodeState(node);
      if (state.selected && !selection.allowDeselect) {
        return;
      }
      state.selected = !state.selected;
      node = this.getIndexedNode(node) || node;
      if (selection.allowMultiSelect) {
        if (state.selected) {
          selection.nodes = selection.nodes.concat([node]);
        } else {
          selection.nodes = _.without(selection.nodes, node);
        }
        return this.bubbleSelectPath(node, state.selected);
      } else {
        _.each(selection.nodes, function(currentlySelectedNode) {
          _this.getNodeState(currentlySelectedNode).selected = false;
          return _this.bubbleSelectPath(currentlySelectedNode, false);
        });
        if (state.selected) {
          selection.nodes = [node];
          return this.bubbleSelectPath(node, true);
        } else {
          return selection.nodes = [];
        }
      }
    };

    RuiTreeSelectionCtrl.prototype.getParent = function(node) {
      return this.$scope.$ruiTree.getParent(node);
    };

    RuiTreeSelectionCtrl.prototype.bubbleSelectPath = function(node, inSelectPath) {
      var parent, state,
        _this = this;
      state = this.getNodeState(node);
      state.inSelectPath = inSelectPath || _(node.children).map(function(n) {
        return _this.getNodeState(n).inSelectPath;
      }).any();
      if (state.inSelectPath && !state.selected) {
        state.expand = true;
      }
      if (state.inSelectPath && !inSelectPath) {
        return;
      }
      parent = this.getParent(node);
      if (parent) {
        return this.bubbleSelectPath(parent, inSelectPath);
      }
    };

    RuiTreeSelectionCtrl.prototype.watchSelectedNodes = function(nodes) {
      return this.$scope.$ruiTree.rootState.selection.node = _.first(nodes);
    };

    return RuiTreeSelectionCtrl;

  })()).controller('RuiTreeNodeSelectionCtrl', RuiTreeNodeSelectionCtrl = (function() {
    function RuiTreeNodeSelectionCtrl($scope) {
      this.$scope = $scope;
      this.getState = __bind(this.getState, this);
      this.toggleSelection = __bind(this.toggleSelection, this);
      _.extend(this.$scope.$ruiTreeNode, {
        toggleSelection: this.toggleSelection
      });
    }

    RuiTreeNodeSelectionCtrl.prototype.toggleSelection = function() {
      return this.$scope.$ruiTree.toggleNodeSelection(this.$scope.$ruiTreeNode.node);
    };

    RuiTreeNodeSelectionCtrl.prototype.getState = function() {
      return this.$scope.$ruiTreeNode.state;
    };

    return RuiTreeNodeSelectionCtrl;

  })());

}).call(this);

(function() {
  angular.module('rui.tree.controllers', ['rui.tree.controllers.tree', 'rui.tree.controllers.node', 'rui.tree.controllers.expandCollapse', 'rui.tree.controllers.selection', 'rui.tree.controllers.search']);

}).call(this);

/**
 * @ngdoc directive
 * @name rui.tree.directives:ruiTreeNodeContent
 * @description
 * Used to define how to render the text content of a node. This should generally be the node display info and
 * not include any wrapper stuff like stub-trees or expand/collapse.
*/


(function() {
  angular.module('rui.tree.directives.content', ['rui.util.template']).directive('ruiTreeNodeContent', function($parse, $compile) {
    return {
      restrict: 'EA',
      require: [],
      scope: false,
      templateUrl: 'rui/tree/templates/content.html',
      replace: true,
      priority: 10,
      link: function() {}
    };
  });

}).call(this);

(function() {
  angular.module('rui.tree.directives.expandCollapse', ['rui.tree.controllers.expandCollapse']).directive('ruiTreeExpandable', function() {
    return {
      require: ['ruiTreeCtrl'],
      controller: 'RuiTreeExpandCollapseCtrl',
      compile: function($element) {
        $element.addClass('rui-tree-outline');
        $element.addClass('rui-tree-expandable');
        $element.find('.rui-tree-nodes').attr('rui-tree-node-expandable', '');
        return function() {};
      }
    };
  }).directive('ruiTreeNodeExpandable', function() {
    return {
      require: ['ruiTreeNodeCtrl'],
      compile: function($element) {
        $element.find('.rui-tree-node-container').prepend('<div rui-tree-node-expand-collapse-toggle="" />');
        return {
          pre: function($scope, $element, $attrs, _arg) {
            var nodeController;
            nodeController = _arg[0];
            return nodeController.addSubTreeDirective('rui-tree-expandable', '');
          }
        };
      }
    };
  }).directive('ruiTreeNodeExpandCollapseToggle', function() {
    return {
      templateUrl: 'rui/tree/templates/expandCollapse.html'
    };
  }).directive('ruiTreeNodeExpandCollapseCtrl', function() {
    return {
      controller: 'RuiTreeNodeExpandCollapseCtrl'
    };
  });

}).call(this);

(function() {
  angular.module('rui.tree.directives', ['rui.tree.directives.tree', 'rui.tree.directives.node', 'rui.tree.directives.content', 'rui.tree.directives.nodeSubTreePlaceholder', 'rui.tree.directives.expandCollapse', 'rui.tree.directives.selection', 'rui.tree.directives.search']);

}).call(this);

/**
 * @ngdoc directive
 * @name rui.tree.directives:ruiTreeNode
 * @description
 * Used to define how to render a complete node (not just its content). A node includes all expand/collapse and subtree elements.
 * A node will need to specify a placeholder for the insertion of a sub 'rui-tree' for its children. See 'rui-tree-node-sub-tree-placeholder' directive.
 *
 * Uses '$scope.$ruiTreeNode.showChildren' to determine whether a sub tree should be compiled and placed in the DOM. Customizations can watch and modify this.
*/


(function() {
  angular.module('rui.tree.directives.node', ['rui.templates', 'rui.util.template', 'rui.util.timeout', 'rui.tree.controllers.node']).directive('ruiTreeNodeCtrl', function($compile, $log) {
    return {
      scope: true,
      require: ['ruiTreeNodeCtrl', '^ruiTreeCtrl'],
      controller: 'RuiTreeNodeCtrl',
      priority: 10,
      link: function($scope, $element, $attrs, _arg) {
        var controller;
        controller = _arg[0];
        $scope.$watch($attrs.ruiTreeNodeRoot, function(node) {
          return $scope.$ruiTreeNode.node = node;
        });
        if ($attrs.ruiTreeNodeThrottleSubTree) {
          controller.setThrottle($scope.$eval($attrs.ruiTreeNodeThrottleSubTree));
        }
        if ($attrs.ruiTreeNodeEagerBuild) {
          return $scope.$ruiTreeNode.eagerBuild = $scope.$eval($attrs.ruiTreeNodeEagerBuild);
        }
      }
    };
  }).directive('ruiTreeNode', function() {
    return {
      restrict: 'EA',
      require: ['ruiTreeNodeCtrl'],
      templateUrl: 'rui/tree/templates/node.html',
      replace: true,
      ruiTemplate: true,
      priority: 10,
      compile: function($element, $attrs) {
        $attrs.$set('ruiTreeNodeRoot', $attrs.ruiTreeNode);
        return function() {};
      }
    };
  });

}).call(this);

/**
 * @ngdoc directive
 * @name rui.tree.directives:ruiTreeNodeSubTreePlaceholder
 * @description
 * Registers the directive's element with the tree node as a placeholder for insertion of
 * a nested sub tree. This is compatible as a class-based directive. Simply put a node with
 * this class somewhere in your template and a sub-tree will be placed just after it.
*/


(function() {
  angular.module('rui.tree.directives.nodeSubTreePlaceholder', []).directive('ruiTreeNodeSubTreePlaceholder', function($compile) {
    return {
      restrict: 'EAC',
      require: ['^ruiTreeNodeCtrl'],
      scope: false,
      compile: function($element) {
        return {
          pre: function($scope, $element, $attrs, _arg) {
            var nodeController;
            nodeController = _arg[0];
            return nodeController.setSubTreePlaceholder($element);
          }
        };
      }
    };
  });

}).call(this);

(function() {
  angular.module('rui.tree.directives.search', ['rui.tree.controllers.search']).directive('ruiTreeSearch', function($parse) {
    return {
      require: ['ruiTreeSearch', 'ruiTreeCtrl'],
      controller: 'RuiTreeSearchCtrl',
      compile: function($element) {
        $element.addClass('rui-tree-searchable');
        $element.find('.rui-tree-nodes').attr('rui-tree-node-searchable', '').attr('ng-show', '$ruiTreeNode.showNode');
        return {
          pre: function($scope, $element, $attrs, _arg) {
            var attribute, controller;
            controller = _arg[0];
            attribute = $attrs['ruiTreeSearch'];
            if (attribute) {
              return controller.setSearchAttribute(attribute);
            }
          }
        };
      }
    };
  }).directive('ruiTreeNodeSearchable', function() {
    return {
      require: ['ruiTreeNodeCtrl'],
      controller: 'RuiTreeNodeSearchCtrl',
      compile: function($element) {
        var contentElement;
        contentElement = $element.find('.rui-tree-node-content');
        contentElement.attr('rui-tree-node-search-content', '');
        return {
          pre: function($scope, $element, $attrs, _arg) {
            var nodeController;
            nodeController = _arg[0];
            nodeController.addSubTreeDirective('rui-tree-search', '');
            return $scope.$watch('$ruiTreeNode.state.searchMatch', function(match) {
              var fn;
              fn = match ? $element.addClass : $element.removeClass;
              return fn('searchMatch');
            });
          }
        };
      }
    };
  }).directive('ruiTreeNodeSearchContent', function() {
    return {
      scope: true,
      compile: function($element) {
        $element.find('.name').attr('ng-show', '!$ruiTreeNode.showSearchMatch');
        $element.find('.name').after('<span class="name-with-match" ng-bind-html="$ruiTreeNode.state.searchMatchName" ng-show="$ruiTreeNode.showSearchMatch" />');
        return function() {};
      }
    };
  });

}).call(this);

(function() {
  angular.module('rui.tree.directives.selection', ['rui.tree.controllers.selection']).directive('ruiTreeSelectable', function($parse) {
    return {
      require: ['ruiTreeSelectable', 'ruiTreeCtrl'],
      controller: 'RuiTreeSelectionCtrl',
      compile: function($element) {
        $element.addClass('rui-tree-selectable');
        $element.find('.rui-tree-nodes').attr('rui-tree-node-selectable', '');
        return {
          pre: function($scope, $element, $attrs, _arg) {
            var allowDeselect, allowMulti, attribute, controller;
            controller = _arg[0];
            attribute = $attrs['ruiTreeSelectable'];
            allowMulti = _.contains(attribute, 'multi');
            allowDeselect = _.contains(attribute, 'deselect') || allowMulti;
            controller.allowMultiSelect(allowMulti);
            controller.allowDeselect(allowDeselect);
            if (allowDeselect) {
              $element.addClass('rui-tree-deselectable');
            }
            if ($attrs['ruiTreeSelectedNode']) {
              controller.bindSelectedNode($attrs['ruiTreeSelectedNode']);
            }
            if ($attrs['ruiTreeSelectedNodes']) {
              return controller.bindSelectedNodes($attrs['ruiTreeSelectedNodes']);
            }
          }
        };
      }
    };
  }).directive('ruiTreeNodeSelectable', function() {
    return {
      require: ['ruiTreeNodeCtrl'],
      controller: 'RuiTreeNodeSelectionCtrl',
      compile: function($element) {
        $element.find('.rui-tree-node-content').attr('ng-click', '$ruiTreeNode.toggleSelection()');
        $element.find('.rui-tree-node-content').attr('ng-class', '{selected: $ruiTreeNode.state.selected}');
        return {
          pre: function($scope, $element, $attrs, _arg) {
            var nodeController;
            nodeController = _arg[0];
            return nodeController.addSubTreeDirective('rui-tree-selectable', '');
          }
        };
      }
    };
  });

}).call(this);

/**
 * @ngdoc directive
 * @name rui.tree.directives:ruiTree
 * @description
 * Renders a tree view
 * @example
		<example module="App">
				<file name="script.js">
						angular.module('App', ['rui.tree'])
						.controller('Ctrl',
							function Ctrl($scope, $filter) {
								$scope.nodes = [
									{name: 'A', children: [{name: 'A1', children:[{name: 'A1a'}]},{name: 'A2'}]},
									{name: 'B'}
								]
								$scope.$on('rui-tree:selectedNode', function(event, selectedNode){ console.log('selected node', selectedNode)});
								$scope.$on('rui-tree:searchInProgress', function(event, inProgress){ console.log('search in progress', inProgress)});
							}
						);
				</file>
				<file name="index.html">
						<div ng-controller="Ctrl">

							<h3>Default</h3>
							<ul rui-tree="nodes track by name"/>

							<h3>Example With Mixins</h3>
							<input ng-model="searchTerm" />
							<ul rui-tree="nodes track by name" rui-tree-expandable="" rui-tree-selectable="deselect" rui-tree-search="searchTerm search by name" class="rui-tree-outline" />

						</div>
				</file>
		</example>
*/


(function() {
  angular.module('rui.tree.directives.tree', ['rui.templates', 'rui.util.template', 'rui.tree.controllers.tree', 'rui.util.trackBy']).directive('ruiTreeCtrl', function($ruiTrackBy) {
    return {
      restrict: 'EA',
      require: ['ruiTreeCtrl'],
      scope: true,
      controller: 'RuiTreeCtrl',
      priority: 10,
      link: function($scope, $element, $attrs, _arg) {
        var controller, rootExpression, trackBy, _ref, _ref1;
        controller = _arg[0];
        $scope.$ruiTree.deepWatch = $attrs['ruiTreeDeepWatch'] ? $scope.$eval($attrs['ruiTreeDeepWatch']) : false;
        $scope.$ruiTree.level = 0;
        if (((_ref = $scope.$parent) != null ? _ref.$ruiTree : void 0) != null) {
          $scope.$ruiTree.level = $scope.$parent.$ruiTree.level + 1;
        }
        _ref1 = $ruiTrackBy.parse($attrs.ruiTreeRoot), rootExpression = _ref1[0], trackBy = _ref1[1];
        controller.setTrackBy(trackBy);
        return $scope.$watch(rootExpression, controller.updateRoot, false);
      }
    };
  }).directive('ruiTree', function() {
    return {
      restrict: 'EA',
      require: ['ruiTreeCtrl'],
      templateUrl: 'rui/tree/templates/tree.html',
      replace: true,
      transclude: true,
      ruiTemplate: true,
      priority: 10,
      scope: true,
      compile: function($element, $attrs) {
        $attrs.$set('ruiTreeRoot', $attrs.ruiTree);
        return function() {};
      }
    };
  });

}).call(this);

(function() {
  angular.module('rui.tree.factories', ['rui.tree.factories.timeoutThrottle', 'rui.tree.factories.search']);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.tree.factories.search', ['rui.util.filters.regExpEscape', 'rui.util.lodash', 'ngSanitize']).factory('ruiTreeSearchFactory', function($injector) {
    var RuiTreeSearch, factory;
    RuiTreeSearch = (function() {
      function RuiTreeSearch($timeout, $log, $filter, $rootScope, $q, ruiTreeSearchCtrl, term, nodeExpression) {
        this.$timeout = $timeout;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$q = $q;
        this.ruiTreeSearchCtrl = ruiTreeSearchCtrl;
        this.term = term;
        this.nodeExpression = nodeExpression;
        this.searchExp = __bind(this.searchExp, this);
        this.escapeSearchTerm = __bind(this.escapeSearchTerm, this);
        this.cancel = __bind(this.cancel, this);
        this._searchChildren = __bind(this._searchChildren, this);
        this._search = __bind(this._search, this);
        this.search = __bind(this.search, this);
        this.$regExpEscape = $filter('regExpEscape');
        this.expression = this.searchExp(this.term);
      }

      RuiTreeSearch.prototype.search = function(root, delay) {
        var run,
          _this = this;
        run = function() {
          return _this._search(root);
        };
        if (delay) {
          return this.$timeout(run, delay, false);
        } else {
          return run(root);
        }
      };

      RuiTreeSearch.prototype._search = function(root) {
        var expression, name, state;
        if (this.cancelled) {
          return this.$q.when();
        }
        if (this.nodeExpression(root)) {
          expression = this.expression;
          name = this.nodeExpression(root);
          state = this.ruiTreeSearchCtrl.getNodeState(root);
          state.searchMatch = expression.test(name);
          state.searchMatchName = state.searchMatch ? name.replace(expression, "<span class='search-match'>$&</span>") : null;
        }
        return this.$q.when(this._searchChildren(root));
      };

      RuiTreeSearch.prototype._searchChildren = function(root) {
        var children,
          _this = this;
        children = root.children || [];
        return this.$timeout(function() {
          var childSearches;
          if (_this.cancelled) {
            return _this.$q.when();
          }
          childSearches = _.map(children, function(child) {
            return _this._search(child);
          });
          return _this.$q.all(childSearches).then(function(childStates) {
            var state;
            if (_this.cancelled) {
              return _this.$q.when();
            }
            state = _this.ruiTreeSearchCtrl.getNodeState(root) || {};
            state.inSearchMatchPath = state.searchMatch || _.any(childStates, 'inSearchMatchPath');
            return _this.$q.when(state);
          });
        }, 0, false);
      };

      RuiTreeSearch.prototype.cancel = function() {
        return this.cancelled = true;
      };

      RuiTreeSearch.prototype.escapeSearchTerm = function(term) {
        return this.$regExpEscape(term);
      };

      RuiTreeSearch.prototype.searchExp = function(term) {
        var escaped;
        escaped = this.escapeSearchTerm(term);
        return new RegExp(escaped, 'gi');
      };

      return RuiTreeSearch;

    })();
    factory = function(term, nodeExpression, ruiTreeSearchCtrl) {
      var instance, locals;
      locals = {
        term: term,
        nodeExpression: nodeExpression,
        ruiTreeSearchCtrl: ruiTreeSearchCtrl
      };
      return instance = $injector.instantiate(RuiTreeSearch, locals);
    };
    return factory;
  });

}).call(this);

(function() {
  angular.module('rui.tree.factories.timeoutThrottle', ['rui.util.timeout']).factory('ruiTreeTimeoutThrottle', function($ruiTimeoutThrottleFactory) {
    return $ruiTimeoutThrottleFactory(10);
  });

}).call(this);

(function() {
  angular.module('rui.tree', ['rui.templates', 'rui.util.template', 'rui.tree.directives', 'rui.tree.controllers', 'rui.tree.factories']);

}).call(this);

(function() {
  angular.module('rui.util.async', []).factory('async', function() {
    return async;
  });

}).call(this);

(function() {
  angular.module('rui.util.bootstrap', []);

}).call(this);

/**
 * @ngdoc service
 * @name rui.util.cache:$cacheWrap
 * @type function
 * @description
 * Helper function that returns a cached value or runs your function to cache the result and return your value as a promise.
 * If you value function returns a promise, the wrapper will wait for resolution and put the result in your cache.
*/


(function() {
  angular.module('rui.util.cache.factories.wrap', ['rui.util.lodash']).factory('$cacheWrap', function($q) {
    var $cacheWrap;
    $cacheWrap = function(cache, keyFn) {
      if (keyFn == null) {
        keyFn = _.identity;
      }
      return function(key, func) {
        var deferred;
        key = keyFn(key);
        if (cache.get(key)) {
          return $q.when(cache.get(key));
        }
        deferred = $q.defer();
        cache.put(key, deferred.promise);
        deferred.promise.then(function(result) {
          return cache.put(key, result);
        }, function() {
          return cache.remove(key);
        });
        deferred.resolve($q.when(func()));
        return deferred.promise;
      };
    };
    return $cacheWrap;
  });

}).call(this);

(function() {
  angular.module('rui.util.cache', ['rui.util.cache.factories.wrap']);

}).call(this);

(function() {
  angular.module('rui.util.element.directives.blur', []).directive('ruiBlur', function() {
    return function($scope, $element, $attrs) {
      return $scope.$watch($attrs['ruiBlur'], function(newValue) {
        if (newValue) {
          return $($element).blur();
        }
      });
    };
  });

}).call(this);

(function() {
  angular.module('rui.util.element.directives.focusMe', []).directive('ruiFocusMe', function($timeout, $parse) {
    return {
      link: function($scope, $element, $attrs) {
        var model;
        model = $parse($attrs.ruiFocusMe);
        return $scope.$watch(model, function(value) {
          if (value) {
            return $timeout(function() {
              return $element[0].focus();
            });
          }
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('rui.util.element.directives', ['rui.util.element.directives.focusMe', 'rui.util.element.directives.blur']);

}).call(this);

(function() {
  angular.module('rui.util.element', ['rui.util.element.directives']);

}).call(this);

(function() {
  angular.module('rui.util.filters', ['rui.util.filters.regExpEscape']);

}).call(this);

(function() {
  angular.module('rui.util.filters.regExpEscape', []).filter('regExpEscape', function() {
    return function(termToEscape) {
      var escaped;
      escaped = termToEscape.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      return escaped;
    };
  });

}).call(this);

(function() {
  var RuiGuid,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.util.guid', []).service('$ruiGuid', RuiGuid = (function() {
    function RuiGuid() {
      this.generate = __bind(this.generate, this);
    }

    RuiGuid.prototype.s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    RuiGuid.prototype.generate = function() {
      return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };

    return RuiGuid;

  })());

}).call(this);

(function() {
  var __slice = [].slice;

  angular.module('rui.util.http.factories.httpWrapper', ['rui.util.lodash']).factory('ruiHttpWrapper', function($http) {
    return function(baseUrl, http) {
      var getUrl, wrapper;
      if (http == null) {
        http = $http;
      }
      getUrl = function(url) {
        var toAdd;
        toAdd = url;
        if (baseUrl[baseUrl.length - 1] === '/' && url.indexOf('/') === 0) {
          toAdd = toAdd.substring(1);
        }
        return baseUrl + toAdd;
      };
      wrapper = function(urlOrConfig, config) {
        if (_.isString(urlOrConfig)) {
          urlOrConfig = getUrl(urlOrConfig);
        } else {
          urlOrConfig.url = getUrl(urlOrConfig.url);
        }
        return http.call(this, urlOrConfig, config);
      };
      _.each(['GET', 'DELETE', 'POST', 'PUT'], function(method) {
        return wrapper[method.toLowerCase()] = function() {
          var args, url, _ref;
          url = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          url = getUrl(url);
          return (_ref = http[method.toLowerCase()]).call.apply(_ref, [this, url].concat(__slice.call(args)));
        };
      });
      return wrapper;
    };
  });

}).call(this);

(function() {
  angular.module('rui.util.http', ['rui.util.http.factories.httpWrapper']);

}).call(this);

(function() {
  angular.module('rui.util.lodash', ['rui.util.lodash.sortedInsert']);

}).call(this);

(function() {
  angular.module('rui.util.lodash.sortedInsert', []).run(function() {
    _.sortedInsert = function(array, value, pluck) {
      var index;
      index = _.sortedIndex(array, value, pluck);
      array.splice(index, 0, value);
      return array;
    };
    return _.sortedReverseInsert = function(array, value, pluck) {
      _.sortedInsert(array.reverse(), value, pluck);
      return array.reverse();
    };
  });

}).call(this);

(function() {
  var RuiTemplateConfigurationHelper,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  angular.module('rui.util.template.config.helper', ['rui.util.lodash']).constant('ruiTemplateConfigurationHelper', new (RuiTemplateConfigurationHelper = (function() {
    function RuiTemplateConfigurationHelper() {
      this.wrapDirectiveFactory = __bind(this.wrapDirectiveFactory, this);
      this.toDash = __bind(this.toDash, this);
      this.DIRECTIVE_REGEX = /Directive$/;
      this.CAMEL_REGEXP = /([a-z])([A-Z])/g;
    }

    RuiTemplateConfigurationHelper.prototype.toDash = function(directiveName) {
      return directiveName.replace(this.CAMEL_REGEXP, '$1-$2').toLowerCase();
    };

    /*
    	Instruments directive definitions with 'ruiTemplate' defined by wrapping compile/link to support templating.
    */


    RuiTemplateConfigurationHelper.prototype.wrapDirective = function(directive) {
      if (directive.ruiTemplate) {
        if (directive.ruiTemplate === true) {
          directive.ruiTemplate = this.toDash(directive.name);
        }
        directive.compile = this.wrapCompile(directive.compile, directive.ruiTemplate);
        if (directive.link) {
          directive.link = this.wrapLink(directive, directive.ruiTemplate);
        }
      }
      return directive;
    };

    /*
    	Wrap a directive compile function to ng-if default content and potentially wrap a returned link def
    */


    RuiTemplateConfigurationHelper.prototype.wrapCompile = function(compileFn, templateName) {
      var self;
      if (compileFn == null) {
        compileFn = _.identity;
      }
      self = this;
      return _.wrap(compileFn, function() {
        var $element, args, compileFn, compiled;
        compileFn = arguments[0], $element = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        $element.children().attr('rui-template-if', '');
        compiled = compileFn.call.apply(compileFn, [this, $element].concat(__slice.call(args)));
        if (self.isLinkFn(compiled) || self.isLinkObject(compiled)) {
          compiled = self.wrapLink(compiled, templateName);
        }
        return compiled;
      });
    };

    RuiTemplateConfigurationHelper.prototype.isLinkFn = function(def) {
      return _.isFunction(def);
    };

    RuiTemplateConfigurationHelper.prototype.isLinkObject = function(def) {
      return _.isObject(def) && (this.isLinkFn(def.pre) || this.isLinkFn(def.post));
    };

    /*
    	Wrap a link definition with our pre-link instrumentation
    */


    RuiTemplateConfigurationHelper.prototype.wrapLink = function(linkDefinition, templateName) {
      var post, pre;
      if (_.isFunction(linkDefinition)) {
        pre = this.wrapLinkFn(templateName);
        post = linkDefinition;
        linkDefinition = {
          pre: pre,
          post: post
        };
      } else if (_.isObject(linkDefinition)) {
        linkDefinition.pre = this.wrapLinkFn(templateName, linkDefinition.pre);
      }
      return linkDefinition;
    };

    /*
    	Instruments link functions to first replace content with dynamic templates by invoking an in-scope
    	template container controller.
    */


    RuiTemplateConfigurationHelper.prototype.wrapLinkFn = function(templateName, linkFn) {
      if (linkFn == null) {
        linkFn = _.identity;
      }
      return _.wrap(linkFn, function() {
        var $attrs, $element, $scope, args, linkFn, templates;
        linkFn = arguments[0], $scope = arguments[1], $element = arguments[2], $attrs = arguments[3], args = 5 <= arguments.length ? __slice.call(arguments, 4) : [];
        templates = $element.inheritedData('$ruiTemplatesController');
        if (templates != null) {
          templates.replaceWithIfDefined(templateName, $scope, $element, $attrs);
        }
        return linkFn.call.apply(linkFn, [this, $scope, $element, $attrs].concat(__slice.call(args)));
      });
    };

    /*
    	Part of wrapping directive declarations by modifying their factory functions.
    */


    RuiTemplateConfigurationHelper.prototype.wrapDirectiveFactory = function(directiveFactory, context) {
      var self;
      self = this;
      return _.wrap(directiveFactory, function() {
        var args, directives, factory;
        factory = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        directives = factory.call.apply(factory, [context].concat(__slice.call(args)));
        _.each(directives, function(directive) {
          return self.wrapDirective(directive);
        });
        return directives;
      });
    };

    /*
    	Instrument $provide to identify and wrap all directives.
    	Note: this is closely tied to the implementation in
    		angular.module().directive
    */


    RuiTemplateConfigurationHelper.prototype.wrapProvideFactory = function(provideFactory) {
      var self;
      self = this;
      return _.wrap(provideFactory, function() {
        var args, factoryArray, factoryIndex, func, name;
        func = arguments[0], name = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        if (self.DIRECTIVE_REGEX.test(name)) {
          factoryArray = args[0];
          factoryIndex = factoryArray.length - 1;
          factoryArray[factoryIndex] = self.wrapDirectiveFactory(factoryArray[factoryIndex], this);
        }
        return func.call.apply(func, [this, name].concat(__slice.call(args)));
      });
    };

    return RuiTemplateConfigurationHelper;

  })()));

}).call(this);

/*
Required by the 'rui.util.template' module, this will instrument directive definitions to wrap them with
compile and link functions that support dynamic template overrides.

Based on angular source...
Wraps $provide.factory to search for factory definitions defined as '*Directive'. Then wraps the resulting
definitions with checks for the 'ruiTemplate'. If this is defined it will add/wrap compile and link steps to swap
content with a potential dynamic template as the first step at pre-link time.
*/


(function() {
  angular.module('rui.util.template.config', ['rui.util.lodash', 'rui.util.template.config.helper']).config(function($provide, ruiTemplateConfigurationHelper) {
    var helper;
    helper = ruiTemplateConfigurationHelper;
    return $provide.factory = helper.wrapProvideFactory($provide.factory);
  });

}).call(this);

/*
The controller for 'ruiTemplates' collects all template definitions in this container. Directives that specify
'ruiTemplate' in their definition will make use of the collected dynamic templates by requiring and using
this controller to merge the template on to their element.
*/


(function() {
  var RuiTemplateContainerCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.util.template.controllers.templateContainer', []).controller('RuiTemplateContainerCtrl', RuiTemplateContainerCtrl = (function() {
    function RuiTemplateContainerCtrl($scope, $compile) {
      this.$scope = $scope;
      this.$compile = $compile;
      this.replaceWithIfDefined = __bind(this.replaceWithIfDefined, this);
      this.replaceWith = __bind(this.replaceWith, this);
      this.hasTemplate = __bind(this.hasTemplate, this);
      this.name = 'RuiTemplateContainerCtrl';
      this.templates = [];
    }

    RuiTemplateContainerCtrl.prototype.hasTemplate = function(name) {
      return !!this.templates[name];
    };

    RuiTemplateContainerCtrl.prototype.attributes = function($element) {
      return $element[0].attributes || [];
    };

    RuiTemplateContainerCtrl.prototype.classes = function($element) {
      var _ref;
      return ((_ref = $element.attr('class')) != null ? _ref.split(/\s+/) : void 0) || [];
    };

    RuiTemplateContainerCtrl.prototype.getTemplate = function(name) {
      return $(this.templates[name].html);
    };

    /*
    		Replaces an elements content by compiling the template and binding to the scope. Copies over all classes
    		and attributes from the template.
    */


    RuiTemplateContainerCtrl.prototype.replaceWith = function(name, $scope, $element, $attrs) {
      var $template, $templateAttributes, $templateClasses;
      $template = this.getTemplate(name);
      $templateAttributes = this.attributes($template);
      $templateClasses = this.classes($template);
      _($templateAttributes).reject({
        name: 'class'
      }).each(function(_arg) {
        var name, value;
        name = _arg.name, value = _arg.value;
        return $attrs.$set(name, value);
      });
      _.each($templateClasses, function(className) {
        return $element.addClass(className);
      });
      $element.empty();
      $template.contents().appendTo($element);
      this.$compile($element.contents())($scope);
      return $element;
    };

    /*
    		If a template is defined, call to replace the contents. Sets 'ruiTemplate' to true/false on the scope.
    */


    RuiTemplateContainerCtrl.prototype.replaceWithIfDefined = function(name, $scope, $element, $attrs) {
      if (this.hasTemplate(name)) {
        $scope.$ruiTemplate = true;
        return this.replaceWith.apply(this, arguments);
      } else {
        return $scope.$ruiTemplate = false;
      }
    };

    return RuiTemplateContainerCtrl;

  })());

}).call(this);

(function() {
  angular.module('rui.util.template.controllers', ['rui.util.template.controllers.templateContainer']);

}).call(this);

(function() {
  angular.module('rui.util.template.directives', ['rui.util.template.directives.template', 'rui.util.template.directives.templateContainer', 'rui.util.template.directives.templateIf']);

}).call(this);

/**
 * @ngdoc directive
 * @name rui.util.template.directives:ruiTemplate
 * @description
 * Registers an element as a dynamic template. Content of this element should have a root node which
 * will be interpreted like a directive template. The 'ruiTemplates' directive should be used in conjunction with
 * this directive to provide a context/scoping container for template definitions.
 * All attributes and classes of this node as well as
 * contents will be copied on to a directive that uses your template.
 *
 * @example
		<example module="App">
				<file name="script.js">
						angular.module('App', ['rui.util.template'])
						.controller('Ctrl',
							function Ctrl($scope, $filter) {
								$scope.defaultProperty = "defaultProperty";
								$scope.anotherProperty = "overriden";
							}
						)
						.directive('myCustomizableDirective', function(){
							return {
								scope: true,
								replace: true,
								template: '<div><span ng-bind="defaultProperty" /></div>',
								ruiTemplate: true,
								link: function(){}
							}
						})
						.directive('anotherCustomizableDirective', function(){
							return {
								scope: true,
								replace: true,
								template: '<div><span ng-bind="defaultProperty" /></div>',
								ruiTemplate: 'my-custom-template',
								link: function(){}
							}
						});
				</file>
				<file name="index.html">
						<div ng-controller="Ctrl">

							<h3>Default</h3>
							<div my-customizable-directive />

							<h3>Template Overriden</h3>
							<div rui-templates>
								<div rui-template name="my-customizable-directive">
									<div><span>{{anotherProperty}}</span></div>
								</div>
								<div my-customizable-directive />
							</div>

							<h3>Directive with named template</h3>
							<div rui-templates>
								<div rui-template name="my-custom-template">
									<div>I totally did something unique here</div>
								</div>
								<div another-customizable-directive />
							</div>

						</div>
				</file>
		</example>
*/


(function() {
  angular.module('rui.util.template.directives.template', []).directive('ruiTemplate', function($parse, $compile) {
    return {
      restrict: 'EA',
      require: ['^ruiTemplates'],
      scope: true,
      compile: function($element, $attrs) {
        var html, name;
        name = $attrs.name;
        if (!name) {
          throw new Error('rui-template must have a name attribute');
        }
        html = $element.html().trim();
        $element.empty();
        return {
          pre: function($scope, $element, $attrs, _arg) {
            var containerController;
            containerController = _arg[0];
            $element.remove();
            $scope.$destroy();
            return containerController.templates[name] = {
              html: html
            };
          }
        };
      }
    };
  });

}).call(this);

/**
 * @ngdoc directive
 * @name rui.util.template.directives:ruiTemplates
 * @description
 * Registers a relative container for all 'ruiTemplate' definitions underneath it. Templates will collect and be defined
 * at this level for all components underneath that are making use of them.
 *
*/


(function() {
  angular.module('rui.util.template.directives.templateContainer', ['rui.util.template.controllers.templateContainer']).directive('ruiTemplates', function($parse, $compile) {
    return {
      restrict: 'EAC',
      scope: false,
      controller: 'RuiTemplateContainerCtrl',
      priority: 99999,
      link: function() {}
    };
  });

}).call(this);

/**
 * Implementation of ng-if that will run only once.
 *
*/


(function() {
  angular.module('rui.util.template.directives.templateIf', []).directive('ruiTemplateIf', function($parse, $compile) {
    return {
      transclude: 'element',
      priority: 600,
      terminal: true,
      restrict: 'A',
      compile: function($element) {
        return function($scope, $element, $attr, ctrl, $transclude) {
          if (!$scope.$ruiTemplate) {
            return $transclude($scope.$new(), function(clone) {
              return clone.insertAfter($element);
            });
          }
        };
      }
    };
  });

}).call(this);

(function() {
  angular.module('rui.util.template', ['rui.util.template.config', 'rui.util.template.controllers', 'rui.util.template.directives', 'rui.util.lodash']);

}).call(this);

(function() {
  var __slice = [].slice;

  angular.module('rui.util.timeout', []).factory('$ruiTimeoutThrottleFactory', function($timeout) {
    return function(max) {
      var processNext, queue, running;
      queue = [];
      running = 0;
      processNext = function() {
        var args, context, next;
        if (running >= max) {
          return;
        }
        next = queue.shift();
        context = next[0];
        args = next.slice(1);
        running = running + 1;
        return $timeout.apply(context, args)['finally'](function() {
          running = running - 1;
          return processNext();
        });
      };
      return function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        queue.push([this].concat(args));
        return processNext();
      };
    };
  }).factory('$ruiTimeoutThrottle', function($ruiTimeoutThrottleFactory) {
    return $ruiTimeoutThrottleFactory(10);
  });

}).call(this);

(function() {
  var RuiTrackBy;

  angular.module('rui.util.trackBy', ['rui.util.guid']).service('$ruiTrackBy', RuiTrackBy = (function() {
    function RuiTrackBy($ruiGuid, $parse) {
      this.$ruiGuid = $ruiGuid;
      this.$parse = $parse;
    }

    RuiTrackBy.prototype.parse = function(expression) {
      var split, trackBy, valueExpression;
      split = expression.split(' track by ');
      valueExpression = this.$parse(split[0]);
      if (split.length === 2) {
        trackBy = this.$parse(split[1]);
      } else {
        trackBy = this.$ruiGuid.generate;
      }
      return [valueExpression, trackBy];
    };

    return RuiTrackBy;

  })());

}).call(this);

(function() {
  var TranscludeCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('rui.util.transclude.directives.controllers.transclude', []).controller('TranscludeCtrl', TranscludeCtrl = (function() {
    TranscludeCtrl.$inject = ['$scope', '$transclude', '$window'];

    function TranscludeCtrl($scope, $transclude, $window) {
      this.$scope = $scope;
      this.$transclude = $transclude;
      this.$window = $window;
      this.transclude = __bind(this.transclude, this);
      this.filter = __bind(this.filter, this);
      if (!this.$transclude) {
        throw "ruiTransclude:orphan,\nIllegal use of ruiTransclude directive in the template!\nNo parent directive that requires a transclusion found.\nElement: {#$element}\n";
      }
    }

    TranscludeCtrl.prototype.filter = function(clone, filter) {
      var $clone, filtered, postMeta, sorted;
      $clone = $(clone);
      filtered = $clone.filter(filter);
      postMeta = [];
      _.each(filtered, function(e) {
        var $e, index;
        $e = $(e);
        if ($e.hasClass('rui-transclude-meta')) {
          index = $clone.index($e);
          e = _.find(clone, function(node, i) {
            return i > index && node.nodeType !== 3;
          });
        }
        return postMeta.push(e);
      });
      sorted = _.sortBy(postMeta, function(e) {
        return _.indexOf(clone, e);
      });
      return sorted;
    };

    TranscludeCtrl.prototype.transclude = function($element, filter, required) {
      var boundTranscludeFn,
        _this = this;
      if (required == null) {
        required = true;
      }
      boundTranscludeFn = function(clone) {
        var toAppend;
        if (filter) {
          toAppend = _this.filter(clone, filter);
        } else {
          toAppend = clone;
        }
        if (required && !toAppend.length > 0) {
          throw "ruiTransclude:empty,\n  Illegal use of ruiTransclude. Can't find elements to transclude in the clone.\n  Maybe you're using directives that result in virtual elements like ng-repeat or ng-if? If so, try \n  using an element wrapper or comment before the node (<!-- directive: rui-transclude-class myClass -->) to\n  tell rui-transclude what to pull.\n  Element: " + $element + "\n  Filter: " + filter + "\n";
        }
        $element.html('');
        return $element.append(toAppend);
      };
      return this.$transclude(this.$scope, boundTranscludeFn);
    };

    return TranscludeCtrl;

  })());

}).call(this);

/**
 * @ngdoc directive
 * @name rui.utils.transclude.directives:ruiTranscludeAttribute
 * @description
 *
*/


(function() {
  var transclude;

  transclude = angular.module('rui.util.transclude.directives.attribute', []).directive('ruiTranscludeAttr', [
    function() {
      return {
        restrict: 'M',
        templateUrl: 'rui/util/transclude/templates/transclude-meta.html',
        replace: true,
        compile: function(tElem, tAttr, transcludeFn) {
          return {
            post: function($scope, $element, $attrs) {},
            pre: function($scope, $element) {
              return $element.remove();
            }
          };
        }
      };
    }
  ]);

}).call(this);

/**
 * @ngdoc directive
 * @name rui.utils.transclude.directives:ruiTranscludeClass
 * @description
 * Similar to ng-transclude, allows specification of jquery selectors for use with multiple transclusion points.
 * Specify a filter as the rui-transclude attribute value to select what content should be appended into the 
 * current transclusion point. You can specify 'rui-transclude-optional' to allow for soft transcldes (where
 * there may be no content to push).
 *
*/


(function() {
  var transclude;

  transclude = angular.module('rui.util.transclude.directives.class', []).directive('ruiTranscludeClass', [
    '$compile', function($compile) {
      return {
        restrict: 'M',
        /* 
        Since angular ends up cloning this node a bunch of times, the only way to get something that can
        be used by rui-transclude's filter is to let it be a real element. We'll treat it special in
        rui-transclude's custom transclude function and then this element can remove itself to cleanup.
        */

        templateUrl: 'rui/util/transclude/templates/transclude-meta.html',
        transclude: 'element',
        replace: true,
        compile: function(tElem, tAttr, transcludeFn) {
          tElem.addClass(tAttr.ruiTranscludeClass);
          return {
            post: function($scope, $element, $attrs) {},
            pre: function($scope, $element) {
              return $element.remove();
            }
          };
        }
      };
    }
  ]);

}).call(this);

/**
 * @ngdoc directive
 * @name rui.utils.transclude.directives:ruiTransclude
 * @description
 * Similar to ng-transclude, allows specification of jquery selectors for use with multiple transclusion points.
 * Specify a filter as the rui-transclude attribute value to select what content should be appended into the 
 * current transclusion point. You can add the attribute 'rui-transclude-optional' to allow for soft transcludes (where
 * there may be no content to push).
 * 
 * Some angular directives like ng-if and ng-repeat will create html comment nodes at the time of transclusion.
 * When this is the case, you can use the 'rui-transclude-class' and 'rui-transclude-attr' directives to get these
 * nodes transcluded. They will be treated specially by the linking function, and the next non-text node will be used
 * in the transclusion instead.
 * 
 * @example
    <example module="App">
        <file name="script.js">
            angular.module('App', ['rui.util.transclude'])
            .controller('Ctrl',
              function Ctrl($scope) {
                  $scope.array = [1,2,3];                  
              }
            )
            .directive('myDirective', function(){
              return {
                transclude: true,
                replace: true,
                scope: true,
                require: ['?ngModel'],
                template: '<div><div rui-transclude=".section1"></div><div rui-transclude="[section2]"></div></div>',
                link: function(){}
              }
            });
        </file>
        <file name="index.html">
            <div ng-controller="Ctrl">           
              <div my-directive ng-model="blah">
                <!-- directive: rui-transclude-class section1 -->
                <div ng-repeat="value in array" class="section1">
                  <span>{{value}}, Section1 uses a class filter and requires a meta tag because of ng-repeat</span>
                </div>
                <div section2>
                  Section2 uses an attribute filter
                </div>
              </div>
            </div>
        </file>
    </example>
*/


(function() {
  var module;

  module = angular.module('rui.util.transclude.directives.transclude', ['rui.util.transclude.directives.controllers.transclude']).directive('ruiTransclude', [
    '$timeout', function($timeout) {
      return {
        restrict: 'A',
        controller: 'TranscludeCtrl',
        link: {
          post: function($scope, $element, $attrs, controller) {
            var filter, required;
            filter = $attrs.ruiTransclude;
            if (filter == null) {
              filter = filter.trim();
            }
            if ((filter != null) === 'rui-transclude' || (filter != null) === '') {
              filter = null;
            }
            required = $attrs.ruiTranscludeOptional != null ? false : true;
            return $scope.$evalAsync(function() {
              return controller.transclude($element, filter, required);
            });
          }
        }
      };
    }
  ]);

}).call(this);

(function() {
  var transclude;

  transclude = angular.module('rui.util.transclude', ['rui.templates', 'rui.util.transclude.directives.transclude', 'rui.util.transclude.directives.class', 'rui.util.transclude.directives.attribute']);

}).call(this);

(function() {
  var util;

  util = angular.module('rui.util', ['rui.util.transclude', 'rui.util.template', 'rui.util.lodash', 'rui.util.cache', 'rui.util.http', 'rui.util.bootstrap', 'rui.util.element', 'rui.util.timeout', 'rui.util.guid', 'rui.util.trackBy']);

}).call(this);
