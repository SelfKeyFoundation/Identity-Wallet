import React from 'react';

class CustomFileField extends React.Component {
	constructor(props) {
		super(props);
		this.state = { ...this.state, formData: props.formData };
	}

	onChange() {
		return event => {
			const files = event.target.files;
			const f = files[0];
			const data = {
				mimeType: f.type,
				name: f.name,
				size: f.size,
				file: f,
				content: ''
			};
			// eslint-disable-next-line
			const reader = new FileReader();
			reader.readAsDataURL(f);
			reader.onload = () => {
				data.content = reader.result;
				this.setState(data, () => this.props.onChange(data));
			};
		};
	}

	render() {
		const { onBlur, onFocus } = this.props;
		return (
			<div>
				<input
					type="file"
					required={this.props.required}
					onChange={this.onChange()}
					onBlur={onBlur && (event => onBlur(this.state))}
					onFocus={onFocus && (event => onFocus(this.state))}
				/>
			</div>
		);
	}
}

export default CustomFileField;
