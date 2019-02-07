import React from 'react';
import 'flag-icon-css/css/flag-icon.css';

const FlagCountryName = props => (
	<div style={{ display: 'block' }}>
		<span
			style={{ width: '40px', display: 'block', fontSize: '30px' }}
			className={`flag-icon flag-icon-${props.code ? props.code.toLowerCase() : 'gr'}`}
		/>
		<span>{props.name}</span>
	</div>
);

export default FlagCountryName;
