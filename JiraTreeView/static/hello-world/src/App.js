import React, { useEffect, useState } from 'react';
import { TreeList, Column, RowDragging, ColumnChooser, Editing, RequiredRule, Lookup, Button, } 
from 'devextreme-react/tree-list';
import { Button } from 'devextreme-react/button';
import { LoadIndicator } from 'devextreme-react/load-indicator';
import { getIssueData } from "./data/ManageData";

function App() {

    const projects = "OEM";
    const issueLinkType = {
        id: "10008",
        name: "Track/Contributes",
        inward: "Contributes To",
        outward: "Tracks"
    };
    const [dataSource, setDataSource] = useState(null);
    const [searchButton, setsearchButton] = useState({
        loadIndicatorVisible: false,
        buttonText: 'Search',
    });

    const issuestype = [
      'Story',
      'Bug',
      'Task',
      'SubTask',
      'Bug Fix Steps',
    ];

    const handleClickSearch = async () => {
        setsearchButton({
            loadIndicatorVisible: true,
            buttonText: 'Searching',
        });
        let response = await getIssueData(projects, issueLinkType, "");
        setsearchButton({
            loadIndicatorVisible: false,
            buttonText: 'Search',
        });
        setDataSource(response.result);
    };

    const handleRowExpanding = (e) => {
        console.log(e);
    }
    const mode ='select';
    const allowSearch = true;

    addRow = async (e) => {
      console.log("1 inside addRow: ",e.data.Summary);
      console.log("1.5 inside addRow: ",e.data.Issue_Type);
      let body = {
        fields: {
          summary: e.data.Summary,
          project: {
            key: "OEM",
          },
          issuetype: {
            name: e.data.Issue_Type,
          },
          assignee: {
            name: "Abhishek Srivastava",
          },
          "customfield_10042": "https://google.com",
          "customfield_10034": 8
        }
      };
  
      let body1 = JSON.stringify(body);
      console.log("2 inside addRow: ",JSON.stringify(body));
      const response = await requestJira('/rest/api/3/issue', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: body1
      })
    console.log(`Response: ${response.status} ${response.statusText}`);
    }

    return (
        <div>
            <div>
                <Button type="success" onClick={handleClickSearch} >
                    <LoadIndicator className="button-indicator" height={20} width={20} visible={searchButton.loadIndicatorVisible} />
                    <span className="dx-button-text">{searchButton.buttonText}</span>
                </Button>
            </div>
            <div>
                <TreeList
                    id="treeIssues"
                    dataSource={dataSource}
                    showRowLines={true}
                    showBorders={true}
                    columnAutoWidth={true}
                    rootValue={-1}
                    keyExpr="id"
                    parentIdExpr="parentId"
                    hasItemsExpr="hasChildren"
                    itemsExpr="childIssues"
                    dataStructure="tree"
                    onRowExpanding={handleRowExpanding}
                    onRowInserted={addRow}
                >

                  <Editing
                      allowUpdating={true}
                      allowDeleting={true}
                      allowAdding={true}
                      mode="row" 
                  />
                    <Column allowHiding={false} dataField="Key"></Column>
                    <Column allowHiding={false} dataField="Summary"><RequiredRule /></Column>
                    <Column allowHiding={false} dataField="Assignee"><RequiredRule /></Column>
                    <Column dataField="Status"></Column>
                    <Column dataField="Estimated Efforts"></Column>
                    <Column allowHiding={false} dataField="IssueType"> <RequiredRule /> <Lookup dataSource={issuestype} /></Column>
                    <ColumnChooser enabled={true} allowSearch={allowSearch} mode={mode} />
                </TreeList>
            </div>
        </div>
    );
}

export default App;
