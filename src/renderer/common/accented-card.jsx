import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card } from '@material-ui/core';
import classNames from 'classnames';

const useStyles = makeStyles(theme => {
	return {
		root: {
			boxShadow: props =>
				props.elevation ? theme.shadows[props.elevation] : theme.shadows[0],
			background: props =>
				props.gradient ? 'linear-gradient(157.35deg, #2E3945 0%, #222B34 100%)' : undefined
		},
		innerContainer: {
			width: '100%',
			height: '100%',
			position: 'relative'
		},
		accented: {
			paddingLeft: 7,
			'&:before': {
				content: '""',
				position: 'absolute',
				height: '100%',
				left: '0px',
				width: '7px',
				display: 'block',
				top: '0',
				background: props => props.accentColor || undefined
			}
		},
		background: {
			background: props => {
				const {
					img,
					repeat = 'no-repeat',
					size = '160px 120px',
					position = 'right bottom',
					origin = ''
				} = props.backgroundImage || {};

				if (!img) {
					return undefined;
				}
				console.log(`url(${img}) ${position}/${size} ${repeat} ${origin}`);
				return `url(${img}) ${position}/${size} ${repeat} ${origin}`;
			}
		}
	};
});

export const AccentedCard = ({ gradient, children, accentColor, backgroundImage, ...props }) => {
	const classes = useStyles({
		gradient,
		elevation: props.elevation,
		accentColor,
		backgroundImage
	});
	return (
		<Card classes={{ root: classes.root }} {...props}>
			<div
				className={classNames(classes.innerContainer, {
					[classes.accented]: !!accentColor,
					[classes.background]: !!backgroundImage
				})}
			>
				{children}
			</div>
		</Card>
	);
};

export default AccentedCard;
