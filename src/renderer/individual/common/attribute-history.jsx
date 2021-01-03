/**
 * NOT USED, FUTURE IMPROVEMENT
 */
import React from 'react';
import {
	CardHeader,
	Card,
	CardContent,
	Table,
	TableBody,
	TableRow,
	TableCell
} from '@material-ui/core';
import { GreenTickIcon } from 'selfkey-ui';

const AttributeHistory = ({ attributeHistory }) => (
	<Card>
		<CardHeader title="ID Wallet History" />
		<CardContent>
			<Table>
				<TableBody>
					{attributeHistory &&
						attributeHistory.map(entry => {
							return (
								<TableRow key={entry.id}>
									<TableCell>{entry.timestamp}</TableCell>
									<TableCell>
										<GreenTickIcon />
										{entry.action}
									</TableCell>
								</TableRow>
							);
						})}
				</TableBody>
			</Table>
		</CardContent>
	</Card>
);

export default AttributeHistory;
