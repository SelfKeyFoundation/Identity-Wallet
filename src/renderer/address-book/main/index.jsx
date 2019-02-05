import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { addressBookSelectors, addressBookOperations } from 'common/address-book';
import AddressBookAddContainer from 'renderer/address-book/add';
import AddressBookEditContainer from 'renderer/address-book/edit';
import AddressBookIcon from 'renderer/address-book/icon';
import { H2, CopyIcon, DeleteIcon, EditTransparentIcon } from 'selfkey-ui';
import { withStyles } from '@material-ui/core/styles';
import {
	Grid,
	Typography,
	Button,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	IconButton
} from '@material-ui/core';

const styles = theme => ({
	addressBook: {
		width: '1140px'
	},

	button: {
		height: '44px',
		width: '180px',
		border: '2px solid #1CA9BA',
		borderRadius: '3px',
		boxShadow: 'inset 3px 3px 10px 0 rgba(0,0,0,0.1)',
		color: '#1CA9BA',
		fontSize: '16px',
		fontWeight: 'bold',
		letterSpacing: '0.67px',
		lineHeight: '19px',
		textAlign: 'center'
	},

	descriptionText: {
		color: '#93B0C1',
		fontSize: '18px',
		lineHeight: '28px',
		textAlign: 'center'
	},

	table: {
		borderSpacing: '0px',
		minWidth: '900px',
		'& tbody tr:nth-child(odd)': {
			background: '#262f39'
		}
	},

	headerTableRow: {
		height: '38px',
		'& th': {
			fontSize: '12px',
			fontWeight: 600,
			textAlign: 'left',
			color: '#7f8fa4',
			textTransform: 'uppercase',
			borderBottom: '0px',
			paddingLeft: '0px'
		},
		'& th:first-child': {
			paddingLeft: '24px !important'
		}
	},

	bodyTableRow: {
		height: '74px',
		cursor: 'pointer',
		'& td': {
			padding: '0px',
			fontSize: '15px',
			textAlign: 'left',
			color: '#ffffff',
			borderBottom: '0px'
		},
		'& td:first-child': {
			paddingLeft: '24px !important'
		}
	}
});

class AddressBookContainer extends Component {
	state = {
		addresses: [],
		showModalAdd: false,
		showModalEdit: false,
		id: undefined,
		label: ''
	};

	componentDidMount() {
		this.props.dispatch(addressBookOperations.loadAddressBook());
	}

	componentDidUpdate(prevProps) {
		if (prevProps.addresses !== this.props.addresses) {
			this.setState({
				...this.state,
				addresses: this.props.addresses
			});
		}
	}

	openModalAdd = () => {
		this.setState({
			...this.state,
			showModalAdd: true,
			showModalEdit: false
		});
	};

	closeModalAdd = () => {
		this.setState({
			...this.state,
			showModalAdd: false
		});
	};

	openModalEdit = () => {
		this.setState({
			...this.state,
			showModalAdd: false,
			showModalEdit: true
		});
	};

	confirmModalEdit = ({ id, label }) => {
		const addresses = this.props.addresses.slice();
		const address = addresses.find(address => {
			return address.id === id;
		});
		address.label = label;
		this.setState({
			...this.state,
			addresses: addresses
		});
	};

	closeModalEdit = () => {
		this.setState({
			...this.state,
			showModalEdit: false
		});
	};

	handleEdit = id => {
		const address = this.props.addresses.find(address => {
			return address.id === id;
		});
		this.setState(
			{
				...this.state,
				id: id,
				label: address.label
			},
			function() {
				return this.openModalEdit();
			}
		);
	};

	handleDelete = id => {
		this.props.dispatch(addressBookOperations.deleteAddressBookEntry(id));
	};

	render() {
		const { classes } = this.props;
		const { showModalAdd, showModalEdit, addresses } = this.state;
		return (
			<Grid
				container
				direction="column"
				justify="center"
				alignItems="center"
				className={classes.addressBook}
				spacing={32}
			>
				<Grid item>
					<AddressBookIcon />
				</Grid>
				<Grid item>
					<H2>Address Book</H2>
				</Grid>
				<Grid item>
					<Typography variant="body1" className={classes.descriptionText}>
						Create and assign labels to save commonly used Ethereum addresses when
						sending assets from the SelfKey Identity Wallet.
					</Typography>
				</Grid>
				<Grid item>
					<Button
						id="addAddressButton"
						className={classes.button}
						onClick={this.openModalAdd}
					>
						ADD ADDRESS
					</Button>
				</Grid>
				<Grid item>
					<Table className={classes.table}>
						<TableHead>
							<TableRow className={classes.headerTableRow}>
								<TableCell>LABEL</TableCell>
								<TableCell>ETH ADDRESS</TableCell>
								<TableCell>ACTIONS</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{addresses &&
								addresses.map(address => {
									return (
										<TableRow key={address.id} className={classes.bodyTableRow}>
											<TableCell id={address.id}>{address.label}</TableCell>
											<TableCell>{address.address}</TableCell>
											<TableCell>
												<Grid
													container
													direction="row"
													justify="flex-start"
													alignItems="center"
												>
													<Grid item>
														<IconButton>
															<CopyToClipboard text={address.address}>
																<CopyIcon />
															</CopyToClipboard>
														</IconButton>
													</Grid>
													<Grid item>
														<IconButton
															id="editButton"
															onClick={() =>
																this.handleEdit(address.id)
															}
														>
															<EditTransparentIcon />
														</IconButton>
													</Grid>
													<Grid item>
														<IconButton
															id="deleteButton"
															onClick={() =>
																this.handleDelete(address.id)
															}
														>
															<DeleteIcon />
														</IconButton>
													</Grid>
												</Grid>
											</TableCell>
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</Grid>
				{showModalAdd && <AddressBookAddContainer closeAction={this.closeModalAdd} />}
				{showModalEdit && (
					<AddressBookEditContainer
						closeAction={this.closeModalEdit}
						confirmAction={this.confirmModalEdit}
						id={this.state.id}
						label={this.state.label}
					/>
				)}
			</Grid>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		addresses: addressBookSelectors.getAddresses(state)
	};
};

const styledComponent = withStyles(styles)(AddressBookContainer);
export default connect(mapStateToProps)(styledComponent);
