import React from 'react';
import { Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Popup } from '../../../common';

const styles = theme => ({
	container: {
		margin: '0 auto',
		maxHeight: '723px',
		maxWidth: '780px',
		position: 'relative',
		width: '100%'
	},
	text: {
		marginBottom: '40px',
		maxHeight: '464px',
		overflowY: 'scroll'
	},
	requestBtn: {
		marginRight: '20px'
	},
	popupPadding: {
		padding: '30px 30px 60px'
	}
});

export const TOCPopup = withStyles(styles)(props => {
	const { classes, onBack, onDisagree, onAgree } = props;

	return (
		<Popup xtraClass={classes.popupPadding} closeAction={onBack} text="Need to Accept Terms">
			<div className={classes.container}>
				<div className={classes.contentContainer}>
					<div className={classes.text}>
						<Typography variant="body2">
							13. Miscellaneous a. Amendment. Company shall have the right, at any
							time and without notice, to add to or modify the terms of this
							Agreement, simply by delivering such amended terms to User by electronic
							message through any medium to any address provided to Company by User.
							Users access to or use of the Software after the date such amended terms
							are delivered to User shall be deemed to constitute acceptance of such
							amended terms. b. Severance. If any provision or part-provision of this
							Agreement is, or becomes invalid, illegal or unenforceable, it shall be
							deemed modified to the minimum extent necessary to make it valid, legal
							and enforceable. If such modification is not possible, the relevant
							provision or part-provision shall be deemed deleted. Any modification to
							or deletion of a provision or part-provision under this Article shall
							not affect the validity and enforceability of the rest of this
							Agreement. c. Entire Agreement – Disclaimer of Reliance. This Agreement
							constitutes the entire agreement between the Parties with respect to the
							subject matter hereof and supersedes all prior agreements or
							understandings between the Parties. Each Party expressly warrants and
							represents that: a) it has authority to enter this Agreement; and b) it
							is not relying upon any statements, understandings, representations,
							expectations or agreements other than those expressly set forth in this
							Agreement.
						</Typography>
						<Typography variant="body2">
							14. Miscellaneous Amendment. Company shall have the right, at any time
							and without notice, to add to or modify the terms of this Agreement,
							simply by delivering such amended terms to User by electronic message
							through any medium to any address provided to Company by User. Users
							access to or use of the Software after the date such amended terms are
							delivered to User shall be deemed to constitute acceptance of such
							amended terms. b. Severance. If any provision or part-provision of this
							Agreement is, or becomes invalid, illegal or unenforceable, it shall be
							deemed modified to the minimum extent necessary to make it valid, legal
							and enforceable. If such modification is not possible, the relevant
							provision or part-provision shall be deemed deleted. Any modification to
							or deletion of a provision or part-provision under this Article shall
							not affect the validity and enforceability of the rest of this
							Agreement. c. Entire Agreement – Disclaimer of Reliance. This Agreement
							constitutes the entire agreement between the Parties with respect to the
							subject matter hereof and supersedes all prior agreements or
							understandings between the Parties. Each Party expressly warrants and
							represents that: a) it has authority to enter this Agreement; and b) it
							is not relying upon any statements, understandings, representations,
							expectations or agreements other than those expressly set forth in this
							Agreement.
						</Typography>
					</div>
					<div className={classes.buttons}>
						<Button
							className={classes.requestBtn}
							variant="contained"
							size="large"
							onClick={onAgree}
						>
							I agree to the terms of service
						</Button>
						<Button
							variant="outlined"
							color="secondary"
							size="large"
							onClick={onDisagree}
						>
							I don’t agree
						</Button>
					</div>
				</div>
			</div>
		</Popup>
	);
});

export default TOCPopup;
