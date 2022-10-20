/*import logo from './logo.svg';
import './App.css';
import React from 'react'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
export default App;*/
//---------------------------------------------------------------------
/*import * as React from 'react';
import * as ReactDOM from 'react-dom';

import OrgTreeComponent, { useTree } from 'react-drag-hierarchy-tree';

const data = {
  id: 1,
  label: "President",
  children: [
    {
      id: 2,
      label: "Administrative",
      children: [
        {
          id: 3,
          label: "Director",
          children: [],
        },
      ],
    },
    {
      id: 4,
      label: "Finances",
      children: [
        {
          id: 5,
          label: "Seller",
          children: [],
        },
      ],
    },
    {
      id: 6,
      label: "Student",
      children: [
        {id: 7,
        label: "Class A",
        children: [
          {id: 8,
            label: "Class A1",
            children: [],}
        ],
        },
        {id: 9,
          label: "Class B",
          children: []
        ,}
      ]
    }
  ],
};

const App = () => {
  const { treeRef } = useTree();

  const onClick = () => {
    treeRef.current?.onExpandNodes();
  };

  return (
    <div>
      <button onClick={onClick}>close/open</button>
      <OrgTreeComponent data={data} ref={treeRef} vertical />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
export default App; */
//----------------------------------------------------------------------

import React, { useState } from "react";
const treeData = [
  {
    id: "1",
    label: "Issue 1",
    children: [
      {
        id: "1-1",
        label: "Issue 1-1",
        children: [
          {
            id: "1-1-1",
            label: "Issue 1-1-1",
          },
          {
            id: "1-1-2",
            label: "Issue 1-1-2",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    label: "Issue 2",
    children: [
      {
        id: "2-1",
        label: "Issue 2-1",
      },
      {
        id: "2-2",
        label: "Issue 2-2",
      },
    ],
  },
  {
    id: "3",
    label: "Issue 3",
    children: [],
  },
];


function App() {
  return (
    <div className="App">
      <h1>Tree View Demo</h1>
      <Tree treeData={treeData} />
    </div>
  );
}

function Tree({ treeData }) {
  return (
    <ul>
      {treeData.map((node) => (
        <TreeNode node={node} key={node.id} />
      ))}
    </ul>
  );
}
function TreeNode({ node }) {
  const { children, label } = node;

  const [showChildren, setShowChildren] = useState(false);

  const handleClick = () => {
    setShowChildren(!showChildren);
  };
  return (
    <>
      <div onClick={handleClick} style={{ marginBottom: "10px" }}>
        <span>{label}</span>
      </div>
      <ul style={{ paddingLeft: "10px", borderLeft: "1px solid black" }}>
        {showChildren && <Tree treeData={children} />}
      </ul>
    </>
  );
}
export default App;