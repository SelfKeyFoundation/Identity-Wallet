export const inventory = [
	{
		name: 'YouHodler',
		data: {
			loanType: ['lending', 'borrowing'],
			type: 'Centralized',
			interestRateLending: '6.5%',
			interestRateBorrowing: '1.5%',
			assets: ['BTC', 'ETH'],
			maxLoanLending: '$ 100,000 USD',
			maxLoanBorrowing: '$ 100,000 USD',
			logoUrl:
				'https://global-uploads.webflow.com/5cc19fbd198b8d31a9c64876/5cee8faeaeff6f36241942f1_fav_large.png'
		}
	},
	{
		name: 'CoinLoan',
		data: {
			loanType: ['borrowing'],
			type: 'Centralized',
			interestRateBorrowing: '2.5%',
			assets: ['BTC', 'ETH', 'KEY', 'SSD'],
			maxLoanBorrowing: '$ 1,000 USD',
			logoUrl: 'https://pbs.twimg.com/profile_images/1065190534547992577/8px-Ulhm_400x400.jpg'
		}
	}
];
