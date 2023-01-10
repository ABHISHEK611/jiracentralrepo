import React, { useEffect, useState } from 'react';
import { TreeList, Column } from 'devextreme-react/tree-list';
import { Button } from 'devextreme-react/button';
import { LoadIndicator } from 'devextreme-react/load-indicator';
import { getIssueData } from "./data/ManageData";

function App() {

    const projects = "TEST";
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
                    onRowExpanding={handleRowExpanding}
                >

                    <Column dataField="key" />
                    <Column dataField="summary" />
                    <Column dataField="assignee" />
                    <Column dataField="status" />
                    <Column dataField="storyPoint" />
                    <Column dataField="issueType" />
                </TreeList>
            </div>
        </div>
    );
}

export default App;
