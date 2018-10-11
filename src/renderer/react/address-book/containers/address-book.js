import React from 'react';
import { connect } from 'react-redux';

const AddressBook = props => {
	return (
		<table>
			<thead>
				<td>Label</td>
				<td>Address</td>
			</thead>
			<tbody>
				<tr>
					<td>Test</td>
					<td>Test</td>
				</tr>
			</tbody>
		</table>
	);
};

const mapStateToProps = (state, props) => {
	return {};
};

export default connect(mapStateToProps)(AddressBook);
