import React, { Component } from 'react';
import { Grid, Typography, Paper, Button, Divider } from '@material-ui/core';
import { primary, HelpIcon, QuitIcon, SelfkeyLogoTemp } from 'selfkey-ui';
import { tokensOperations } from 'common/tokens';
import backgroundImage from '../../../static/assets/images/bgs/background.jpg';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { appOperations, appSelectors } from 'common/app';
import { isTestMode } from 'common/utils/common';
import ReactPiwik from 'react-piwik';
import { Popup } from '../common/popup';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import * as fs from 'fs';
import * as path from 'path';
import { canvas, faceDetectionOptions } from '../../idv-ocr/commons';
import axios from 'axios';

const { createCanvas, loadImage } = require('canvas');
const baseDir = path.resolve(__dirname, '../../../output');

const styles = theme => ({
	container: {
		backgroundImage: `url(${backgroundImage})`,
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		border: 'none',
		minHeight: '100vh'
	},
	parentGrid: {
		margin: 0,
		minHeight: '100vh',
		width: '100%'
	},
	insideGrid: {
		flexGrow: 1,
		margin: 0,
		width: '100%'
	},
	primaryTintText: {
		color: primary
	},
	icon: {
		width: '36px',
		height: '36px'
	},
	footerButton: {
		backgroundColor: 'transparent',
		'&:hover': {
			backgroundColor: 'transparent'
		}
	},
	divider: {
		background: 'linear-gradient(to bottom, #142a34 0%, #00c0d9 100%)',
		height: '120px',
		marginTop: '-88px',
		position: 'absolute',
		width: '1px'
	},
	footerQuit: {
		marginLeft: '-50px',
		marginTop: '-50px'
	},
	footerHelp: {
		marginLeft: '50px',
		marginTop: '-50px'
	},
	scrollFix: {
		margin: 0,
		width: '100%'
	},
	label: {
		marginBottom: '10px'
	}
});

const createWalletLink = props => <Link to="/createWallet" {...props} />;
const unlockWalletLink = props => <Link to="/unlockWallet" {...props} />;

class Home extends Component {
	state = {
		showFaceId: false,
		processing: false,
		processedImage: undefined,
		queryBase64: undefined,
		referenceBase64: undefined,
		error: false
	};

	includeTracking = () => {
		return this.props.hasAcceptedTracking && !isTestMode();
	};

	async componentDidMount() {
		this.props.dispatch(appOperations.loadWalletsOperation());
		this.props.dispatch(tokensOperations.loadTokensOperation());

		if (this.includeTracking()) {
			ReactPiwik.push(['setConsentGiven']);
		}

		const referenceImage = await loadImage(path.resolve(__dirname, 'document.jpg'));
		const referenceBase64 = this.toBase64FromImage(referenceImage);

		this.setState({ referenceImage, referenceBase64 });
	}

	setRef = webcam => {
		this.webcam = webcam;
	};

	handleOpen = () => {
		this.setState({
			showFaceId: true,
			processing: false,
			processedImage: undefined,
			queryBase64: undefined,
			error: false
		});
	};

	handleClose = () => {
		this.setState({ showFaceId: false });
	};

	handleVerifyLocal = async () => {
		const sourceBase64 = this.webcam.getScreenshot();
		const referenceImage = await loadImage(path.resolve(__dirname, 'document.jpg'));
		const queryImage = this.toImageFromBase64(sourceBase64);

		const resultsRef = await faceapi
			.detectAllFaces(referenceImage, faceDetectionOptions)
			.withFaceLandmarks()
			.withFaceDescriptors();

		const resultsQuery = await faceapi
			.detectAllFaces(queryImage, faceDetectionOptions)
			.withFaceLandmarks()
			.withFaceDescriptors();

		const faceMatcher = new faceapi.FaceMatcher(resultsRef);

		const labels = faceMatcher.labeledDescriptors.map(ld => ld.label);

		const refBoxesWithText = resultsRef
			.map(res => res.detection.box)
			.map((box, i) => new faceapi.BoxWithText(box, labels[i]));

		let results = [];

		const queryBoxesWithText = resultsQuery.map(res => {
			const bestMatch = faceMatcher.findBestMatch(res.descriptor);
			let obj = {
				match: bestMatch,
				box: res.detection.box
			};
			results.push(obj);
			return new faceapi.BoxWithText(res.detection.box, bestMatch.toString());
		});

		const outRef = faceapi.createCanvasFromMedia(referenceImage);
		faceapi.drawDetection(outRef, refBoxesWithText);
		this.saveFile('referenceImage.jpg', outRef.toBuffer('image/jpeg'));

		const outQuery = faceapi.createCanvasFromMedia(queryImage);
		faceapi.drawDetection(outQuery, queryBoxesWithText);
		this.saveFile('queryImage.jpg', outQuery.toBuffer('image/jpeg'));

		this.handleClose();
	};

	handleVerifyAPI = async () => {
		const self = this;
		const queryBase64 = this.webcam.getScreenshot();
		this.setState(
			{
				queryBase64,
				processing: true
			},
			async () => {
				const body = {
					document: self.state.referenceBase64,
					selfie: queryBase64
				};
				let data;
				try {
					let response = await axios.post('http://localhost:1337/v1/identity', body);
					data = response.data;
				} catch (error) {
					console.log(error);
					this.setState({ error: true });
				}
				this.setState({
					processing: false,
					processedImage: data && data.outSelfie ? data.outSelfie : undefined
				});
			}
		);
	};

	toImageFromBase64 = string => {
		var image = new canvas.Image();
		image.src = string;
		return image;
	};

	toBase64FromImage = image => {
		let c = createCanvas(image.width, image.height);
		let ctx = c.getContext('2d');
		ctx.drawImage(image, 0, 0);
		return c.toDataURL('image/jpeg');
	};

	saveFile = (fileName, buf) => {
		if (!fs.existsSync(baseDir)) {
			fs.mkdirSync(baseDir);
		}
		fs.writeFileSync(path.resolve(baseDir, fileName), buf);
	};

	render() {
		const { classes } = this.props;
		const { showFaceId, processing, processedImage, queryBase64, error } = this.state;
		const videoConstraints = {
			facingMode: 'user'
		};
		return (
			<React.Fragment>
				<Paper className={classes.container} square={true}>
					<Grid
						container
						direction="column"
						justify="space-between"
						alignItems="center"
						spacing={40}
						className={classes.parentGrid}
					>
						<Grid
							container
							item
							direction="column"
							justify="center"
							alignItems="center"
							spacing={40}
							className={classes.insideGrid}
						>
							<Grid
								container
								item
								direction="column"
								justify="flex-start"
								alignItems="center"
								spacing={8}
								className={classes.scrollFix}
							>
								<Grid item>
									<SelfkeyLogoTemp />
								</Grid>
								<Grid item>
									<Typography variant="h2" className={classes.primaryTintText}>
										IDENTITY WALLET
									</Typography>
								</Grid>
							</Grid>
							<Grid
								container
								item
								direction="column"
								justify="flex-end"
								alignItems="center"
								spacing={32}
							>
								<Grid item>
									<Button
										id="createWallet"
										variant="contained"
										component={createWalletLink}
										size="large"
									>
										CREATE NEW WALLET
									</Button>
								</Grid>
								<Grid item>
									<Button
										id="useExistingWalletButton"
										variant="outlined"
										component={unlockWalletLink}
										size="large"
									>
										USE EXISTING WALLET
									</Button>
								</Grid>
								<Grid item>
									<Button
										id="useExistingWalletButton"
										variant="outlined"
										onClick={this.handleOpen}
										size="large"
									>
										FACE ID
									</Button>
								</Grid>
							</Grid>
						</Grid>
						<Grid
							container
							item
							direction="row"
							justify="center"
							alignItems="flex-end"
							spacing={24}
							className={classes.scrollFix}
						>
							<Grid item>
								<Button
									color="primary"
									size="medium"
									onClick={e => {
										window.openExternal(e, 'https://help.selfkey.org/');
									}}
									className={classes.footerButton}
								>
									<Grid
										container
										direction="column"
										justify="center"
										alignItems="center"
										className={classes.footerHelp}
									>
										<Grid item>
											<HelpIcon className={classes.icon} />
										</Grid>
										<Grid item>HELP</Grid>
									</Grid>
								</Button>
							</Grid>
							<Grid item>
								<div className={classes.divider} />
							</Grid>
							<Grid item>
								<Button
									color="primary"
									size="medium"
									onClick={window.quit}
									className={classes.footerButton}
								>
									<Grid
										container
										direction="column"
										justify="center"
										alignItems="center"
										className={classes.footerQuit}
									>
										<Grid item>
											<QuitIcon className={classes.icon} />
										</Grid>
										<Grid item>QUIT</Grid>
									</Grid>
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Paper>
				<Popup open={showFaceId} closeAction={this.handleClose} text={'FACE ID'}>
					<Typography variant="overline" className={classes.label}>
						Webcam Selfie
					</Typography>
					{!processing && (
						<Webcam
							audio={false}
							width={640}
							height={560}
							ref={this.setRef}
							screenshotFormat="image/jpeg"
							videoConstraints={videoConstraints}
						/>
					)}
					{processing && <img src={queryBase64} />}
					<Divider />
					<br />
					<Typography variant="overline" className={classes.label}>
						Verification Results
					</Typography>
					{processedImage !== undefined && <img src={processedImage} />}
					{error && (
						<Typography variant="overline" className={classes.label}>
							Error while verifying identity. Please try again later.
						</Typography>
					)}
					<br />
					<Divider />
					<br />
					<br />
					<Grid container spacing={24}>
						<Grid item>
							<Button
								variant="contained"
								size="large"
								onClick={this.handleVerifyAPI}
								disabled={processing}
							>
								Verify
							</Button>
						</Grid>
						<Grid item>
							<Button variant="outlined" size="large" onClick={this.handleClose}>
								Close
							</Button>
						</Grid>
					</Grid>
				</Popup>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		hasAcceptedTracking: appSelectors.hasAcceptedTracking(state)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(Home));
