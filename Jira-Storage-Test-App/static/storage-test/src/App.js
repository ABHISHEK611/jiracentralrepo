import React, { useEffect, useState, Fragment } from 'react';
import { invoke, router } from '@forge/bridge';

function App() {
    const [data1, setData1] = useState(null);

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
	</>
    );
}

export default App;
