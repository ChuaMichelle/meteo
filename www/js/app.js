// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('appMeteo', ['ionic', 'ngCordova'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.shideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  .directive('customOnChange', function() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var onChangeHandler = scope.$eval(attrs.customOnChange);
        element.bind('change', onChangeHandler);
      }
    };
  })

  .controller('appCtrl', function($scope, $cordovaFile) {

    var air_temp = [
      {name : 'temperature minimum', data : []},
      {name : 'moyenne', data : []},
      {name : 'temperature maximum', data : []}
    ];
    var rel_humidity = [
      {name : 'humidity minimum', data : []},
      {name : 'moyenne', data : []},
      {name : 'humidity maximum', data : []}
    ];
    var air_pressure = [
      {name : 'pressure minimum', data : []},
      {name : 'moyenne', data : []},
      {name : 'pressure maximum', data : []}
    ];
    var wind_speed = [
      {name : 'speed minimum', data : []},
      {name : 'moyenne', data : []},
      {name : 'speed maximum', data : []}
    ];

    var resumed = {
      air_temp: {
        minimum: 100000.0,
        moyenne: 0.0,
        maximum: 0.0
      },
      rel_humidity: {
        minimum: 100000.0,
        moyenne: 0.0,
        maximum: 0.0
      },
      air_pressure: {
        minimum: 100000.0,
        moyenne: 0.0,
        maximum: 0.0
      },
      local_wind: {
        minimum: 100000.0,
        moyenne: 0.0,
        maximum: 0.0
      }
    };


    $scope.uploadFile = function(event){
      var f = event.target.files[0];
      var r = new FileReader();
      r.onload = function(e) {
        var contents = e.target.result.split('\n');
        var actualHour = 0;
        var nb_lines = 0;
        for(var line = 2; line < contents.length - 1; line++) {
          var datas = contents[line].split('\t');
          var date = datas[0].split(' ');
          var time = date[1].split(':');
          var hour = parseInt(time[0]);
          if (hour != actualHour) {
            air_temp[0].data.push(resumed.air_temp.minimum);
            air_temp[1].data.push(resumed.air_temp.moyenne / nb_lines);
            air_temp[2].data.push(resumed.air_temp.maximum);

            rel_humidity[0].data.push(resumed.rel_humidity.minimum);
            rel_humidity[1].data.push(resumed.rel_humidity.moyenne / nb_lines);
            rel_humidity[2].data.push(resumed.rel_humidity.maximum);

            air_pressure[0].data.push(resumed.air_pressure.minimum);
            air_pressure[1].data.push(resumed.air_pressure.moyenne / nb_lines);
            air_pressure[2].data.push(resumed.air_pressure.maximum);

            wind_speed[0].data.push(resumed.local_wind.minimum);
            wind_speed[1].data.push(resumed.local_wind.moyenne / nb_lines);
            wind_speed[2].data.push(resumed.local_wind.maximum);

            resumed.air_temp.minimum = 1000000.0;
            resumed.air_temp.moyenne = 0.0;
            resumed.air_temp.maximum = 0.0;

            resumed.rel_humidity.minimum = 1000000.0;
            resumed.rel_humidity.moyenne = 0.0;
            resumed.rel_humidity.maximum = 0.0;

            resumed.air_pressure.minimum = 1000000.0;
            resumed.air_pressure.moyenne = 0.0;
            resumed.air_pressure.maximum = 0.0;

            resumed.local_wind.minimum = 1000000.0;
            resumed.local_wind.moyenne = 0.0;
            resumed.local_wind.maximum = 0.0;

            actualHour = hour;
            nb_lines = 0;
          }

          if (!isNaN(parseFloat(datas[33])) && datas.length == 79) {
            resumed.air_temp.moyenne = resumed.air_temp.moyenne + parseFloat(datas[33]);
            if (parseFloat(datas[33]) > resumed.air_temp.maximum) {
              resumed.air_temp.maximum = parseFloat(datas[33]);
            }
            if (parseFloat(datas[33]) < resumed.air_temp.minimum) {
              resumed.air_temp.minimum = parseFloat(datas[33]);
            }
          }

          if (!isNaN(parseFloat(datas[35])) && datas.length == 79) {
            resumed.rel_humidity.moyenne = resumed.rel_humidity.moyenne + parseFloat(datas[35]);
            if (parseFloat(datas[35]) > resumed.rel_humidity.maximum) {
              resumed.rel_humidity.maximum = parseFloat(datas[35]);
            }
            if (parseFloat(datas[35]) < resumed.rel_humidity.minimum) {
              resumed.rel_humidity.minimum = parseFloat(datas[35]);
            }
          }

          if (line >= 2 && !isNaN(parseFloat(datas[38])) && datas.length == 79) {
            resumed.air_pressure.moyenne = resumed.air_pressure.moyenne + parseFloat(datas[38]);
            if (parseFloat(datas[38]) > resumed.air_pressure.maximum) {
              resumed.air_pressure.maximum = parseFloat(datas[38]);
            }
            if (parseFloat(datas[38]) < resumed.air_pressure.minimum) {
              resumed.air_pressure.minimum = parseFloat(datas[38]);
            }
          }

          if (line >= 2 && !isNaN(parseFloat(datas[38])) && datas.length == 79) {
            resumed.local_wind.moyenne = resumed.local_wind.moyenne + parseFloat(datas[3]);
            if (parseFloat(datas[3]) > resumed.local_wind.maximum) {
              resumed.local_wind.maximum = parseFloat(datas[3]);
            }
            if (parseFloat(datas[3]) < resumed.local_wind.minimum) {
              resumed.local_wind.minimum = parseFloat(datas[3]);
            }
          }

          nb_lines++;
        }

        Highcharts.chart('air_temp', {
          title: {
            text: 'Air Temperature per hour'
          },
          xAxis: {
            categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
              '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
          },
          yAxis: {
            title: {
              text: 'Temperature (°C)'
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }]
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
          },
          series: air_temp
        });

        Highcharts.chart('rel_humidity', {
          title: {
            text: 'Humidity per hour'
          },
          xAxis: {
            categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
              '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
          },
          yAxis: {
            title: {
              text: 'Humidity(%)'
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }]
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
          },
          series: rel_humidity
        });

        Highcharts.chart('air_pressure', {
          title: {
            text: 'Air Pressure per hour'
          },
          xAxis: {
            categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
              '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
          },
          yAxis: {
            title: {
              text: 'Humidity(hPa)'
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }]
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
          },
          series: air_pressure
        });

        Highcharts.chart('wind_speed', {
          title: {
            text: 'Wind Speed per hour'
          },
          xAxis: {
            categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
              '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
          },
          yAxis: {
            title: {
              text: 'Wind Speed (nd)'
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }]
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
          },
          series: wind_speed
        });

      };
      r.readAsText(f);
    };

    // J'ai essaié de créer un fichier ici. marche pas.
    $scope.uploadFilecreatefile = function(event){
      var f = event.target.files[0];
      $cordovaFile.writeFile(cordova.file.dataDirectory+'/log2.his', f, { 'append': false }).then(function (result) {
        // Success!
        console.log("result : ", result);
      }, function (err) {
        console.log(err);
        console.log("writing error");
        // An error occurred. Show a message to the user
      });

      //var r = new FileReader();
      //r.onload = function(e) {
      //  var contents = e.target.result;
      //  console.log("contents 0: ", contents.split('\n')[0]);
      //  console.log("contents 1: ", contents.split('\n')[1]);
      //  console.log("contents 2: ", contents.split('\n')[2]);
      //  console.log("contents 3: ", contents.split('\n')[3]);
      //};
      //r.readAsText(f);
      console.log("files : ", f);
    };


    // J'ai essaié de créer un dossier ici. marche pas.
    $scope.uploadFilecreatdir = function(event){
      var f = event.target.files[0];
      console.log(cordova.file.dataDirectory);
      $cordovaFile.createDir("files", "savedFiles", false).then(function(res){
        console.log("createdir : ", JSON.stringify(res));
      }, function(err) {
        console.log("createDir : ", JSON.stringify(err));
      });
      $cordovaFile.checkDir("files", "savedFiles")
        .then(function (success) {
          // success
          console.log("success " + JSON.stringify(success));
        }, function (error) {
          // error
          console.log("error " + JSON.stringify(error));
        });
    };

  });

