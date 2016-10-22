'use strict';

// Register `plantDetail` directive
angular.
module('plants').
directive('plantDetailDirective', function ($compile) {
  var linkFunction = function (scope, element, attributes) {
    $(document).ready(function () {
      scope.$ctrl.getPlantThings();
    });
    
    $('#plantUpdate').on('click', function() {
      // Do some DOM manipulation to indicate something happens
      scope.$ctrl.updatePlant();
    });
  };

  return {
    link: linkFunction
  };
}).
directive('deletePlantDirective', function () {
  var linkFunction = function (scope, element, attributes) {
    $('#deletePlantModal').on('hidden.bs.modal', function () {
      $('#plantError').css({
        "display": "none"
      });
    });

    $('#deletePlant').on('click', function() {
      var plantName = $('#plantName').val();

      if (plantName == scope.$ctrl.plantDetails.plantName) {
        $('#deletePlantModal').modal('hide');
        scope.$ctrl.deletePlant();
      } else {
        $('#plantError').css({
          "display": "inline-block"
        });
      }
    });
  };

  return {
    link: linkFunction
  }
}).
directive('statusDirective', function($compile) {
  var linkFunction = function (scope, element, attributes) {
    scope.$watch(attributes.ngModel, function (value) {
      var val = value;
      if (val == "connected") {
        var mqttStatus = $('#mqttStatus');
        mqttStatus.removeClass('alert-danger');
        mqttStatus.addClass('alert-success');
        mqttStatus.find('#connecting').css({
          "display": "none"
        });
        mqttStatus.find('.mqtt-spin').css({
          "display": "none"
        });

        mqttStatus.find('#connected').css({
          "display": "block"
        });
      }
    });
  };

  return {
    link: linkFunction
  };
}).
directive('pausePlay', function($compile) {
  var linkFunction = function (scope, element, attributes) {
    $('.btnPausePlay').on('click', function () {
      var pausePlay = $(this).find('.pausePlay');

      var chartData = $(this).data('chart');

      if (pausePlay.hasClass('fa-pause')) {
        pausePlay.removeClass('fa-pause');
        pausePlay.addClass('fa-play');

        if (chartData == "temp") {
          scope.$ctrl.chartStatus.temp = false;
        } else if (chartData == "humidity") {
          scope.$ctrl.chartStatus.humidity = false;
        } else if (chartData == "moisture") {
          scope.$ctrl.chartStatus.moisture = false;
        } else if (chartData == "aggregate") {
          scope.$ctrl.chartStatus.aggregate = false;
        }
      } else if (pausePlay.hasClass('fa-play')) {
        pausePlay.removeClass('fa-play');
        pausePlay.addClass('fa-pause');

        if (chartData == "temp") {
          scope.$ctrl.chartStatus.temp = true;
        } else if (chartData == "humidity") {
          scope.$ctrl.chartStatus.humidity = true;
        } else if (chartData == "moisture") {
          scope.$ctrl.chartStatus.moisture = true;
        } else if (chartData == "aggregate") {
          scope.$ctrl.chartStatus.aggregate = true;
        }
      }
    });
  };

  return {
    link: linkFunction
  };
}).
directive('plantDetailCanvasDirective', function($compile, $sessionStorage) {
  var linkFunction = function (scope, element, attributes) {
    var tempCanvas = document.getElementById('live-chart-temperature');
    var histTempCanvas = document.getElementById('historical-chart-temperature');

    var humidityCanvas = document.getElementById('live-chart-humidity');
    var histHumidityCanvas = document.getElementById('historical-chart-humidity');

    var moistureCanvas = document.getElementById('live-chart-moisture');
    var histMoistureCanvas = document.getElementById('historical-chart-moisture');

    var aggregateCanvas = document.getElementById('live-chart-aggregate');
    var aggregateLineCanvas = document.getElementById('live-chart-aggregate-line');

    var ctxTemp = tempCanvas.getContext('2d');
    var ctxHTemp = histTempCanvas.getContext('2d');

    var ctxHumidity = humidityCanvas.getContext('2d');
    var ctxHHumidity = histHumidityCanvas.getContext('2d');

    var ctxMoisture = moistureCanvas.getContext('2d');
    var ctxHMoisture = histMoistureCanvas.getContext('2d');

    var ctxAggregate = aggregateCanvas.getContext('2d');
    var ctxAggregateLine = aggregateLineCanvas.getContext('2d');

    var tempData = {
      labels: [],
      datasets: [
        {
          label: "Temperature",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(255, 193 , 7, 0.4)",
          borderColor: "rgba(255, 193 , 7, 1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(255, 193 , 7, 1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(255, 193 , 7, 1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
          spanGaps: false
        }
      ]
    };

    var hTempData = {
      labels: [],
      datasets: [
        {
          label: "Temperature",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(255, 193 , 7, 0.4)",
          borderColor: "rgba(255, 193 , 7, 1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(255, 193 , 7, 1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(255, 193 , 7, 1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
          spanGaps: false
        }
      ]
    };

    var humidityData = {
      labels: [],
      datasets: [
        {
          label: "Humidity",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(219, 68, 55, 0.4)",
          borderColor: "rgba(219, 68, 55, 1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(219, 68, 55, 1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(219, 68, 55, 1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
          spanGaps: false
        }
      ]
    };

    var hHumidityData = {
      labels: [],
      datasets: [
        {
          label: "Humidity",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(219, 68, 55, 0.4)",
          borderColor: "rgba(219, 68, 55, 1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(219, 68, 55, 1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(219, 68, 55, 1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
          spanGaps: false
        }
      ]
    };

    var moistureData = {
      labels: [],
      datasets: [
        {
          label: "Moisture",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(66, 133, 244, 0.4)",
          borderColor: "rgba(66, 133, 244, 1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(66, 133, 244, 1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(66, 133, 244, 1)",
          pointHoverBorderColor: "rgba(66, 133, 244, 1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
          spanGaps: false
        }
      ]
    };

    var hMoistureData = {
      labels: [],
      datasets: [
        {
          label: "Moisture",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(66, 133, 244, 0.4)",
          borderColor: "rgba(66, 133, 244, 1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(66, 133, 244, 1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(66, 133, 244, 1)",
          pointHoverBorderColor: "rgba(66, 133, 244, 1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
          spanGaps: false
        }
      ]
    };

    var aggregateData = {
      labels: [],
      datasets: [{
        label: 'Temperature',
        backgroundColor: "rgba(255, 193 , 7, 0.4)",
        borderColor: "rgba(255, 193 , 7, 1)",
        data: []
      },
      {
        label: 'Humidity',
        backgroundColor: "rgba(219, 68, 55, 0.4)",
        borderColor: "rgba(219, 68, 55, 1)",
        data: []
      },
      {
        label: 'Moisture',
        backgroundColor: "rgba(66, 133, 244, 0.4)",
        borderColor: "rgba(66, 133, 244, 1)",
        data: []
      }]
    };

    var aggregateLineData = {
      labels: [],
      datasets: [{
        label: 'Temperature',
        backgroundColor: "rgba(255, 193 , 7, 0.4)",
        borderColor: "rgba(255, 193 , 7, 1)",
        data: []
      },
        {
          label: 'Humidity',
          backgroundColor: "rgba(219, 68, 55, 0.4)",
          borderColor: "rgba(219, 68, 55, 1)",
          data: []
        },
        {
          label: 'Moisture',
          backgroundColor: "rgba(66, 133, 244, 0.4)",
          borderColor: "rgba(66, 133, 244, 1)",
          data: []
        }]
    };

    var timeConverter = function (now){
      var a = new Date(now);
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();

      hour = "" + hour;
      if (hour.length == 1) {
        hour = "0" + hour;
      }

      min = "" + min;
      if (min.length == 1) {
        min = "0" + min;
      }

      sec = "" + sec;
      if (sec.length == 1) {
        sec = "0" + sec;
      }
      return hour + ':' + min + ':' + sec;
    };

    var moveChart = function(chart, newData) {
      var now = timeConverter(Date.now());

      chart.data.labels.push(now); // add new label at end
      if (chart.data.labels.length > 30) {
        chart.data.labels.splice(0, 1); // remove first label
      }

      chart.data.datasets.forEach(function(dataset, index) {
        dataset.data.push(newData[index]); // add new data at end
        if (dataset.data.length > 30) {
          dataset.data.splice(0, 1); // remove first data point
        }
      });

      chart.update(1000);
    };

    var calculateAvgMinMax = function (type, val) {
      if (type == "temp") {
        var total = scope.$ctrl.avgMinMax.temp.avg * scope.$ctrl.avgMinMax.temp.num;
        scope.$ctrl.avgMinMax.temp.num++;
        scope.$ctrl.avgMinMax.temp.avg = (total + parseInt(val)) / scope.$ctrl.avgMinMax.temp.num;
        scope.$ctrl.avgMinMax.temp.avg = +scope.$ctrl.avgMinMax.temp.avg.toFixed(2);

        if (scope.$ctrl.avgMinMax.temp.num > 1) {
          if (val < scope.$ctrl.avgMinMax.temp.min) {
            scope.$ctrl.avgMinMax.temp.min = val;
          }

          if (val > scope.$ctrl.avgMinMax.temp.max) {
            scope.$ctrl.avgMinMax.temp.max = val;
          }
        } else {
          scope.$ctrl.avgMinMax.temp.min = val;
          scope.$ctrl.avgMinMax.temp.max = val;
        }
      } else if (type == "humidity") {
        var total = scope.$ctrl.avgMinMax.humidity.avg * scope.$ctrl.avgMinMax.humidity.num;
        scope.$ctrl.avgMinMax.humidity.num++;
        scope.$ctrl.avgMinMax.humidity.avg = (total + parseInt(val)) / scope.$ctrl.avgMinMax.humidity.num;
        scope.$ctrl.avgMinMax.humidity.avg = +scope.$ctrl.avgMinMax.humidity.avg.toFixed(2);

        if (scope.$ctrl.avgMinMax.humidity.num > 1) {
          if (val < scope.$ctrl.avgMinMax.humidity.min) {
            scope.$ctrl.avgMinMax.humidity.min = val;
          }

          if (val > scope.$ctrl.avgMinMax.humidity.max) {
            scope.$ctrl.avgMinMax.humidity.max = val;
          }
        } else {
          scope.$ctrl.avgMinMax.humidity.min = val;
          scope.$ctrl.avgMinMax.humidity.max = val;
        }
      } else if (type == "moisture") {
        var total = scope.$ctrl.avgMinMax.moisture.avg * scope.$ctrl.avgMinMax.moisture.num;
        scope.$ctrl.avgMinMax.moisture.num++;
        scope.$ctrl.avgMinMax.moisture.avg = (total + parseInt(val)) / scope.$ctrl.avgMinMax.moisture.num;
        scope.$ctrl.avgMinMax.moisture.avg = +scope.$ctrl.avgMinMax.moisture.avg.toFixed(2);

        if (scope.$ctrl.avgMinMax.moisture.num > 1) {
          if (val < scope.$ctrl.avgMinMax.moisture.min) {
            scope.$ctrl.avgMinMax.moisture.min = val;
          }

          if (val > scope.$ctrl.avgMinMax.moisture.max) {
            scope.$ctrl.avgMinMax.moisture.max = val;
          }
        } else {
          scope.$ctrl.avgMinMax.moisture.min = val;
          scope.$ctrl.avgMinMax.moisture.max = val;
        }
      }

      scope.$apply();
    };

    scope.$watch(attributes.ngModel, function (value) {
      var val = value;
      if (val == 'connected') {
        $('.spinner').css({
          'display': 'none'
        });

        $('.panel-body-content').css({
          "display": "block"
        });

        scope.$broadcast('reCalcViewDimensions');

        var tempChart = new Chart(ctxTemp, {
          type: "line",
          data: tempData,
          options: {
            scales: {
              yAxes: [{
                display: true,
                ticks: {
                  suggestedMin: 0,
                  suggestedMax: 30,
                  beginAtZero: true
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Temperature (°C)'
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Time (hh:mm:ss)'
                }
              }]
            }
          }
        });

        var hTempChart = new Chart(ctxHTemp, {
          type: "line",
          data: hTempData,
          options: {
            scales: {
              yAxes: [{
                display: true,
                ticks: {
                  suggestedMin: 0,
                  suggestedMax: 30,
                  beginAtZero: true
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Temperature (°C)'
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Time (dd/mm/yyyy)'
                }
              }]
            }
          }
        });

        var humidityChart = new Chart(ctxHumidity, {
          type: "line",
          data: humidityData,
          options: {
            scales: {
              yAxes: [{
                display: true,
                ticks: {
                  suggestedMin: 0,
                  suggestedMax: 50,
                  beginAtZero: true
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Humidity (%)'
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Time (hh:mm:ss)'
                }
              }]
            }
          }
        });

        var hHumidityChart = new Chart(ctxHHumidity, {
          type: "line",
          data: hHumidityData,
          options: {
            scales: {
              yAxes: [{
                display: true,
                ticks: {
                  suggestedMin: 0,
                  suggestedMax: 50,
                  beginAtZero: true
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Humidity (%)'
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Time (hh:mm:ss)'
                }
              }]
            }
          }
        });

        var moistureChart = new Chart(ctxMoisture, {
          type: "line",
          data: moistureData,
          options: {
            scales: {
              yAxes: [{
                display: true,
                ticks: {
                  suggestedMin: 0,
                  suggestedMax: 300,
                  beginAtZero: true
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Moisture (%)'
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Time (hh:mm:ss)'
                }
              }]
            }
          }
        });

        var hMoistureChart = new Chart(ctxHMoisture, {
          type: "line",
          data: hMoistureData,
          options: {
            scales: {
              yAxes: [{
                display: true,
                ticks: {
                  suggestedMin: 0,
                  suggestedMax: 300,
                  beginAtZero: true
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Moisture (%)'
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Time (hh:mm:ss)'
                }
              }]
            }
          }
        });

        var aggregateChart = new Chart(ctxAggregate, {
          type: "radar",
          data: aggregateData
        });

        var aggregateLineChart = new Chart(ctxAggregateLine, {
          type: "line",
          data: aggregateLineData
        });

        var tempState = false; // false = not received, true = received
        var humidityState = false;
        var moistureState = false;

        $sessionStorage.client[scope.$ctrl.plantDetails.plantId].onMessageArrived = function (message) {
          try {
            console.log("message arrived: " +  message.payloadString);

            $(".spinner-blip").css({
              "display": "block"
            });

            setTimeout(function () {
              $(".spinner-blip").css({
                "display": "none"
              });
            }, 900);

            if (JSON.parse(message.payloadString).state.desired != undefined) {
              // add more checks here
              if (JSON.parse(message.payloadString).state.desired.red != undefined) {
                var updateControl = $('#updateControl');

                updateControl.find('.update-spin').css({
                  "display": "none"
                });

                updateControl.find('svg').css({
                  "display": "block"
                });

                setTimeout(function () {
                  updateControl.find('span').css({
                    "display": "inline"
                  });

                  updateControl.find('svg').css({
                    "display": "none"
                  });
                }, 3000);
              }
            }

            var tempBool = false;
            var humidityBool = false;
            var moistureBool = false;

            if (JSON.parse(message.payloadString).state.reported != undefined) {
              if (JSON.parse(message.payloadString).state.reported.temperature != undefined) {
                var temperature = JSON.parse(message.payloadString).state.reported.temperature;

                if (scope.$ctrl.chartStatus.temp == true) {
                  calculateAvgMinMax("temp", temperature);
                  moveChart(tempChart, [temperature]);
                }

                tempBool = true;

                if (!tempState) {
                  console.log("success");
                  tempState = true;

                  $("#tempWarning").css({
                    "display": "none"
                  });

                  $("#tempSuccess").css({
                    "display": "block"
                  });
                }
              } else {
                if (tempState) {
                  console.log("warning");
                  tempState = false;

                  $("#tempWarning").css({
                    "display": "block"
                  });

                  $("#tempSuccess").css({
                    "display": "none"
                  });
                }
              }

              if (JSON.parse(message.payloadString).state.reported.humidity != undefined) {
                var humidity = JSON.parse(message.payloadString).state.reported.humidity;
                if (scope.$ctrl.chartStatus.humidity == true) {
                  calculateAvgMinMax("humidity", humidity);
                  moveChart(humidityChart, [humidity]);
                }

                humidityBool = true;

                if (!humidityState) {
                  humidityState = true;

                  $("#humidityWarning").css({
                    "display": "none"
                  });

                  $("#humiditySuccess").css({
                    "display": "block"
                  });
                }
              } else {
                if (humidityState) {
                  humidityState = false;

                  $("#humidityWarning").css({
                    "display": "block"
                  });

                  $("#humiditySuccess").css({
                    "display": "none"
                  });
                }
              }

              if (JSON.parse(message.payloadString).state.reported.moisture != undefined) {
                var moisture = JSON.parse(message.payloadString).state.reported.moisture;
                if (scope.$ctrl.chartStatus.moisture == true) {
                  calculateAvgMinMax("moisture", moisture);
                  moveChart(moistureChart, [moisture]);
                }

                moistureBool = true;

                if (!moistureState) {
                  moistureState = true;

                  $("#moistureWarning").css({
                    "display": "none"
                  });

                  $("#moistureSuccess").css({
                    "display": "block"
                  });
                }
              } else {
                if (moistureState) {
                  moistureState = false;

                  $("#moistureWarning").css({
                    "display": "block"
                  });

                  $("#moistureSuccess").css({
                    "display": "none"
                  });
                }
              }

              if (tempBool && humidityBool && moistureBool) {
                if (scope.$ctrl.chartStatus.aggregate == true) {
                  moveChart(aggregateChart, [temperature, humidity, moisture]);
                  moveChart(aggregateLineChart, [temperature, humidity, moisture]);
                }
              }
            }
          } catch (e) {
            console.log("error! " + e);
          }
        };

        $(".history-chart").on("click", function () {
          var chart = $(this).data("id");

          var updateChart = function () {
            /*for (var i = 0; i < 62; ++i) {
              data.avg.push(Math.floor((Math.random() * 30) + 1));
            }*/

            var date;
            var i;

            console.log("updating chart");
            if (chart == "tempHistory") {
              hTempData.datasets[0].data = [];
              hTempData.datasets[0].data = scope.$ctrl.tempHistory.avg;
              hTempData.labels = [];

              for (i = 0; i < scope.$ctrl.tempHistory.startTimes.length; ++i) {
                date = new Date(parseInt(scope.$ctrl.tempHistory.startTimes[i]));
                console.log(scope.$ctrl.tempHistory.startTimes[i]);
                console.log(date);
                hTempData.labels.push(date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear());
              }

              hTempChart.update(1000);
            } else if (chart == "humidityHistory") {
              console.log("updating humidity");
              hHumidityData.datasets[0].data = [];
              hHumidityData.datasets[0].data = scope.$ctrl.humidityHistory.avg;
              hHumidityData.labels = [];

              for (i = 0; i < scope.$ctrl.humidityHistory.startTimes.length; ++i) {
                date = new Date(parseInt(scope.$ctrl.humidityHistory.startTimes[i]));
                hHumidityData.labels.push(date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear());
              }

              hHumidityChart.update(1000);
            } else if (chart == "moistureHistory") {
              hMoistureData.datasets[0].data = [];
              hMoistureData.datasets[0].data = scope.$ctrl.moistureHistory.avg;
              hMoistureData.labels = [];

              for (i = 0; i < scope.$ctrl.moistureHistory.startTimes.length; ++i) {
                date = new Date(parseInt(scope.$ctrl.moistureHistory.startTimes[i]));
                hMoistureData.labels.push(date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear());
              }

              hMoistureChart.update(1000);
            }
          };

          scope.$ctrl.getPlantHistory(chart, updateChart);
        });
      }
    });
  };

  return {
    link: linkFunction
  };
});
