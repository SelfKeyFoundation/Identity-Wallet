'use strict';
function SkCirclePieChartDirective($state) {
	'ngInject';

	return {
		restrict: 'E',
		scope: {
			data: '='
		},
		link: (scope, element) => {
			scope.topItems = [];
			scope.displayedItems = [];

			let processItems = () => {
				let items = scope.data.items;

				items = items.reduce((res, current, index, array) => {
					return res.concat([current, current]);
				}, []);

				items = items.reduce((res, current, index, array) => {
					return res.concat([current, current]);
				}, []);
				items = items.reduce((res, current, index, array) => {
					return res.concat([current, current]);
				}, []);
				items = items.reduce((res, current, index, array) => {
					return res.concat([current, current]);
				}, []);
				items = items.reduce((res, current, index, array) => {
					return res.concat([current, current]);
				}, []);

				items.sort((a, b) => {
					let check = b.valueUSD - a.valueUSD;
					if (check === 0) {
						let textA = a.title.toLowerCase();
						let textB = b.title.toLowerCase();
						return textA < textB ? -1 : textA > textB ? 1 : 0;
					}
					return check;
				});

				scope.displayedItems = items.map(token => {
					return {
						name: token.title,
						symbol: token.subTitle,
						balance: token.amount,
						balanceInFiat: token.valueUSD
					};
				});
			};

			processItems();

			scope.navigateToManageCryptos = () => {
				$state.go('member.wallet.manage-cryptos');
			};
		},
		replace: true,
		templateUrl: 'common/directives/sk-circle-pie-chart.html'
	};
}
SkCirclePieChartDirective.$inject = ['$state'];
module.exports = SkCirclePieChartDirective;
