export const inventory = [
	{
		name: 'YouHodler',
		description: 'Lorem ipsum',
		data: {
			loanType: ['lending', 'borrowing'],
			type: 'Centralized',
			interestRateLending: '6.5%',
			interestRateBorrowing: '1.5%',
			assets: ['BTC', 'ETH'],
			paymentMethods: ['Credit Card', 'Stable Coins'],
			maxLoanLending: '$ 100,000 USD',
			maxLoanBorrowing: '$ 100,000 USD',
			maxLoanTermBorrowing: '6 months',
			maxLoanTermLending: '12 months',
			affiliateUrl: 'https://selfkey.org',
			location: ['Estonia'],
			yearLaunched: '2020',
			email: 'mail@youholder.com',
			url: 'http://youholder.com',
			kyc: true,
			kycPolicyUrl: 'http://www.selfkey.org',
			logoUrl:
				'https://global-uploads.webflow.com/5cc19fbd198b8d31a9c64876/5cee8faeaeff6f36241942f1_fav_large.png',
			requirements:
				'User needs to create an account and complete the KYC procedure in accordance with the company policy. Deposit collaterals in the Coinloan wallet. Select your interest rate, loan currency, term and desired loan amount. The higher the interest rate, the faster your application will be accepted by the lender. Generate a request or check CoinLoan Lending Market and accept a suitable loan offer to borrow immediately.'
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
