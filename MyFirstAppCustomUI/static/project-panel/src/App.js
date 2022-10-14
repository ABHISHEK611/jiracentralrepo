import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';
import Button from '@atlaskit/button';


function App() {		
    
	const [data, setData] = useState(null);
	
	useEffect(() => {
        invoke('getProjectOverview', { example: 'my-invoke-variable' }).then(setData);
    }, []);

    return (
        <div>
			<h1>This is project overview</h1>
            {data ? data : 'Give it a minute...'}
        </div>
    );
		
}

export default App;
