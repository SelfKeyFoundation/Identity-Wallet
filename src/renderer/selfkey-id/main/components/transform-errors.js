export default errors => {
	return errors.map(error => {
		if (error.name === 'pattern') {
			error.message = 'Invalid format';
		}
		if (
			error.message === 'should be string' ||
			error.message === 'should NOT have fewer than 1 items' ||
			error.message === 'is a required property'
		) {
			error.message = 'This field is required';
		}
		if (error.name === 'format' && error.message === 'should match format "email"') {
			error.message = 'Email provided is invalid';
		}
		return error;
	});
};
