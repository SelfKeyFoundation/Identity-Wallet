import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import store from '../common/store';
import { ethGasStationInfoOperations } from 'common/eth-gas-station';
import { marketplacesOperations } from 'common/marketplaces';
import { Marketplace } from 'selfkey-ui';

class MarketplaceContainerSrc extends Component {
	static propTypes = {
		learnMoreAction: PropTypes.array
	};
	componentDidMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
		this.props.dispatch(marketplacesOperations.loadTransactions());
		this.props.dispatch(marketplacesOperations.loadStakes());
	}
	render() {
		let { learnMoreActions } = this.props;
		return (
			<Marketplace
				items={[
					{
						title: 'Crypto Exchanges',
						description:
							'Compare exchange accounts and instantly sign up for a verified account without waiting for limits. Includes data on supported countries, fiat currencies, trading pairs, fees, and more.',
						active: true,
						svgIcon:
							'https://dl.airtable.com/ugGbCqEQSKhS3ZPOhGMH_icon-exchange-crypto.svg',
						learnMoreAction: learnMoreActions[0]
					},
					{
						title: 'Incorporation',
						description:
							'Find the best jurisdiction to set up your business. Filter by corporate ownership, minimum shareholders, accounting requirements, privacy, tax rates, offshore tax laws, and more.',
						active: false,
						svgIcon:
							'https://dl.airtable.com/dt74JnTkRhae2c9zvrgW_icon-exchange-incorporations.svg.png'
					},
					{
						title: 'Passport & Residencies',
						description:
							'Build your life internationally by getting a second residency, which opens a myriad of opportunities that will let you grow both personally and professionally.',
						active: false,
						svgIcon:
							'https://dl.airtable.com/U6ZlerC2SLWaly8rRk3Q_icon-exchange-passports.svg.png'
					},
					{
						title: 'Bank Accounts',
						description:
							'Apply for international bank accounts and protect your savings in solid financial institutions with high solvency, liquidity, and prudent investment policies. ',
						active: false,
						svgIcon:
							'https://dl.airtable.com/wghrFU8FRI6rSM1MnYp6_icon-exchange-bank.svg.png'
					},
					{
						title: 'Translations',
						description:
							'Professionally translate your text or documents into the required language.',
						active: false,
						svgIcon:
							'https://dl.airtable.com/gqwI3QPQwmwc4Jsu4vep_icon-exchange-translations.svg.png'
					},
					{
						title: 'Notaries',
						description:
							'Verify and attest the authenticity of your legal or personal documents so that they have official credibility under law.',
						active: false,
						svgIcon:
							'https://dl.airtable.com/cQcRdsGeQSeM3ekJFo3E_icon-exchange-notaries.svg.png'
					}
				]}
			/>
		);
	}
}

const MarketplaceContainer = connect()(MarketplaceContainerSrc);

export const MarketplaceWrapper = props => (
	<Provider store={store}>
		<MarketplaceContainer {...props} />
	</Provider>
);

MarketplaceWrapper.propTypes = {
	learnMoreAction: PropTypes.array
};

export default MarketplaceWrapper;
