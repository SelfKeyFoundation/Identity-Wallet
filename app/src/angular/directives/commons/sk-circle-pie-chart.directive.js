'use strict';

function SkCirclePieChartDirective($timeout) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: (scope, element) => {

            const TOP_MAX_SIZE = 5;
            scope.isCollapsed = true;
            scope.isCollapsable = false;
            scope.topItems = [];
            scope.displayedItems = [];

            scope.config = {
                mainLayout: 'row',
                itemCls: 'item',
                pieChartCls: ''
            };

            scope.toogleCollapse = (collapse) => {
                scope.chartIsReady = false;
                scope.config.mainLayout = collapse ? 'row' : 'column';
                scope.config.itemCls = collapse ? 'item' : 'item full';
                scope.config.pieChartCls = collapse ? '' : 'full';
                scope.isCollapsed = collapse;

                scope.data.draw();
            };

            let processItems = () => {
                let items = scope.data.items;

                items.sort((a, b) => {
                    let symbol = a.subTitle.toLowerCase();
                    if (symbol == 'eth') {
                        return -1;
                    }
                    if (symbol == 'key') {
                        return -1;
                    }

                    return parseFloat(b.value || 0) - parseFloat(a.value || 0);
                });

                scope.topItems = items.slice(0, TOP_MAX_SIZE);

                let otherItems = items.slice(TOP_MAX_SIZE, items.length);

                if (items.length >= TOP_MAX_SIZE) {
                    let otherAggregated = {
                        title: 'Others',
                        subTitle: '',
                        value: 0,
                        isOtherItem: true,
                        valueUSD: 0,
                        color: 'red',
                        icon: 'eth' //TODO
                    };

                    otherItems.forEach(otherItem => {
                        otherAggregated.value += otherItem.value;
                        otherAggregated.valueUSD += otherItem.valueUSD;
                    });

                    scope.topItems.push(otherAggregated);

                    scope.displayedItems = scope.topItems;
                }

                if (items.length >= TOP_MAX_SIZE && scope.isCollapsed) {
                    scope.isCollapsable = true;
                } else {
                    scope.displayedItems = items;
                }

                if (otherItems.length > 0) {
                    otherItems.forEach((otherItem) => {
                        otherItem.isOtherItem = true;
                    });
                }
            };

            let getUniqueIdentifier = (item, index) => {
                if (item.isOtherItem) {
                    return 'otherItem';
                }
                return `${item.title + index}`;
            }

            google.charts.load("current", { packages: ["corechart"] });
            google.charts.setOnLoadCallback(() => {
                if (scope.data.callback && scope.data.callback.onReady) {
                    scope.data.callback.onReady();
                }
            });

            function drawChart() {
                let container = document.getElementById('chart');

                if (!container) return;

                let addOrRemoveActive = (chartItem, fn) => {
                    let index = chartItem.row;
                    let uniqueIdentifier = getUniqueIdentifier(scope.displayedItems[index], index);
                    let els = document.getElementsByName(uniqueIdentifier);
                    for (let i = 0; i < els.length; i++) {
                        let el = els[i];
                        let angularEl = angular.element(el);
                        angularEl[fn]('active');
                    }
                };

                let itemEls = document.getElementsByClassName('item');
                for (let i = 0; i < itemEls.length; i++) {
                    addOrRemoveActive({ row: i }, 'removeClass');
                }

                processItems();

                let dataItems = [];
                let colors = [];
                scope.topItems.forEach((item, index) => {
                    dataItems.push([item.title, item.valueUSD]);
                    colors.push(item.color);
                });

                scope.displayedItems.forEach((displayedItem, index) => {
                    displayedItem.uniqueIdentifier = getUniqueIdentifier(displayedItem, index);
                });


                let processedData = [['Content', 'percents']].concat(dataItems);
                let data = google.visualization.arrayToDataTable(processedData);

                let options = {
                    backgroundColor: 'transparent',
                    title: "",
                    chartArea: { left: 15, top: 15, bottom: 15, right: 15 },
                    pieHole: 0.7,
                    pieSliceBorderColor: 'none',
                    colors: colors,
                    legend: {
                        position: 'none'
                    },
                    pieSliceText: 'none',
                    tooltip: {
                        trigger: 'focus',
                        isHtml: true
                    },
                    animation: {
                        startup: true
                    }
                };

                let chart = new google.visualization.PieChart(container);

                scope.chartIsReady = false;

                google.visualization.events.addListener(chart, 'ready', function (chartItem) {
                    scope.chartIsReady = true;
                });

                chart.draw(data, options);

                google.visualization.events.addListener(chart, 'onmouseover', function (chartItem) {
                    let sel = chart.getSelection();
                    if (sel && sel.length && sel[0].row == chartItem.row) {
                        addOrRemoveActive(chartItem, 'removeClass');
                        $timeout(() => {
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

                    scope.displayedItems.forEach((item, index) => {
                        if (index != sel[0].row && index < scope.topItems.length) {
                            addOrRemoveActive({ row: index }, 'removeClass');
                        } else {
                            if (scope.data.callback && scope.data.callback.onItemClick) {
                                scope.data.callback.onItemClick(item);
                            }
                        }
                    });
                });
            }

            scope.data.draw = () => {
                $timeout(() => {
                    drawChart();
                }, 400);
            }

        },
        replace: true,
        templateUrl: 'common/directives/sk-circle-pie-chart.html'
    }
}

module.exports = SkCirclePieChartDirective;
