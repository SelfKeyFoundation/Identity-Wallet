'use strict';

function SkCirclePieChartDirective() {
    'ngInject';
    return {
        restrict: 'E',
        scope: {
        },
        link: (scope, element) => {
            //TODO chunck array of items
            google.charts.load("visualization", "1", { packages: ["corechart"] });

            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var data = google.visualization.arrayToDataTable([
                    ['Content', 'Size'],
                    ['Photos', 20],
                    ['Videos', 20],
                    ['Free Space', 20]
                ]);

                var options = {
                    backgroundColor: 'transparent',
                    title: "",
                    chartArea:{left:5,top:5,bottom:5,right:5,width:'100%',height:'100%'},
                    pieHole: 0.7,
                    pieSliceBorderColor: "none",
                    colors: ['#4080ff', '#3bdee8', '#f95b02'],
                    legend: {
                        position: "none"
                    },
                    pieSliceText: "none",
                    tooltip: {
                        trigger: "none"
                    }
                };

                var chart = new google.visualization
                    .PieChart(document.getElementById('chart'));

                chart.draw(data, options);

                google.visualization.events.addListener(chart, 'onmouseover', function(e,a) {
                    console.log('AEEEE RA CHEMI YLEA ESA HA',e,a)
                })

            }
        },
        replace: true,
        templateUrl: 'common/directives/sk-circle-pie-chart.html'
    }
}

export default SkCirclePieChartDirective;

