import * as React from 'react';
import { MuiThemeProvider, createMuiTheme, CssBaseline } from '@material-ui/core';
import {
	primary,
	typography,
	error,
	primaryTint,
	warning,
	white,
	grey,
	base,
	baseDark,
	baseLight
} from './colors';

export const theme = createMuiTheme({
	// Reset and Globals
	'@global': {
		'html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video': {
			margin: '0',
			padding: '0',
			border: '0',
			fontSize: '100%',
			font: 'inherit',
			verticalAlign: 'baseline'
		},
		'article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section': {
			display: 'block'
		},
		'ol, ul': {
			listStyle: 'none'
		},
		'blockquote, q': {
			quotes: 'none'
		},
		'blockquote:before, blockquote:after, q:before, q:after': {
			content: 'none'
		},
		table: {
			borderCollapse: 'collapse',
			borderSpacing: 0
		},
		body: {
			lineHeight: 1,
			background: '#111111',
			fontFamily: 'Lato, arial, sans-serif',
			fontSmoothing: 'antialiased',
			osxFontSmoothing: 'grayscale',
			overflowX: 'hidden',
			'&::-webkit-scrollbar': {
				backgroundColor: 'rgba(0,0,0,.5)',
				width: '8px'
			},
			'&::-webkit-scrollbar-thumb': {
				borderRadius: '10px',
				backgroundColor: '#191919'
			}
		},
		html: {
			'&::-webkit-scrollbar': {
				backgroundColor: 'rgba(0,0,0,.5)',
				width: '8px'
			},
			'&::-webkit-scrollbar-thumb': {
				borderRadius: '10px',
				backgroundColor: '#191919'
			}
		},
		div: {
			'&::-webkit-scrollbar': {
				backgroundColor: 'rgba(0,0,0,.15)',
				width: '8px'
			},
			'&::-webkit-scrollbar-thumb': {
				borderRadius: '10px',
				backgroundColor: '#191919'
			}
		}
	},
	// Theme
	palette: {
		primary: {
			main: primary,
			light: primaryTint
		},
		secondary: {
			main: typography
		},
		error: {
			main: error
		},
		text: {
			primary: white,
			secondary: grey,
			disabled: grey,
			hint: 'rgba(0, 0, 0, 0.38)'
		}
	},
	typography: {
		fontFamily: ['Lato', 'arial', 'sans-serif'].join(','),
		fontSize: 16
		// useNextVariants: true,
	},
	overrides: {
		MuiCssBaseline: {
			'@global': {
				body: {
					lineHeight: 1,
					background: '#111111',
					fontFamily: 'Lato, arial, sans-serif',
					fontSmoothing: 'antialiased',
					osxFontSmoothing: 'grayscale',
					overflowX: 'hidden',
					'&::-webkit-scrollbar': {
						backgroundColor: 'rgba(0,0,0,.5)',
						width: '8px'
					},
					'&::-webkit-scrollbar-thumb': {
						borderRadius: '10px',
						backgroundColor: '#191919'
					}
				},
				html: {
					'&::-webkit-scrollbar': {
						backgroundColor: 'rgba(0,0,0,.5)',
						width: '8px'
					},
					'&::-webkit-scrollbar-thumb': {
						borderRadius: '10px',
						backgroundColor: '#191919'
					}
				},
				div: {
					'&::-webkit-scrollbar': {
						backgroundColor: 'rgba(0,0,0,.15)',
						width: '8px'
					},
					'&::-webkit-scrollbar-thumb': {
						borderRadius: '10px',
						backgroundColor: '#191919'
					}
				}
			}
		},
		MuiCard: {
			root: {
				backgroundColor: base,
				boxShadow: 'none',
				height: '100%'
			}
		},
		MuiCardHeader: {
			title: {
				color: white,
				fontSize: '18px',
				fontWeight: 400,
				lineHeight: '22px'
			},
			subheader: {
				color: white,
				fontSize: '16px',
				fontWeight: 600
			}
		},
		MuiCardContent: {
			root: {
				height: '100%'
			}
		},
		MuiTypography: {
			root: {
				color: '#fff'
			},
			h1: {
				fontSize: '24px',
				fontWeight: 400,
				lineHeight: '30px'
			},
			h2: {
				fontSize: '18px',
				fontWeight: 400,
				lineHeight: '26px'
			},
			h3: {
				color: typography,
				fontSize: '16px',
				lineHeight: '24px'
			},
			h4: {
				fontSize: '18px',
				fontWeight: 600,
				lineHeight: '26px'
			},
			h5: {
				fontSize: '16px',
				fontWeight: 600,
				lineHeight: '20px',
				zIndex: 1
			},
			h6: {
				fontSize: '15px',
				lineHeight: '22px'
			},
			body1: {
				fontSize: '18px',
				lineHeight: '28px'
			},
			body2: {
				fontSize: '16px',
				lineHeight: '24px'
			},
			subtitle1: {
				fontSize: '14px',
				lineHeight: '17px'
			},
			subtitle2: {
				fontSize: '13px',
				lineHeight: '19px'
			},
			caption: {
				color: warning,
				display: 'block',
				fontSize: '16px',
				lineHeight: '24px'
			},
			overline: {
				color: typography,
				display: 'block',
				fontSize: '12px',
				fontWeight: 600,
				lineHeight: '15px',
				textTransform: 'uppercase',
				whiteSpace: 'normal'
			},
			gutterBottom: {
				marginBottom: '1em'
			}
		},
		MuiList: {
			root: {
				paddingRight: '8px!important'
			},
			padding: {
				boxSizing: 'border-box',
				padding: '8px'
			}
		},
		MuiListItem: {
			root: {
				marginBottom: '8px',
				paddingBottom: '0',
				paddingTop: '0',
				'&$selected': {
					backgroundColor: grey,
					'& .choose': {
						color: `${baseDark} !important`
					},
					'&:hover': {
						backgroundColor: grey
					},
					'&$disabled': {
						backgroundColor: `${baseLight} !important`
					}
				}
			},
			button: {
				margin: '0',
				'&:hover': {
					backgroundColor: '#394553'
				}
			}
		},
		MuiListItemIcon: {
			root: {
				minWidth: 'initial'
			}
		},
		MuiListItemText: {
			root: {
				fontSize: '18px'
			}
		},
		MuiInput: {
			root: {
				backgroundColor: baseDark,
				borderRadius: '50px',
				border: '1px solid #384656',
				boxSizing: 'border-box',
				color: white,
				fontSize: '14px',
				height: '44px',
				lineHeight: '21px',
				paddingLeft: '16px',
				'&$error': {
					backgroundColor: 'rgba(255, 46, 99, 0.09)',
					border: `1px solid ${error}`,
					color: error,
					marginBottom: '8px'
				},
				'&$focused': {
					'&$focused:not($error):not($disabled)': {
						border: `1px solid ${primary}`,
						boxShadow: `0 0 3px 1px ${primary}`
					}
				},
				'&$disabled': {
					color: '#93B0C1',
					opacity: 0.5
				}
			},
			formControl: {
				marginTop: 0,
				label: {
					marginTop: '16px'
				}
			},
			underline: {
				'&:hover:not($disabled):not($focused):not($error):before': {
					borderBottom: '0'
				},
				'&:hover:not($disabled):not($focused):not($error):after': {
					borderBottom: '0'
				},
				'&:hover:not($disabled):before': {
					borderBottom: '0'
				},
				'&:after': {
					borderBottom: '0'
				},
				'&:before': {
					borderBottom: '0'
				}
			}
		},
		MuiInputBase: {
			input: {
				'&::placeholder': {
					color: grey,
					opacity: 1
				}
			},
			multiline: {
				overflow: 'scroll'
			}
		},
		MuiInputLabel: {
			filled: {
				marginTop: '5px'
			}
		},
		MuiInputAdornment: {
			positionEnd: {
				marginLeft: '151px',
				position: 'absolute'
			}
		},
		MuiSvgIcon: {
			root: {
				color: '#93B0C1',
				fontSize: '1.5rem',
				transition: 'all 0.2s ease-out',
				'&:hover': {
					color: white
				},
				'&:focus': {
					color: primary
				},
				'&:checked': {
					color: primary
				}
			},
			fontSizeSmall: {
				fontSize: 16
			}
		},
		MuiCheckbox: {
			root: {
				borderRadius: '3px',
				color: grey,
				height: '18px',
				marginRight: '10px',
				padding: 0,
				width: '18px',
				'& svg': {
					color: 'inherit',
					height: '22px',
					width: '22px',
					'&:hover': {
						color: 'inherit'
					}
				},
				'&$checked:not($disabled):not($colorPrimary)': {
					backgroundColor: `${primary} !important`,
					border: `1px solid ${primary} !important`,
					color: `${baseDark} !important`
				},
				'&$checked:not($disabled)': {
					backgroundColor: `${error} !important`,
					border: `1px solid ${error} !important`,
					color: `#392E3C !important`
				},
				'&$checked': {
					backgroundColor: `#384656 !important`,
					border: `1px solid #2F3B48 !important`,
					color: `${baseDark} !important`
				},
				'&$disabled:not($checked)': {
					color: 'transparent !important'
				},
				'&$disabled': {
					backgroundColor: '#222B34',
					border: '1px solid #2F3B48',
					borderRadius: '3px',
					color: 'transparent',
					height: '18px',
					padding: 0,
					width: '18px'
				},
				'&:hover': {
					backgroundColor: '#384656'
				}
			},
			colorSecondary: {
				backgroundColor: baseDark,
				border: `1px solid ${grey}`,
				borderRadius: '3px',
				color: 'transparent',
				height: '18px',
				padding: 0,
				width: '18px'
			},
			colorPrimary: {
				backgroundColor: 'rgba(255, 46, 99, 0.09)',
				border: `1px solid ${error}`,
				borderRadius: '3px',
				color: 'transparent',
				height: '18px',
				padding: 0,
				width: '18px',
				'&:hover': {
					backgroundColor: 'rgba(255, 46, 99, 0.05)'
				}
			}
		},
		MuiRadio: {
			root: {
				borderRadius: '50%',
				boxSizing: 'border-box',
				color: grey,
				height: '18px',
				marginRight: '10px',
				padding: 0,
				width: '18px',
				'& svg': {
					color: 'inherit',
					'&:hover': {
						color: 'inherit'
					}
				},
				'&$checked:not($disabled):not($colorPrimary)': {
					backgroundColor: `#1e262d !important`,
					border: `1px solid ${primary} !important`,
					color: `${primary} !important`
				},
				'&$checked:not($disabled)': {
					backgroundColor: `#392E3C !important`,
					border: `1px solid ${error} !important`,
					color: `${error} !important`
				},
				'&$checked': {
					backgroundColor: `${baseDark} !important`,
					border: `1px solid ${baseDark} !important`,
					color: `#35424e !important`
				},
				'&$disabled:not($checked)': {
					color: 'transparent !important'
				},
				'&$disabled': {
					backgroundColor: '#222B34',
					border: '1px solid #2F3B48',
					borderRadius: '50%',
					color: 'transparent',
					height: '18px',
					padding: 0,
					width: '18px'
				},
				'&:hover': {
					backgroundColor: '#384656'
				}
			},
			colorSecondary: {
				backgroundColor: baseDark,
				border: `1px solid ${grey}`,
				borderRadius: '50%',
				color: 'transparent',
				height: '18px',
				padding: 0,
				width: '18px'
			},
			colorPrimary: {
				backgroundColor: 'rgba(255, 46, 99, 0.09)',
				border: `1px solid ${error}`,
				borderRadius: '50%',
				color: 'transparent',
				height: '18px',
				padding: 0,
				width: '18px',
				'&:hover': {
					backgroundColor: 'rgba(255, 46, 99, 0.05)'
				}
			}
		},
		MuiSelect: {
			root: {
				borderRadius: '4px',
				lineHeight: 'initial',
				'& option': {
					backgroundColor: `${baseDark} !important`,
					border: `1px solid ${baseDark} !important`,
					color: `#FFFFFF !important`
				}
			},
			icon: {
				color: 'rgba(147, 176, 193, 0.5)'
			},
			selectMenu: {
				color: white,
				fontSize: '14px',
				lineHeight: '21px'
			},
			iconFilled: {
				right: '15px'
			},
			filled: {
				paddingRight: '47px !important'
			}
		},
		MuiMenu: {
			paper: {
				border: `1px solid ${primary}`,
				boxShadow: `0 0 3px 1px ${primary}`,
				marginLeft: '-17px',
				marginTop: '-6px',
				maxHeight: '300px',
				overflowY: 'auto'
			}
		},
		MuiPaper: {
			root: {
				backgroundColor: baseDark,
				border: '1px solid #384656',
				boxShadow: 'none',
				boxSizing: 'border-box',
				color: white,
				minWidth: '200px',
				top: '535px',
				left: '31px'
			}
		},
		MuiMenuItem: {
			root: {
				borderRadius: '4px',
				fontSize: '14px',
				lineHeight: '14px'
			}
		},
		MuiFormGroup: {
			root: {
				backgroundColor: base,
				marginBottom: '16px'
			}
		},
		MuiFormControl: {
			root: {
				minWidth: '200px'
			}
		},
		MuiFormControlLabel: {
			root: {
				marginBottom: '15px',
				marginLeft: 0
			},
			label: {
				color: typography,
				fontSize: '16px',
				lineHeight: '24px'
			}
		},
		MuiFormLabel: {
			root: {
				display: 'block',
				fontSize: '14px',
				lineHeight: '21px',
				'$&focused': {
					display: 'none'
				}
			}
		},
		MuiButton: {
			root: {
				borderRadius: '4px',
				boxSizing: 'border-box',
				color: white,
				fontSize: '13px',
				fontWeight: 600,
				height: '36px',
				letterSpacing: '0.6px',
				lineHeight: '16px',
				minWidth: '120px',
				padding: '8px 16px',
				'&$disabled': {
					color: white,
					opacity: 0.5
				}
			},
			contained: {
				background: 'linear-gradient(to bottom, #2DA1F8 0%, #00E0FF 100%)',
				border: '1px solid #0FB8D0',
				boxShadow: 'none',
				borderRadius: '50px',
				color: '#111111',
				padding: '8px 16px',
				'&:hover': {
					background: 'linear-gradient(to bottom, #0AA9D0 0%, #099BBA 100%)'
				},
				'&:focus': {
					background: 'linear-gradient(to top right, #0A99D0 10%, #097CBA 70%);'
				},
				'&$disabled': {
					color: white
				}
			},
			containedSizeLarge: {
				padding: '8px 24px'
			},
			outlined: {
				background: 'transparent',
				border: '2px solid #1CA9BA',
				borderColor: 'linear-gradient(to bottom, #2DA1F8 0%, #00E0FF 100%)',
				color: '#fff',
				borderRadius: '50px',
				padding: '8px 16px',
				'&:hover': {
					background: '#313D49',
					borderColor: '#23E6FE'
				},
				'&:focus': {
					background: '#1E262E'
				},
				'&$disabled': {
					color: primary,
					border: '2px solid #1CA9BA'
				}
			},
			outlinedSizeLarge: {
				padding: '8px 24px'
			},
			outlinedSecondary: {
				background: 'transparent',
				border: `1px solid ${typography}`,
				color: typography,
				'&:hover': {
					backgroundColor: '#313D49',
					border: `1px solid ${typography}`
				},
				'&:focus': {
					background: baseDark
				},
				'&$disabled': {
					border: `1px solid ${typography}`,
					color: typography
				}
			},
			sizeLarge: {
				fontSize: '16px',
				height: '44px',
				lineHeight: '19px'
			},
			sizeSmall: {
				fontSize: '12px',
				fontWeight: 400,
				height: '26px',
				lineHeight: '15px',
				minHeight: '26px',
				minWidth: '50px',
				padding: '0 10px'
			},
			text: {
				color: primary,
				fontSize: '14px',
				fontWeight: 400,
				letterSpacing: 'initial',
				lineHeight: '17px',
				textTransform: 'initial',
				'&:hover': {
					backgroundColor: 'transparent',
					color: primaryTint,
					textDecoration: 'underline'
				}
			}
		},
		MuiIconButton: {
			root: {
				color: grey,
				padding: '8px',
				'&:hover': {
					backgroundColor: 'transparent'
				},
				'&$disabled': {
					color: grey
				}
			}
		},
		MuiTableRow: {
			root: {
				'&:nth-of-type(odd)': {
					backgroundColor: '#2E3945'
				}
			}
		},
		MuiTableCell: {
			root: {
				borderBottom: 0,
				padding: '16px 24px',
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				textOverflow: 'ellipsis'
			},
			head: {
				backgroundColor: baseDark,
				borderBottom: 0
			},
			body: {
				boxSizing: 'border-box',
				minHeight: '74px'
			},
			footer: {
				color: warning
			}
		},
		MuiTooltip: {
			tooltip: {
				backgroundColor: '#1F2830',
				border: '1px solid #43505B',
				borderRadius: '3px'
			}
		},
		MuiTabs: {
			root: {
				borderBottom: `1px solid ${grey}`
			},
			indicator: {
				backgroundColor: primary,
				height: '4px',
				marginLeft: 0
			}
		},
		MuiTab: {
			// label: {
			// 	fontSize: '16px',
			// 	lineHeight: '19px',
			// },
			root: {
				borderBottom: `4px solid transparent`,
				textTransform: 'initial',
				minWidth: '0 !important',
				padding: '8px 16px',
				'&:hover': {
					borderBottom: `4px solid ${grey}`,
					boxSizing: 'border-box',
					color: white
				},
				'&$selected': {
					color: white
				}
			},
			textColorInherit: {
				color: typography
			},
			wrapper: {
				width: 'initial'
			}
			// labelContainer: {
			// 	padding: '6px 15px !important',
			// },
		},
		MuiExpansionPanel: {
			root: {
				backgroundColor: base,
				borderRadius: '4px',
				boxShadow: 'none',
				position: 'initial',
				'&$expanded': {
					margin: '0 0 16px'
				}
			}
		},
		MuiExpansionPanelSummary: {
			content: {
				alignItems: 'baseline',
				flexDirection: 'row',
				justifyContent: 'space-between',
				paddingLeft: '32px',
				'&$expanded': {
					margin: '24px 0'
				}
			},
			expandIcon: {
				color: typography,
				left: '18px',
				padding: '0',
				position: 'absolute',
				right: 'initial',
				top: '50%',
				transform: 'translateY(-50%) rotate(-90deg)',
				transformOrigin: '50%',
				'&$expanded': {
					transform: 'translateY(-50%) rotate(0deg)'
				}
			}
		},
		MuiDivider: {
			root: {
				backgroundColor: '#303C49',
				height: '1px',
				width: '100%'
			}
		},
		MuiLinearProgress: {
			root: {
				backgroundColor: '#414F63',
				borderRadius: '10px',
				height: '4px',
				marginBottom: '15px',
				marginTop: '10px',
				width: '235px'
			},
			colorPrimary: {
				backgroundColor: '#414F63'
			},
			barColorPrimary: {
				background: 'linear-gradient(to right, #2DA1F8 0%, #08BCCD 20%)'
			}
		},
		MuiTablePagination: {
			actions: {},
			select: {
				backgroundColor: base,
				border: '1px solid #313D49',
				borderRadius: 0,
				paddingLeft: '12px',
				paddingRight: '30px',
				textAlignLast: 'left'
			},
			selectIcon: {
				color: primary,
				right: '5px',
				top: '6px'
			}
		},
		MuiBackdrop: {
			root: {
				background: '#111111',
				opacity: '0.9 !important'
			},
			invisible: {
				background: 'transparent',
				backgroundColor: 'transparent'
			}
		},
		// @ts-ignore
		MuiModal: {
			root: {
				height: '100%',
				overflow: 'auto'
			}
		},
		MuiToggleButtonGroup: {
			grouped: {
				'&:not(:first-child)': {
					marginLeft: 0
				},
				padding: '0 24px !important'
			},
			root: {
				backgroundColor: 'transparent',
				boxShadow: 'none',
				'&$selected': {
					backgroundColor: 'transparent',
					boxShadow: 'none'
				}
			}
		},
		MuiToggleButton: {
			root: {
				backgroundColor: '#293743',
				border: '1px solid #1D505F',
				borderRadius: '4px',
				boxSizing: 'border-box',
				fill: typography,
				height: '44px',
				minWidth: '48px',
				textTransform: 'initial',
				'&:hover': {
					backgroundColor: 'rgba(255, 255, 255, 0.12)',
					border: `1px solid ${primaryTint} !important`
				},
				'&$selected': {
					background: '#313D49',
					fill: primary,
					color: primary,
					border: `1px solid ${primaryTint} !important`
				},
				'&$disabled': {
					opacity: 0.5
				}
			}
		},
		MuiSlider: {
			root: {
				margin: 0
			},
			track: {
				borderRadius: '6px',
				height: '10px'
			},
			rail: {
				backgroundColor: '#313D49',
				borderRadius: '10px',
				height: '10px',
				opacity: 1
			},
			thumb: {
				height: '18px',
				width: '18px'
			}
		},
		MuiDrawer: {
			paperAnchorRight: {
				backgroundColor: '#131F2A',
				borderLeft: '1px solid #29333D',
				boxShadow: 'none'
			}
		},
		MuiAvatar: {
			root: {
				fontSize: '12px',
				height: '26px',
				marginTop: '35px',
				width: '26px'
			},
			colorDefault: {
				backgroundColor: baseLight
			}
		}
	}
});

export const SelfkeyDarkTheme = ({ children }) => {
	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</MuiThemeProvider>
	);
};

export default SelfkeyDarkTheme;
