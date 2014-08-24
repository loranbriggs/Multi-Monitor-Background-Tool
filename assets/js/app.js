var bgCropperApp = angular.module('bgCropperApp',
    ['ngRoute'
    ]);

bgCropperApp.run(function($rootScope) {

  // chekc if file api works in client's browser
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }

  $rootScope.help = function() {
    $('body').chardinJs('toggle');
    $('.chardinjs-overlay').append('<div class="chardinjs-helper-layer tap-dismiss"><div class="chardinjs-tooltiptext">Tap to dismiss</div></div>');
  };

  //setTimeout($rootScope.help, 1500);

});

bgCropperApp.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'Home',
      templateUrl: 'views/home.html'
    })
    .otherwise({
      redirectTo: '/'
    });
});

bgCropperApp.config( function($compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|data):/);
});
