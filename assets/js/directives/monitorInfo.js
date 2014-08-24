app.directive('monitorInfo', function () {
  return {
    restrict: 'E',
    scope: {
      myindex: '='
    },
    template:'<div>{{myindex}}</div>',
    link: function(scope, element, attrs){
      console.log('test', scope.myindex)
    }
  };
})
