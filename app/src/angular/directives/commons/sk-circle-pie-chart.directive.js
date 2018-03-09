'use strict';

function SkCirclePieChartDirective($timeout,CommonService) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: (scope, element) => {
            const TOP_MAX_SIZE = 5;
            const colorForOthers = '#bad0db';

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
                let TOP_COLORS = ['#ff6400', '#03c8ce', '#a6e43b','#5f5f5f','#50b0fc'];
                
                items.sort((a, b) => {
                    return parseFloat(b.valueUSD || 0) - parseFloat(a.valueUSD || 0);
                });

                scope.topItems = items.slice(0, TOP_MAX_SIZE);
                let otherItems = items.slice(TOP_MAX_SIZE, items.length);

                if (items.length > TOP_MAX_SIZE) {
                    let otherAggregated = {
                        title: 'Others',
                        subTitle: '',
                        isOtherItem: true,
                        valueUSD: 0,
                        color: colorForOthers
                    };

                    otherItems.forEach(otherItem => {
                        otherAggregated.valueUSD += Number(otherItem.valueUSD);
                    });

                    otherAggregated.valueUSD = Number(CommonService.numbersAfterComma(otherAggregated.valueUSD, 2));

                    scope.topItems.push(otherAggregated);
                   
                }
              
                if (items.length <= TOP_MAX_SIZE) {
                    scope.isCollapsable = false;
                } else {
                    scope.isCollapsable = true;
                }

                if (!scope.isCollapsed) {
                    scope.isCollapsable = true;
                    scope.displayedItems = items;
                } else {
                    scope.displayedItems = scope.topItems;
                }

                if (otherItems.length > 0) {
                    otherItems.forEach((otherItem) => {
                        otherItem.isOtherItem = true;
                    });
                }

                let ethItem = items.find((item) => {
                    return item.subTitle.toLowerCase() == 'eth';
                });
                ethItem.icon = 'eth';

                let keyItem = items.find((item) => {
                    return item.subTitle.toLowerCase() == 'key';
                });
                keyItem.icon = 'key';

                items.forEach((item) => {
                    if (!item.color) {
                        if (TOP_COLORS.length) {
                            item.color = TOP_COLORS.shift();
                        } else {
                            item.color = colorForOthers;
                        }
                    }
                })
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

            let requestQueue = [];
            scope.data.draw = () => {
                requestQueue.push('newDrowRequest');
                $timeout(() => {
                    if (requestQueue.length) {
                        drawChart();                        
                        requestQueue = [];
                    }
                }, 500);
            }

        },
        replace: true,
        templateUrl: 'common/directives/sk-circle-pie-chart.html'
    }
}

module.exports = SkCirclePieChartDirective;
