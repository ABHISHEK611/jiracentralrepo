import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Trees from './Trees';


class HelloWorld extends Component {
	render() {

		return (
			<React.Fragment>
				<CssBaseline />
				<Trees></Trees>
				<br></br>
				<Container maxWidth="sm">
					<Typography component="h1" variant="h3"
					align="center" gutterBottom>
						First React Code
					</Typography>
					<br />
					<Typography component="h3" variant="h3"
					align="center" gutterBottom>
						TreeView Component
					</Typography>
				</Container>
			</React.Fragment>

		);
	}
}

export default HelloWorld;
