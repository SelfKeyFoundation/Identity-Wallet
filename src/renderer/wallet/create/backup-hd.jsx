import React, { PureComponent } from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { PasswordIcon } from 'selfkey-ui';
import { withStyles } from '@material-ui/styles';
import { Popup } from '../../common';
import { PropTypes } from 'prop-types';

const styles = theme => ({
	icon: {
		marginRight: '45px'
	},
	closeIcon: {
		marginTop: '20px'
	},
	next: {
		minWidth: '120px'
	},

	phraseSection: {
		textAlign: 'center'
	},

	phraseContainer: {
		border: '2px dashed #697C95',
		background: '#1B2229',
		width: '100%',
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

	copyButton: {}
});

class BackupHDPhraseComponent extends PureComponent {
	render() {
		const {
			classes,
			backComponent,
			onNextClick,
			onCancelClick,
			seedPhrase,
			onCopyPhrase
		} = this.props;
		return (
			<Popup
				closeComponent={backComponent}
				closeAction={onCancelClick}
				open
				displayLogo
				text="Step 3: Backup Your Wallet"
			>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="flex-start"
					wrap="nowrap"
				>
					<Grid item className={classes.icon}>
						<PasswordIcon className={classes.passwordIcon} />
					</Grid>
					<Grid item>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="stretch"
							wrap="nowrap"
							spacing={4}
						>
							<Grid item>
								<Typography variant="body1">
									Write down the following phrase in this specific order, and keep
									it safe
								</Typography>
							</Grid>
							<Grid item className={classes.phraseSection}>
								<div className={classes.phraseContainer}>
									{seedPhrase.map(w => (
										<span key={w}>{w}</span>
									))}
								</div>
								<Button
									variant="text"
									color="primary"
									className={classes.copyButton}
									onClick={onCopyPhrase}
								>
									COPY PHRASE
								</Button>
							</Grid>
							<Grid item>
								<Typography variant="subtitle2" color="secondary">
									This phrase is the only way to recover your wallet if you ever
									forget your password. Keep it safe.
								</Typography>
								<br />
								<Typography variant="subtitle2" color="secondary">
									Write it down on paper. This is the safest way to store the
									recovery phrase.
								</Typography>
							</Grid>
							<Grid item>
								<Grid container direction="row" justify="flex-start" spacing={2}>
									<Grid item>
										<Button
											variant="contained"
											onClick={onNextClick}
											className={classes.next}
											size="large"
										>
											I’ve written it down
										</Button>
										<Typography variant="subtitle2" color="secondary">
											<br />
											We will confirm on the next screen
										</Typography>
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

export const BackupHDPhrase = withStyles(styles)(BackupHDPhraseComponent);

BackupHDPhrase.displayName = 'BackupHDPhrase';
BackupHDPhrase.propTypes = {
	onNextClick: PropTypes.func.isRequired,

	backComponent: PropTypes.element
};
BackupHDPhrase.defaultProps = {};

export default BackupHDPhrase;
