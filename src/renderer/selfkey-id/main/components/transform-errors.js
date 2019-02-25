export default errors => {
	console.log('ERRORS', errors);
	return errors.map(error => {
		if (error.name === 'pattern') {
			error.message = '';
		}
		return error;
	});
};
