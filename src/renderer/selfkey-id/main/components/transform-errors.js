export default errors => {
	console.log('XXX errors', errors);
	return errors.map(error => {
		if (error.name === 'pattern') {
			error.message = '';
		}
		if (error.message === 'should be string') {
			error.message = 'This field is required';
		}
		return error;
	});
};
