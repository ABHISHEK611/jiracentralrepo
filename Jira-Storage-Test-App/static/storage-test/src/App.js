import React, { useEffect, useState, Fragment } from 'react';
import { invoke, router } from '@forge/bridge';

function App() {
	const [data, setData] = useState(null);
    const [data1, setData1] = useState(null);

	 useEffect(() => {
        invoke('getProjectStory', { example: 'my-invoke-variable' }).then(setData);
    }, []);
	
	
    useEffect(() => {
        invoke('getStoryPoint', { example: 'my-invoke-variable' }).then(setData1);
    }, []);
	

    return (
	<>
        <div>
			{data1 ? data1.map(basicDetails =>(
			<p>Current username: {basicDetails.name} <br></br> Current user email-id: {basicDetails.email}</p>
			))
			: 'Loading...'}
        </div>
		
		<div>
			<table>
				<tr>
					<th>Issue Key</th>
					<th>Story Point</th>
				</tr>
			{data ? data.map(issue =>(
				<tr>
					<td>{issue.key}</td>
					<td>{issue.sp}</td>
				</tr>
			))
			: 'Loading...'}
			</table>
        </div>
	</>
    );
}

export default App;
