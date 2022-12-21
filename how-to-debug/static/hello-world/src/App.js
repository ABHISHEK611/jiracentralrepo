import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';

function App() {
    console.log("show your app");

    function handleClick() {
        debugger;
        console.log("show your variable");
    };

    return (
        <div>
            <button cssClass='e-info' onClick={handleClick}>Trigger</button>
        </div>
    );
}

export default App;
