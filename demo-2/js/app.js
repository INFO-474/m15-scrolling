
var myApp = angular.module('myApp', [])

// Main controller
.controller('MainController', function($scope) {
     // Data for the chart
     $scope.data = [
       {id:0, text:'Paragraph 0'},
       {id:1, text:'Paragraph 1'},
       {id:2, text:'Paragraph 2'},
       {id:3, text:'Paragraph 3'}
     ];

     // Array of objects that correspond to each step
     $scope.settings = [
       {color:'red', fontSize:20, filter:function(d){return d}},
       {color:'blue', fontSize:10, filter:function(d){return d.id>2}},
       {color:'orange', fontSize:100, filter:function(d){return d.id<3}},
       {color:'green', fontSize:30, filter:function(d){return d}},
     ];

     $scope.step = 0;

     // Text for each section
     $scope.sectionText = [
       {text:'Section 0'},
       {text:'Section 1'},
       {text:'Section 2'},
       {text:'Section 3'}
     ];

     // Desired section height
     $scope.sectionHeight = 400;
 })

// Projects controller
.controller('ProjectsController', function($scope, ProjectData){
  ProjectData.then(function(data){
    $scope.projects = data
  })
})

// Scroll directive
.directive("scroll", function ($window) {
    return {
      restrict:'E', // this directive is specified as an html element <scroll>
      scope:false, // use global scope
      // Create a link function that allows dynamic element creation
      link:function(scope, elem) {
          elem.bind("scroll", function() {
              scope.step = Math.ceil((this.scrollTop - 10)/ scope.sectionHeight);
              scope.$apply();
          });
      }
    };
})

// Create a directive 'scatter' that creates scatterplots
.directive('paragraphChart', function($filter, $compile) {
	// Return your directive element
	return {
		restrict:'E', // this directive is specified as an html element <scatter>
    scope:false,
		// Create a link function that allows dynamic element creation
		link:function(scope,elem,attrs){
			// Use the scope.$watch method to watch for changes to the step, then re-draw your chart
			scope.$watch('step', function() {

        // Instantiate your chart with given settings
        var color = scope.settings[scope.step].color;
        var fontSize = scope.settings[scope.step].fontSize;
        var myChart = ParagraphChart().color(color).fontSize(fontSize);

        // Get the current data
        var currentData = scope.data.filter(scope.settings[scope.step].filter);

  			// Wrapper element to put your svg (chart) in
  			wrapper = d3.select(elem[0])
          .datum(currentData)
          .call(myChart);
			});
		}
	};
});
