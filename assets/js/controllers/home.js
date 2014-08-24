angular.module('bgCropperApp').controller('Home',
    ['$scope', '$rootScope', '$location',
    function($scope, $rootScope, $location) {

      $scope.cropCoords = {
        'x': 0,
        'y': 0,
        'w': 0,
        'h': 0
      };

      $scope.totalWidth = 0;
      $scope.totalHeight = 0;
      $scope.aspectRatio;

      $scope.monitors = [
        { width: 1920, height: 1080 },
        { width: 0, height: 0 },
        { width: 0, height: 0 },
        { width: 0, height: 0 },
        { width: 0, height: 0 }
      ];

      $scope.imageName = "No file selected";
      $scope.imageSrc;

      $scope.init = function() {
        var storedMonitors = localStorage.getItem('monitors');
        if (storedMonitors) {
          $scope.monitors = JSON.parse(storedMonitors);
        }
        $scope.sumMonitors();
      };

      $scope.sumMonitors = function() {
        $scope.totalWidth = 0;
        $scope.totalHeight = 0;
        for (var i = 0; i < $scope.monitors.length; i++) {
          $scope.totalWidth += parseInt($scope.monitors[i].width);
          if (parseInt($scope.monitors[i].height) > $scope.totalHeight) {
            $scope.totalHeight = parseInt($scope.monitors[i].height);
          }
        }
        $scope.aspectRatio = $scope.totalWidth/$scope.totalHeight;
        localStorage.setItem('monitors', JSON.stringify($scope.monitors));
      }

      $scope.openFile = function() {
        document.getElementById('file').click();
      };

      $scope.fileSelect = function(input) {
        var file = input.files[0];
        $scope.imageName = file.name;

        var reader = new FileReader();
        reader.onload = function(e) {
            $scope.imageSrc = e.target.result;
            $scope.$apply();
            initCrop();
        };
        reader.readAsDataURL(file);
      }

      function initCrop() {
        var $image = $('#theImage');
        $image.Jcrop({
          onSelect: updateCoords,
          bgColor: 'white',
          bgOpacity: 0.4,
          setSelect: [500,300,100,100],
          aspectRatio: $scope.aspectRatio
        });
      }

      function updateCoords(c) {
        $scope.$apply(function() {
          $scope.cropCoords.x = c.x;
          $scope.cropCoords.y = c.y;
          $scope.cropCoords.w = c.w;
          $scope.cropCoords.h = c.h;
        });
      }

      $scope.crop = function() {
        var $image = $('#theImage');
        var imageScreenWidth = $image.width();
        var imageScreenHeight = $image.height();
        var fullSizeImage = new Image();
        fullSizeImage.src = $scope.imageSrc;
        var imageFullWidth = fullSizeImage.width;
        var imageFullHeight = fullSizeImage.height;
        var cropWidth = Math.round( ($scope.cropCoords.w/imageScreenWidth)*imageFullWidth );
        var cropHeight = Math.round( ($scope.cropCoords.h/imageScreenHeight)*imageFullHeight );
        var cropX = Math.round( ($scope.cropCoords.x / imageScreenWidth)*imageFullWidth );
        var cropY = Math.round( ($scope.cropCoords.y / imageScreenHeight)*imageFullHeight );
        Caman($image.get(0), function() {
          this.crop( cropWidth, cropHeight, cropX, cropY );
          this.resize( {height: $scope.totalHeight} );
          this.render(postCrop);
        });

      };

      function postCrop() {
        $('.jcrop-holder').remove();
        $scope.imageSrc = this.toBase64();
        var $image = $('#theImage');
        $image.toggle();
        $image.css('visibility', 'visible');
        $image.height($image.width()/$scope.aspectRatio);
        $scope.downloadTitle = addDimensionToFilename($scope.imageName);
        $scope.$apply();
      }

      function addDimensionToFilename(filename) {
        var index = filename.lastIndexOf('.');
        var name = filename.substr(0,index);
        var ext  = filename.substr(index);
        var newFilename = name + '-' + $scope.totalWidth + 'x' + $scope.totalHeight + ext;
        return newFilename;
      }

      $scope.again = function() {
        $location.path('/#');
        $scope.$apply();
      };

      $scope.help = function() {
        $('body').chardinJs('toggle');
        $('.chardinjs-overlay').append('<div class="chardinjs-helper-layer tap-dismiss"><div class="chardinjs-tooltiptext">Once your adjusted image is downloaded, set it to your desktop background with display mode \'tile\' and your image will strech perfect across all your monitors.<br/><br/>Tap to dismiss</div></div>');
      };


    }]);
