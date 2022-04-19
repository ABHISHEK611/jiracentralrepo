import React, { useEffect, useState, Fragment } from 'react';
import { invoke } from '@forge/bridge';

function App() {
    const [data, setData] = useState(null);
	const [data1, setData1] = useState(null);

    useEffect(() => {
        invoke('getProjectOverview', { example: 'my-invoke-variable' }).then(setData);
    }, []);
	
	 useEffect(() => {
        invoke('getTitle', { example: 'my-invoke-variable1' }).then(setData1);
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
			{data ? data.slice(0,1).map(total =>(
			<p>Total number of issue: {total.totalissues}</p>
			))
			: 'Loading...'}
        </div>
		
        <div>
			<table>
				<tr>
					<th>Project</th>
					<th>Issue Id</th>
					<th>Issue Key</th>
					<th>Summary</th>
				</tr>
			{data ? data.map(issue =>(
				<tr>
					<td>{issue.projectname}</td>
					<td><a target="_blank" href={issue.issuelink}>{issue.id}</a></td>
					<td>{issue.key}</td>
					<td>{issue.summary}</td>
				</tr>
			))
			: 'Loading...'}
			</table>
        </div>
		
		</>
    );
}

export default App;
