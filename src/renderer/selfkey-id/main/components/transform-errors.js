export default errors => {
	return errors.map(error => {
		if (error.name === 'pattern') {
			error.message = 'Invalid format';
		}
		if (error.message === 'should be string') {
			error.message = 'This field is required';
		}
		return error;
	});
};
