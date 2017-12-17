'use strict';

function SkCirclePieChartDirective() {
    'ngInject';
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: (scope, element) => {
            let chunk = function (arr, chunk) {
                let result = [];
                let i, j;
                for (i = 0, j = arr.length; i < j; i += chunk) {
                    result.push(arr.slice(i, i + chunk));
                }
                return result;
            };

            let getUniqueIdentifier = (item, index) => {
                return `${item.title + index}`;
            }
            scope.chunkedItems = chunk(scope.data.items, 3);
            google.charts.load("current", { packages: ["corechart"] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                let dataItems = [];
                let colors = [];
                scope.data.items.forEach((item, index) => {
                    item.uniqueIdentifier = getUniqueIdentifier(item, index);
                    dataItems.push([item.title, item.value]);
                    colors.push(item.color);
                });
                let processedData = [['Content', 'percents']].concat(dataItems);
                let data = google.visualization.arrayToDataTable(processedData);

                let options = {
                    backgroundColor: 'transparent',
                    title: "",
                    chartArea: { left: 10, top: 10, bottom: 10, right: 10 },
                    pieHole: 0.7,
                    pieSliceBorderColor: 'none',
                    colors: colors,
                    legend: {
                        position: 'none'
                    },
                    pieSliceText: 'none',
                    tooltip: {
                        trigger: 'none'
                    },
                    animation: {
                        duration: 4500,
                        startup: true
                    }
                };

                let chart = new google.visualization.PieChart(document.getElementById('chart'));
                scope.chartIsReady = false;
                google.visualization.events.addListener(chart, 'ready', function (chartItem) {
                    scope.chartIsReady = true;
                });

                chart.draw(data, options);

                let addOrRemoveActive = (chartItem, fn) => {
                    let index = chartItem.row;
                    let uniqueIdentifier = getUniqueIdentifier(scope.data.items[index], index);
                    let el = document.getElementsByName(uniqueIdentifier)[0];
                    let angularEl = angular.element(el);
                    angularEl[fn]('active');
                };

                google.visualization.events.addListener(chart, 'onmouseover', function (chartItem) {
                    let sel = chart.getSelection();
                    if (sel && sel.length && sel[0].row == chartItem.row) {
                        addOrRemoveActive(chartItem, 'removeClass');
                        setTimeout(() => {
                            addOrRemoveActive(chartItem, 'addClass');
                        }, 100);
                        return;
                    }
                    addOrRemoveActive(chartItem, 'addClass');
                });


                google.visualization.events.addListener(chart, 'onmouseout', function (chartItem) {
                    let sel = chart.getSelection();
                    if (sel && sel.length && sel[0].row == chartItem.row) {
                        return;
                    }
                    addOrRemoveActive(chartItem, 'removeClass');
                });

                google.visualization.events.addListener(chart, 'select', function (chartItem) {
                    let sel = chart.getSelection();
                    if (!sel || !sel[0]) {
                        return;
                    }
                    scope.data.items.forEach((item, index) => {
                        if (index != sel[0].row) {
                            addOrRemoveActive({ row: index }, 'removeClass');
                        }
                    });
                });
            }
        },
        replace: true,
        templateUrl: 'common/directives/sk-circle-pie-chart.html'
    }
}

export default SkCirclePieChartDirective;

