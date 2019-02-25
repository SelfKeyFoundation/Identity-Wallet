export default errors => {
	return errors.map(error => {
		if (error.name === 'pattern') {
			error.message = '';
		}
		return error;
	});
};
