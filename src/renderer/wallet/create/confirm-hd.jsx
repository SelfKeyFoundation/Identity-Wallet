import React, { PureComponent } from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
// import { PasswordIcon } from 'selfkey-ui';
import PasswordIcon from '../../../theme/svg-icons/icon-password-type.png';

import { withStyles } from '@material-ui/styles';
import { Popup } from '../../common';
import { PropTypes } from 'prop-types';

const styles = theme => ({
	icon: {
		marginRight: '45px'
	},
	body: {
		width: '100%'
	},
	closeIcon: {
		marginTop: '20px'
	},
	next: {
		minWidth: '120px'
	},

	phraseSection: {
		textAlign: 'center',
		minWidth: '100%'
	},

	phraseContainer: {
		border: '2px dashed #697C95',
		background: '#1B2229',
		minWidth: '100%',
		padding: 25,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'wrap',
		marginBottom: 5,
		'& span': {
			margin: 10
		}
	},

	copyButton: {},

	wordBox: {
		minWidth: 100,
		border: '1px solid #93B0C1',
		borderRadius: 4,
		padding: 10,
		cursor: 'pointer'
	},
	emptyWordBox: {
		minWidth: 100,
		border: '1px solid #93B0C1',
		borderRadius: 4,
		padding: 10,
		minHeight: 38,
		opacity: 0.3,
		cursor: 'unset'
	}
});

class ConfirmDPhraseComponent extends PureComponent {
	render() {
		const {
			classes,
			error,
			backComponent,
			onNextClick,
			onCancelClick,
			onSelectWord,
			onClear,
			selectedSeedPhrase,
			shuffledSeedPhrase
		} = this.props;
		return (
			<Popup
				closeComponent={backComponent}
				closeAction={onCancelClick}
				open
				displayLogo
				text="Step 4: Confirm Backup"
			>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="flex-start"
					wrap="nowrap"
				>
					<Grid item className={classes.icon}>
						<img className={classes.passwordIcon} src={PasswordIcon} />
					</Grid>
					<Grid item xs>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="stretch"
							wrap="nowrap"
							spacing={4}
						>
							<Grid item className={classes.phraseSection}>
								<Typography variant="body1" gutterBottom>
									Confirm recovery phrase backup
								</Typography>
								<div className={classes.phraseContainer}>
									{selectedSeedPhrase.map(w => (
										<span key={w}>{w}</span>
									))}
								</div>
								<Button
									variant="text"
									color="primary"
									className={classes.copyButton}
									onClick={onClear}
								>
									X CLEAR
								</Button>
							</Grid>

							<Grid item>
								<Typography variant="body1" gutterBottom>
									Please tap each word in the correct order
								</Typography>
								<Grid
									container
									direction="row"
									justify="flex-start"
									alignItems="stretch"
									spacing={2}
								>
									{shuffledSeedPhrase.map(w => (
										<Grid item key={w} xs={3}>
											{selectedSeedPhrase.includes(w) ? (
												<div className={classes.emptyWordBox}> </div>
											) : (
												<div
													className={classes.wordBox}
													onClick={() => onSelectWord(w)}
												>
													{w}
												</div>
											)}
										</Grid>
									))}
								</Grid>
								{error && (
									<Typography variant="subtitle2" color="error">
										<br />
										{error}
									</Typography>
								)}
							</Grid>

							<Grid item>
								<Grid container direction="row" justify="flex-start" spacing={2}>
									<Grid item>
										<Button
											variant="contained"
											onClick={onNextClick}
											className={classes.next}
											disabled={
												selectedSeedPhrase.length !==
												shuffledSeedPhrase.length
											}
											size="large"
										>
											Continue
										</Button>
									</Grid>
									<Grid item>
										<Button
											variant="outlined"
											onClick={onCancelClick}
											size="large"
										>
											Cancel
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Popup>
		);
	}
}

export const ConfirmHDPhrase = withStyles(styles)(ConfirmDPhraseComponent);

ConfirmHDPhrase.displayName = 'ConfirmHDPhrase';
ConfirmHDPhrase.propTypes = {
	onNextClick: PropTypes.func.isRequired,

	backComponent: PropTypes.element
};
ConfirmHDPhrase.defaultProps = {};

export default ConfirmHDPhrase;
