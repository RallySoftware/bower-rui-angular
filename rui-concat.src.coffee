cardboard = angular.module 'rui.cardboard', [
  'rui.templates'
  'rui.cardboard.directives.cardboard'
  'rui.cardboard.directives.column'
  'rui.cardboard.directives.card'
  'rui.cardboard.directives.columnscrollable'
  'rui.cardboard.directives.columnscrollbars'
  'rui.cardboard.filters.wip'
]
module = angular.module('rui.cardboard.controllers.card', [])

module.controller 'rui.cardboard.controllers.card',
  class CardCtrl

    @$inject = ['$scope', '$attrs']
    constructor: (@$scope, $attrs) ->
      @$card = @$scope.$card = @$scope.$new()

      if $attrs.ruiCardColor
        $attrs.$observe 'ruiCardColor', (color) =>
          @$card.color = color
module = angular.module('rui.cardboard.controllers.cardboard', [])

module.controller 'rui.cardboard.controllers.cardboard',
  class CardboardCtrl

    @$inject = ['$timeout']
    constructor: (@$timeout) ->
      @columns = []
      @columnWidth = 0

    _adjustColumns: ->
      @columnWidth = (100 / @columns.length)
      angular.forEach @columns, (column) =>
        column.width = "#{@columnWidth}%"

    
    ###*
    * @ngdoc function
    * @name rui.cardboard.controllers.cardboard#addColumn
    * @methodOf rui.cardboard.directives:ruiCardboard
    * @param {Object} scope The column's scope
    * @description
    * This should be called by a column within a cardboard. This method will tie a column and cardboard together.
    * This method will eventually coordinate the width of each column within the cardboard
    ###
    addColumn: (column) ->
      @columns.push column
      column.cardboard = @
      
      # set up the timer to adjust the header height
      # the following code is to debounce
      @$timeout.cancel @adjustTimer if @adjustTimer
      @adjustTimer = @$timeout => @_adjustColumns()

    ###*
    * @ngdoc function
    * @name rui.cardboard.controllers.cardboard#removeColumn
    * @methodOf rui.cardboard.directives:ruiCardboard
    * @param {Object} scope The column's scope
    * @description
    * This should be called by a column within a cardboard. This method will remove the column from the columns
    * tracked by the cardboard.
    * This method will eventually coordinate the width of each column within the cardboard
    ###
    removeColumn: (column) ->
      @columns = _.filter @columns, (col) -> col isnt column
      
      # set up the timer to adjust the header height
      # the following code is to debounce
      @$timeout.cancel @adjustTimer if @adjustTimer
      @adjustTimer = @$timeout => @_adjustColumns()
module = angular.module 'rui.cardboard.controllers.column', []

module.controller 'rui.cardboard.controllers.column',
  class ColumnCtrl

    constructor: ->

    ###*
    * @ngdoc function
    * @name rui.cardboard.controllers.column#addCard
    * @methodOf rui.cardboard.directives:ruiColumn
    * @param {Object} scope The card's scope
    * @description
    * This should be called by a card within a column when a card is rendered. This method will tie a card and column together
    ###
    addCard: (card) ->
      card.column = @

    ###*
    * @ngdoc function
    * @name rui.cardboard.controllers.column#removeCard
    * @methodOf rui.cardboard.directives:ruiColumn
    * @param {Object} scope The card's scope
    * @description
    * This should be called by a card within a column when a card is removed
    ###
    removeCard: (card) ->

angular.module('rui.cardboard.controllers.columnscrollable', [])

.controller 'rui.cardboard.controllers.columnscrollable',
  class ColumnScrollableCtrl

    currentIndex: 0
    scrollableColumns: []
    numColumns: 3
    columns: []

    @$inject = ['$scope', '$attrs']
    constructor: ($scope, $attrs) ->
      columnsProp = $attrs.ruiColumnScrollable
      @numColumns = +$attrs.numColumns if $attrs.numColumns
      columns = $scope.$eval columnsProp

      @initColumns columns if columns?.length

      @columnsWatchListener = $scope.$watch("#{columnsProp}.length", (newValue, oldValue) =>

        if oldValue is undefined or newValue > oldValue
          @initColumns $scope.$eval(columnsProp)
        
        # remove this listener if the array shrank - which means we're picking up the changes
        # from us removing columns - we don't need to watch any more
        @columnsWatchListener() if oldValue is undefined or newValue < oldValue
      )

    initColumns: (columns) ->
      @columns = columns
      # console.log 'columns', @columns
      @scrollableColumns = [].concat @columns # make a copy
      @scrollColumns()
    
    ###*
    * @ngdoc function
    * @name rui.cardboard.controllers.columnscrollable#scrollRight
    * @methodOf rui.cardboard.directives:ruiColumnScrollable
    * @description
    * This method will scroll the visible columns to the right
    ###
    scrollRight: =>
      @currentIndex++
      @scrollColumns()

    ###*
    * @ngdoc function
    * @name rui.cardboard.controllers.columnscrollable#scrollLeft
    * @methodOf rui.cardboard.directives:ruiColumnScrollable
    * @description
    * This method will scroll the visible columns to the left
    ###
    scrollLeft: =>
      @currentIndex--
      @scrollColumns()

    scrollColumns: ->
      # We need to maintain the columns variable reference
      @columns.length = 0

      _.each @scrollableColumns.slice(@currentIndex, @currentIndex + @numColumns), (column, index, columns) =>

        @columns.push column
        column.visible = true
        column.scrollRight = @scrollRight
        column.scrollLeft = @scrollLeft
        if index is 0 and @columns[0] isnt @scrollableColumns[0]
          column.canScrollLeft = true
        else
          column.canScrollLeft = false
        if index is @numColumns - 1 and @columns[@numColumns - 1] isnt @scrollableColumns[@scrollableColumns.length - 1]
          column.canScrollRight = true
        else
          column.canScrollRight = false

        return true
module = angular.module('rui.cardboard.directives.card', [
  'rui.cardboard.directives.column'
  'rui.cardboard.controllers.card'
])

###*
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
###
module.directive 'ruiCard', ->
  restrict: 'EA'
  transclude: true
  replace: true
  require: ['ngModel', '^?ruiColumn']
  templateUrl: 'rui/cardboard/template/rui-card.html'

  controller: 'rui.cardboard.controllers.card'

  compile: (tElement, tAttrs, transcludeFn) ->
    (scope, element, attrs, [ngModel, columnCtrl]) ->

      card = scope.$eval(attrs.ngModel)

      columnCtrl?.addCard card
      scope.$emit 'cardrendered', card

      # notify the cardboard when a column is removed
      element.on '$destroy', ->
        columnCtrl?.removeCard card

cardboard = angular.module('rui.cardboard.directives.cardboard', [
  'rui.cardboard.controllers.cardboard'
])

###*
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
###
cardboard.directive 'ruiCardboard', ->
  restrict: 'EA'
  transclude: true
  replace: true
  controller: 'rui.cardboard.controllers.cardboard'
  templateUrl: 'rui/cardboard/template/rui-cardboard.html'

  compile: (tElement, tAttrs) ->
    (scope, element, attrs, controller) ->

column = angular.module('rui.cardboard.directives.column', [
  'rui.cardboard.controllers.column'
  'rui.cardboard.directives.cardboard'
])

###*
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
###
column.directive 'ruiColumn', ->
  restrict: 'EA'
  transclude: true
  require: ['ngModel', '^?ruiCardboard']
  replace: true
  templateUrl: 'rui/cardboard/template/rui-column.html'

  controller: 'rui.cardboard.controllers.column'

  compile: (tElement, tAttr, transcludeFn) ->
    (scope, element, attrs, [ngModel, cardboardCtrl]) ->
      column = scope.$eval attrs.ngModel
      
      # notify the cardboard when a column is added
      cardboardCtrl?.addColumn column

      # notify the cardboard when a column is removed
      element.on '$destroy', ->
        cardboardCtrl?.removeColumn column

module = angular.module('rui.cardboard.directives.columnscrollable', [
  'rui.cardboard.controllers.columnscrollable'
])

###*
* @ngdoc directive
* @name rui.cardboard.directives:ruiColumnScrollable
* @restrict A
* @param {string} ngModel An array variable on the current scope that should be managed by this directive
* @description
* This directive allows an {@link api/rui.cardboard.directives:ruiColumn ruiColumn} directive to
*   become scrollable if there are too many columns to display
###
module.directive 'ruiColumnScrollable', () ->
  restrict: 'A'
  
  ###
  Make this a high priority
  It needs to be run before any other directive is run since it changes the model property
  that is set to this directive
  ###
  priority: 100000

  controller: 'rui.cardboard.controllers.columnscrollable'
columnscrollbars = angular.module('rui.cardboard.directives.columnscrollbars', [
  'rui.cardboard.directives.column'
])

###*
* @ngdoc directive
* @name rui.cardboard.directives:ruiColumnScrollbars
* @restrict A
* @description
* This directive is a simple component to show scrollbars.
* It is meant to be used with the {@link rui.cardboard.directives:ruiColumnScrollable ruiColumnScrollable}
*   directive. It should be used in the content-header of an {@link api/rui.cardboard.directives:ruiColumn ruiColumn}
###
columnscrollbars.directive 'ruiColumnScrollbars', ->
  restrict: 'A'
  require: ['ngModel', '^ruiColumn']
  templateUrl: 'rui/cardboard/template/rui-column-scrollbars.html'

  compile: (tElement, tAttrs) ->
    (scope, element, attrs, controllers) ->
      [model, columnCtrl] = controllers

      scope.model = scope.$eval(attrs.ngModel)
angular.module('rui.cardboard.filters.wip', [])

.filter 'wip', ->
  (input) ->
    if input is 0
      '∞'
    else
      input
angular.module('rui.dropdown.directives.controllers.dropdown', [])
.controller 'DropdownCtrl',
  class DropdownCtrl

    @$inject = ['$scope']
    constructor: (@$scope) ->
      @$dropdown = @$scope.$dropdown = @$scope.$new()
      @$dropdown.isDisabled = false
      @$dropdown.isOpen = false
      @$dropdown.toggleOpen = @toggleOpen
      @$dropdown.onBlur = @onBlur

    select: (value) =>
      if not @$dropdown.isDisabled
        @$dropdown.selected = value
        @toggleOpen(false)
        return true
      else
        return false
      
    toggleOpen: (open = !@$dropdown.isOpen) =>
      @$dropdown.isOpen = open
    
    onBlur: (e) =>
      @$dropdown.isOpen = false
angular.module('rui.dropdown.directives.controllers.item', [])
.controller 'ItemCtrl',
  class ItemCtrl

    @$inject = ['$scope']
    constructor: (@$scope) ->
      @$dropdownItem = @$scope.$dropdownItem = @$scope.$new()
      @$dropdownItem.isSelected = false
      @$dropdownItem.select = @select
      @$dropdownItem.value = null
      
    select: () =>
      if not @$dropdownItem.isDisabled
        @$dropdownItem.isSelected = @$dropdownItem.selectItem(@$dropdownItem.value)


###*
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
###
module = angular.module('rui.dropdown.directives.dropdown', [
  'rui.dropdown.directives.controllers.dropdown'
])
.directive 'ruiDropdown', [() ->
  restrict: 'EA'
  controller: 'DropdownCtrl'
  require: ['ngModel']
  transclude: 'true'
  scope: true
  replace: true  
  templateUrl: 'rui/dropdown/templates/dropdown.html'

  compile: (tElement, tAttrs, transcludeFn) ->
    tElement.addClass 'rui-dropdown'
    if not tElement.attr('tabindex') then tElement.attr('tabindex', 0)
    (scope, element, attrs, [ngModel]) ->
      
      # Grab focus for blur events to be able to close
      scope.$watch('$dropdown.isOpen', (isOpen) ->
        if isOpen then $(element).focus()
      )
      $(element).blur((e) -> scope.$apply(()->scope.$dropdown.onBlur(e)))
      # Bind the disabled attribute to the scope so this and children can modify behavior
      attrs.$observe('disabled', (isDisabled) -> scope.$dropdown.isDisabled = isDisabled)
      scope.$watch('$dropdown.selected', (value)-> ngModel.$setViewValue(value))
      scope.$watch( (()->return ngModel.$modelValue), (value)-> scope.$dropdown.value = value)

      transcludeFn scope, (clone) ->
        # Find the field label and transclude it into the label of our template
        theLabelElement = $('.rui-dropdown-label-container', element)
        theLabelElement.addClass('rui-dropdown-label')
        theLabelElement.append($(clone).filter('.rui-dropdown-label, [rui-dropdown-label]'))
        # Append menu directly into container
        theDropdownMenu = $(clone).filter('.rui-dropdown-menu, [rui-dropdown-menu]')
        theDropdownMenu.addClass('rui-dropdown-menu')
        element.append(theDropdownMenu)
]

###*
 * @ngdoc directive
 * @name rui.dropdown.directives:ruiDropdownItem
 * @description
 * Denotes a selectable item from the dropdown menu
###
dropdown = angular.module('rui.dropdown.directives.item', [
  'rui.dropdown.directives.controllers.item'
])
.directive 'ruiDropdownItem', [() ->
  restrict: 'EA'
  controller: 'ItemCtrl'
  require: ['ngModel', '^ruiDropdown']
  transclude: 'true'
  scope: true
  replace: true  
  templateUrl: 'rui/dropdown/templates/dropdown-item.html'

  compile: (tElement, tAttrs, transcludeFn) ->
    tElement.addClass 'rui-dropdown-item'
    (scope, element, attrs, [ngModel, dropdownController]) ->
      # Watch ngModel and sync the item's value
      scope.$watch( (()-> ngModel.$modelValue), (value) -> scope.$dropdownItem.value = value)
      # Expose the parent controller's method to select items
      scope.$dropdownItem.selectItem = dropdownController.select
      # Watch the dropdown selection to undo this item's state
      dropdownController.$dropdown.$watch('selected', (value) -> scope.$dropdownItem.isSelected = value is scope.$dropdownItem.value)

      # Bind the disabled attribute to the scope so this and children can modify behavior
      attrs.$observe('disabled', (isDisabled) -> scope.$dropdownItem.isDisabled = isDisabled)

      transcludeFn scope, (clone) ->
        element.append(clone) # Append inside -dropdown-container
]

dropdown = angular.module 'rui.dropdown', [
  'rui.templates'
  'rui.dropdown.directives.dropdown'
  'rui.dropdown.directives.item'
]
angular.module('rui.highcharts.directives.controllers.highcharts', [])
.controller 'HighchartsCtrl',
  class HighchartsCtrl

    events = ['load','click','redraw','selection']

    @$inject = ['$scope', 'Highcharts']
    constructor: (@$scope, @Highcharts) ->
      @$scope.$highcharts = @$scope.$new()
      @$scope.$highcharts.hideSeries = @hideSeries

    hideSeries: (n) =>
      @$scope.$highcharts.chart.series[n]?.hide()

    ###
    @param {element}
    @param {options} Highcharts configuration object
    @public
    ###
    initHighcharts: (element, options={}) ->
      @events = options?.chart?.events
      defaults = 
        chart:
          renderTo: element[0]
          events: {}        
      # bind all chart events to this controller so we can delegate
      for event in events
        defaults.chart.events[event] = @_onEvent(event)

      options = _.merge(options, defaults)          
      @$scope.$highcharts.chart = new @Highcharts.Chart(options)
      return @$scope.$highcharts.chart

    ###
    Delegate to highcharts events from the config, then broadcast the chart 
    events down the directive scope.
    ###
    _onEvent: (eventName) =>
      return (e) =>
        @events?[eventName]?.apply(@highcharts, arguments)
        @$scope.$broadcast("chart:#{eventName}", e)
        if not @$scope.$$phase then @$scope.$digest()

angular.module('rui.highcharts.directives.controllers.html', [])
.controller 'HighchartsHtmlCtrl',
  class HighchartsHtmlCtrl

    @$inject = ['$scope']
    constructor: (@$scope) ->
      @$scope.$highchartsHtml = @$scope.$new()

# angular.module('rui.highcharts.directives.controllers.metric', [])

# .controller 'MetricCtrl',
#   class MetricCtrl

#     modes:
#       raw: 
#         name: 'raw'
#         series: 0
#       scores: 
#         name: 'scores'
#         series: 1

#     @$inject = ['$scope']
#     constructor: ($scope) ->
#       @$scope.highcharts = null
#       @$scope.mode = @modes.scores.name

#       @$scope.$watch('mode', (mode) =>
#         @setMode(mode)
#       )

#       @$scope.$watch('highcharts', =>
#         @setMode($scope.mode)
#       )

#     setMode: (mode) ->
#       for i,series in @$scope.highcharts.series
#          if @modes[mode].series is i then series.show() else series.hide()

#     ###
#     @param {element}
#     @param {options} Highcharts configuration object
#     @public
#     ###
#     initHighcharts: (element, options) ->
#       @highcharts = new @Highcharts(options)
#       return @highcharts

#     renderHtml: (html, x, y) ->
#       @highcharts.on('load' () =>
#         @highcharts.renderer.html(html, x, y)
#       )

angular.module('rui.highcharts.directives.controllers.toggle', [])

.controller 'ToggleCtrl',
  class ToggleCtrl

    @$inject = ['$scope']
    constructor: (@$scope) ->
    	debugger
    	@toggleTest = 'test'
    	@$scope.$watch('state', (state) =>
    		switch state
    			when 'scores' then @$scope.$highcharts.chart.series[0].hide()
    			when 'metric' then @$scope.$highcharts.chart.series[0].hide()    		
    	)

    toggleIt: () =>
    	debugger
###*
 * @ngdoc directive
 * @name rui.highcharts.directives:ruiHighcharts
 * @description
 * The base for highcharts directives. This creates a new Highcharts.Chart rendered to the directive's template.
 * @example
    <example module="App">
        <file name="script.js">
            angular.module('App', ['rui.highcharts'])
            .controller('Ctrl',
              function Ctrl($scope) {
                  $scope.highchartsConfig = {
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
              }
            );
        </file>
        <file name="index.html">
            <div ng-controller="Ctrl">              
              <div rui-highcharts highcharts-config="highchartsConfig"></div>
            </div>
        </file>
    </example>
###
highcharts = angular.module('rui.highcharts.directives.highcharts', [
  'rui.highcharts.directives.controllers.highcharts',
  'rui.highcharts.factories.highcharts'
])

.directive 'ruiHighcharts', [() ->
  restrict: 'EA'
  controller: 'HighchartsCtrl'
  require: ['?ngModel', 'ruiHighcharts']
  transclude: true
  scope: true
  replace: true  
  templateUrl: 'rui/highcharts/templates/highcharts.html'

  compile: (tElement, tAttrs, transcludeFn) ->
    tElement.addClass 'rui-highcharts'
    (scope, element, attrs, [ngModel, controller]) ->
      options = scope.$eval(attrs.highchartsConfig)
      renderTo = $('.rui-highcharts-container', element) # TODO, element.find in angular 1.2 will work instead of jquery
      chart = controller.initHighcharts(renderTo, options)
      if ngModel? then ngModel.$setViewValue(chart)
      transcludeFn scope, (clone) ->
        $('.rui-highcharts-html-container', element).append clone
]

###*
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
###
angular.module('rui.highcharts.directives.html', [
  'rui.highcharts.directives.controllers.highcharts'
  'rui.highcharts.directives.controllers.html'
])

.directive 'ruiHighchartsHtml', [() ->
  restrict: 'EA'
  transclude: false
  require: ['^ruiHighcharts']
  controller: 'HighchartsHtmlCtrl'
  scope: true
  
  compile: (tElement, tAttrs) ->
    tElement.addClass 'rui-highcharts-html'
    (scope, element, attrs, [highchartsController]) ->
      scope.$highcharts = highchartsController.$scope.$highcharts
]
###*
 * @ngdoc service
 * @name rui.highcharts.factories:Highcharts
 * @description
 * Returns the global Highcharts module. Allows for decorating or mocking.
###
highcharts = angular.module('rui.highcharts.factories.highcharts', [])
.factory('Highcharts', () ->
  return Highcharts
)

highcharts = angular.module 'rui.highcharts', [
  'rui.templates'
  'rui.highcharts.directives.highcharts'
  'rui.highcharts.directives.html'
  'rui.highcharts.factories.highcharts'
]

angular.module('rui.quickmenu.directives.quickmenu', [])

.directive 'ruiQuickmenu', ->
  restrict: 'EA'
  scope:
    items: '='
  templateUrl: 'rui/menu/quickmenu/template/rui-quickmenu.html'

  compile: (tElement, tAttrs) ->
    tElement.addClass 'rui-quickmenu'

    (scope, element, attributes) ->
      scope.$watch 'items.length', (newValue, oldValue) ->
        element.width(newValue * 26)
angular.module 'rui.quickmenu', [
  'rui.quickmenu.directives.quickmenu'
]
angular.module('rui.pubsub', [])

.service 'PubSub',
  class PubSub

    constructor: (@$rootScope) ->

    subscribe: (event, handler) ->
      console.log('subscribe:', event, handler)
      @$rootScope.$on(event, handler)

    publish: (event, data, options) ->
      console.log('publish:', event, data);
      @$rootScope.$emit(event, data)

      Rally?.environment?.getMessageBus().publish.apply(Rally.environment.getMessageBus(), arguments)

rui = angular.module 'rui', [
	'rui.sortable'
	'rui.highcharts'
	'rui.dropdown'
	'rui.tabs'
	'rui.util'
	'rui.scroll'
]

angular.module('rui.scroll', ['rui.scroll.when'])

angular.module('rui.scroll.when.directives.when', []).directive('ruiScrollWhen', ($timeout) ->
	return {
		restrict: 'A'
		scope:
			ruiScrollWhen: '='
		link: ($scope, $element, $attrs) ->
			$scope.$watch('ruiScrollWhen', (value)->
				if value 
					$timeout(()-> angular.element($element?[0])?.scrollIntoView())
			)
	}
)

angular.module('rui.scroll.when', ['rui.scroll.when.directives.when'])

#
# jQuery UI Sortable plugin wrapper
#
# @param [ui-sortable] {object} Options to pass to $.fn.sortable() merged onto ui.config
#
module = angular.module("rui.sortable", [])

module.value("ruiSortableConfig", {})

###*
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
###
module.directive "ruiSortable", ["ruiSortableConfig", "$timeout", "$log", (ruiSortableConfig, $timeout, $log) ->
  require: "?ngModel"
  link: (scope, element, attrs, ngModel) ->
    combineCallbacks = (first, second) ->
      if second and (typeof second is "function")
        return (e, ui) ->
          first e, ui
          second e, ui
      first
    savedNodes = undefined
    opts = angular.extend({}, ruiSortableConfig, scope.$eval(attrs.ruiSortable))
    callbacks =
      receive: null
      remove: null
      start: null
      stop: null
      update: null

    if ngModel
      
      # When we add or remove elements, we need the sortable to 'refresh'
      # so it can find the new/removed elements.
      scope.$watch attrs.ngModel + ".length", ->
        
        # Timeout to let ng-repeat modify the DOM
        $timeout ->
          element.sortable "refresh"


      callbacks.start = (e, ui) ->
        
        # Save the starting position of dragged item
        # Save position of dragged item
        ui.item.sortable =
          startIndex: ui.item.index()
          startModel: ngModel
          index: ui.item.index()
          cancel: ->
            ui.item.sortable._isCanceled = true

          isCanceled: ->
            ui.item.sortable._isCanceled

          _isCanceled: false

      callbacks.activate = (e, ui) ->
        
        # We need to make a copy of the current element's contents so
        # we can restore it after sortable has messed it up.
        # This is inside activate (instead of start) in order to save
        # both lists when dragging between connected lists.
        savedNodes = element.contents()
        
        # If this list has a placeholder (the connected lists won't),
        # don't inlcude it in saved nodes.
        placeholder = element.sortable("option", "placeholder")
        
        # placeholder.element will be a function if the placeholder, has
        # been created (placeholder will be an object).  If it hasn't
        # been created, either placeholder will be false if no
        # placeholder class was given or placeholder.element will be
        # undefined if a class was given (placeholder will be a string)
        if placeholder and placeholder.element and typeof placeholder.element is "function"
          
          # exact match with the placeholder's class attribute to handle
          # the case that multiple connected sortables exist and
          # the placehoilder option equals the class of sortable items
          excludes = element.find("[class=\"" + placeholder.element().attr("class") + "\"]")
          savedNodes = savedNodes.not(excludes)

      callbacks.update = (e, ui) ->
        
        # Save current drop position but only if this is not a second
        # update that happens when moving between lists because then
        # the value will be overwritten with the old value
        unless ui.item.sortable.received
          ui.item.sortable.dropindex = ui.item.index()
          
          # Cancel the sort (let ng-repeat do the sort for us)
          # Don't cancel if this is the received list because it has
          # already been canceled in the other list, and trying to cancel
          # here will mess up the DOM.
          element.sortable "cancel"
        
        # Put the nodes back exactly the way they started (this is very
        # important because ng-repeat uses comment elements to delineate
        # the start and stop of repeat sections and sortable doesn't
        # respect their order (even if we cancel, the order of the
        # comments are still messed up).
        savedNodes.detach().appendTo element
        
        # If received is true (an item was dropped in from another list)
        # then we add the new item to this list otherwise wait until the
        # stop event where we will know if it was a sort or item was
        # moved here from another list
        if ui.item.sortable.received and not ui.item.sortable.isCanceled()
          scope.$apply ->
            ngModel.$modelValue.splice ui.item.sortable.dropindex, 0, ui.item.sortable.moved


      callbacks.stop = (e, ui) ->
        if ui.item.sortable.resort
          ui.item.sortable.endIndex = ui.item.index()
          ui.item.sortable.endModel = ui.item.sortable.resort
        
        # If the received flag hasn't be set on the item, this is a
        # normal sort, if dropindex is set, the item was moved, so move
        # the items in the list.
        if not ui.item.sortable.received and ("dropindex" of ui.item.sortable) and not ui.item.sortable.isCanceled()
          scope.$apply ->
            ngModel.$modelValue.splice ui.item.sortable.dropindex, 0, ngModel.$modelValue.splice(ui.item.sortable.index, 1)[0]


      callbacks.receive = (e, ui) ->
        
        # An item was dropped here from another list, set a flag on the
        # item.
        ui.item.sortable.received = true

      callbacks.remove = (e, ui) ->
        
        # Remove the item from this list's model and copy data into item,
        # so the next list can retrive it
        unless ui.item.sortable.isCanceled()
          scope.$apply ->
            ui.item.sortable.moved = ngModel.$modelValue.splice(ui.item.sortable.index, 1)[0]


      scope.$watch attrs.uiSortable, ((newVal, oldVal) ->
        angular.forEach newVal, (value, key) ->
          if callbacks[key]
            if key is "stop"
              
              # call apply after stop
              value = combineCallbacks(value, ->
                scope.$apply()
              )
            
            # wrap the callback
            value = combineCallbacks(callbacks[key], value)
          element.sortable "option", key, value

      ), true
      angular.forEach callbacks, (value, key) ->
        opts[key] = combineCallbacks(value, opts[key])

    else
      $log.info "ui.sortable: ngModel not provided!", element
    
    # Create sortable
    element.sortable opts
]
angular.module('rui.tabs.directives.controllers.tab', [])
.controller 'TabCtrl',
  class TabsetCtrl

    @$inject = ['$scope']
    constructor: (@$scope) ->
      @$tab = @$scope.$tab = @$scope.$new()
      @$tab.model = {}
      @$tab.select = @select
      @$tab.headingClasses = @headingClasses
      @$tab.contentClasses = @headingClasses

      @$tabset = @$scope.$tabset
      @$tabset.registerTab(@$tab.model)
      @$tabset.$watch('state.activeTab', (tab) =>
        @$tab.model.isActive = tab is @$tab.model          
      )
      return @

    select: () =>
      @$tab.model.isActive = @$tab.selectTab(@$tab.model)

    headingClasses: () =>
      return {active: @$tab.model.isActive}

angular.module('rui.tabs.directives.controllers.tabset', [])
.controller 'TabsetCtrl',
  class TabsetCtrl

    @$inject = ['$scope', '$transclude']
    constructor: (@$scope, @$transclude) ->
      @$tabset = @$scope.$tabset = @$scope.$new()
      @$tabset.state = {}
      @$tabset.registerTab = @registerTab
      return @

    select: (tab) =>
      @$tabset.state.activeTab = tab
      return true

    # Register a new tab, the first to register will be made active
    registerTab: (tab) =>
      if not @$tabset.state.activeTab
        @select(tab)
###
###
tab = angular.module('rui.tabs.directives.tab', [
  'rui.tabs.directives.controllers.tab'
])
.directive 'ruiTab', [() ->
  restrict: 'EA'
  require: ['?ngModel', '^ruiTabset']
  controller: "TabCtrl"
  scope: true
  link: 
    post: (scope, element, attrs, [ngModel, tabsetController]) ->
      $element = $(element)
      # Identify heading, content, and tabset parent.
      $heading = $element.children('.rui-tab-heading, [rui-tab-heading]')
      $content = $element.children('.rui-tab-content, [rui-tab-content]')
      $tabset = $element.parents('.rui-tabset')
      
      # Now push content into parent locations
      $tabset.find('ul.nav-tabs').append($heading)
      $tabset.find('.tab-content').append($content)

      # Link to parent controller
      scope.$tab.selectTab = tabsetController.select
      return @ 
]

###
###
tab = angular.module('rui.tabs.directives.tabContent', [])

.directive 'ruiTabContent', [() ->
  restrict: 'EA'
  transclude: true
  replace: true
  scope: true
  templateUrl: 'rui/tabs/templates/tab-content.html'
  link: (scope, element, attrs) ->
    return @
      
]

###
###
tabset = angular.module('rui.tabs.directives.tabHeading', [])

.directive 'ruiTabHeading', [() ->
  restrict: 'EA'
  transclude: true
  replace: true
  scope: true
  require: ['?^ngModel', '^ruiTab']
  templateUrl: 'rui/tabs/templates/tab-heading.html'
  link: ($scope, element, attrs, [ngModel, tabCtrl]) ->
    $scope.$tabHeading = $scope.$new()
    $scope.$tabHeading.select = tabCtrl.select
    $scope.$tabHeading.headingClasses = tabCtrl.headingClasses
    return @
      
]

###*
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
###
tabset = angular.module('rui.tabs.directives.tabset', [
  'rui.tabs.directives.controllers.tabset'
])
.directive 'ruiTabset', [() ->
  restrict: 'EA'
  require: ['?ngModel']
  transclude: true
  scope: true
  replace: true
  templateUrl: 'rui/tabs/templates/tabset.html'
  controller: 'TabsetCtrl'
  link: 
    post: (scope, element, attrs, [ngModel]) ->
      return @      
]

module = angular.module 'rui.tabs', [
  'rui.templates'
  'rui.util.transclude'
  'rui.tabs.directives.tabset'
  'rui.tabs.directives.tab'
  'rui.tabs.directives.tabHeading'
  'rui.tabs.directives.tabContent'
]

angular.module 'rui.templates', []
angular.module('rui.util.transclude.directives.controllers.transclude', [])
.controller 'TranscludeCtrl',
  class TranscludeCtrl

    @$inject = ['$scope', '$transclude', '$window']
    constructor: (@$scope, @$transclude, @$window) ->
      if !@$transclude
        throw """
            ruiTransclude:orphan,
            Illegal use of ruiTransclude directive in the template!
            No parent directive that requires a transclusion found.
            Element: {#$element}

            """

    filter: (clone, filter) =>
      $clone = $(clone)
      filtered = $clone.filter(filter)
      # Filter out all meta 'rui-transclude-class' types
      postMeta = []      
      _.each(filtered, (e) ->
        $e = $(e)
        if $e.hasClass('rui-transclude-meta')
          index = $clone.index($e)
          # Find the next non-text node
          e = _.find(clone, (node, i) ->
            return i > index and node.nodeType isnt 3 # find an element or comment (like ng-repeat)
          )
        postMeta.push(e)
      )
      sorted = _.sortBy(postMeta, (e) -> 
        _.indexOf(clone, e) 
      )
      return sorted

    transclude: ($element, filter, required=true) =>
      boundTranscludeFn = (clone) =>
        if filter
          toAppend = @filter(clone, filter)
        else
          toAppend = clone
        if required and not toAppend.length > 0
          throw """
          ruiTransclude:empty,
            Illegal use of ruiTransclude. Can't find elements to transclude in the clone.
            Maybe you're using directives that result in virtual elements like ng-repeat or ng-if? If so, try 
            using an element wrapper or comment before the node (<!-- directive: rui-transclude-class myClass -->) to
            tell rui-transclude what to pull.
            Element: #{$element}
            Filter: #{filter}

          """
        $element.html('')
        $element.append(toAppend)
      
      # TODO Not sure if this is necessary, angular updates may have changed the compile function and made this unnecessary.
      # version = @$window.angular.version
      # if version.major is 1 and version.minor >= 2
      #   @$transclude(@$scope, boundTranscludeFn) # for angular 1.2 retain parent scope
      # else
      @$transclude(@$scope, boundTranscludeFn)

###*
 * @ngdoc directive
 * @name rui.utils.transclude.directives:ruiTranscludeAttribute
 * @description
 * 
###
transclude = angular.module('rui.util.transclude.directives.attribute', [])
.directive 'ruiTranscludeAttr', [() ->
  restrict: 'M'
  templateUrl: 'rui/util/transclude/templates/transclude-meta.html'
  replace: true
  compile: (tElem, tAttr, transcludeFn) ->
      # TODO figure out how to value the attribute
      # tElem.attr(tAttr.ruiTranscludeClass)
      return {
        post: ($scope, $element, $attrs) ->
        pre: ($scope, $element) ->
          $element.remove()
      }
]

###*
 * @ngdoc directive
 * @name rui.utils.transclude.directives:ruiTranscludeClass
 * @description
 * Similar to ng-transclude, allows specification of jquery selectors for use with multiple transclusion points.
 * Specify a filter as the rui-transclude attribute value to select what content should be appended into the 
 * current transclusion point. You can specify 'rui-transclude-optional' to allow for soft transcldes (where
 * there may be no content to push).
 * 
###
transclude = angular.module('rui.util.transclude.directives.class', [])
.directive 'ruiTranscludeClass', ['$compile', ($compile) ->
  restrict: 'M'
  ### 
  Since angular ends up cloning this node a bunch of times, the only way to get something that can
  be used by rui-transclude's filter is to let it be a real element. We'll treat it special in
  rui-transclude's custom transclude function and then this element can remove itself to cleanup.
  ###
  templateUrl: 'rui/util/transclude/templates/transclude-meta.html'
  transclude: 'element'
  replace: true
  compile: (tElem, tAttr, transcludeFn) ->
      tElem.addClass(tAttr.ruiTranscludeClass)      
      return {
        post: ($scope, $element, $attrs) ->
        pre: ($scope, $element) ->
          $element.remove() # Cleanup the meta-element
      }
]

###*
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
###
module = angular.module('rui.util.transclude.directives.transclude', [
  'rui.util.transclude.directives.controllers.transclude'
  ])
.directive 'ruiTransclude', ['$timeout', ($timeout) ->
  restrict: 'A'
  controller: 'TranscludeCtrl'
  link: 
    post: ($scope, $element, $attrs, controller) ->
      filter = $attrs.ruiTransclude
      filter ?= filter.trim()
      if filter? is 'rui-transclude' or filter? is '' then filter = null # for some reason attributes are showing up with the 
      required = if $attrs.ruiTranscludeOptional? then false else true
      $scope.$evalAsync () ->
        controller.transclude($element, filter, required)
]

transclude = angular.module 'rui.util.transclude', [
  'rui.templates'
  'rui.util.transclude.directives.transclude'
  'rui.util.transclude.directives.class'
  'rui.util.transclude.directives.attribute'
]

util = angular.module 'rui.util', [
  'rui.util.transclude'
]
