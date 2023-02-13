import React, { useEffect, useState } from 'react';
import { TreeList, RemoteOperations, Editing, Button as CellButton, Column, ColumnChooser, RowDragging } from 'devextreme-react/tree-list';
import { Button } from 'devextreme-react/button';
import { LoadIndicator } from 'devextreme-react/load-indicator';
import { Template } from 'devextreme-react/core/template';
import SelectBox from 'devextreme-react/select-box';
import { getIssueData, getAllProject, getIssueLinkType, onAddRow, onUpdateRow, onReorderData } from "./data/ManageData";
import BlockerCell from "./component/BlockerCell";
import TextBox from 'devextreme-react/text-box';
import api, { route } from "@forge/api";
import { requestJira } from "@forge/bridge";
import notify from 'devextreme/ui/notify';

function App() {
    let [projectsDataSource, setProjectsDataSource] = useState([]);
    let [projectSelected, setProjectSelected] = useState(null);
    let [issueLinkDataSource, setissueLinkDataSource] = useState([]);
    let [issueLinkSelected, setIssueLinkSelected] = useState(null);
    let [issueKey, setIssueKey] = useState("");
    let [dataSource, setDataSource] = useState(null);
    const [searchButton, setsearchButton] = useState({
        loadIndicatorVisible: false,
        buttonText: 'Search',
    });

    useEffect(() => {
        (async () => {
            let projects = await getAllProject();
            let issueLinkTypes = await getIssueLinkType();
            setProjectsDataSource(projects);
            setissueLinkDataSource(
                issueLinkTypes.map((ele) => {
                    ele.text = `${ele.inward}\\${ele.outward}`;
                    return ele;
                })
            );
        })();
    }, []);

    const handleClickSearch = async () => {
        if (projectSelected === null || projectSelected.name === "") {
            alert("Please select project");
            return;
        }
        if (issueLinkSelected === null || issueLinkSelected === "") {
            alert("Please select link type of issue");
            return;
        }
        setsearchButton({
            loadIndicatorVisible: true,
            buttonText: 'Searching',
        });
        let response = await getIssueData(projectSelected.name, issueLinkSelected, issueKey);
        setsearchButton({
            loadIndicatorVisible: false,
            buttonText: 'Search',
        });
        console.log(response.result)
        setDataSource(response.result);
    };

    const handleClickReset = () => {
        setProjectSelected(null);
        setIssueLinkSelected(null);
        setIssueKey("");
    };

    const onProjectSelectedChanged = (e) => {
        setProjectSelected(e.value);
    };

    const onChangeLinkIssueType = (e) => {
        setIssueLinkSelected(e.value);
    };

    const onChangeIssueKey = (e) => {
        setIssueKey(e.value);
    }

    const onRowInserting = async (e) => 
    { // we have option to cancel insert when cannot create new issue via API 
      console.log("inside onRowInserting: ");
      let response = await onAddRow(e, projectSelected.name, issueLinkSelected, issueKey);
      setDataSource(response);
    }

    const onRowInserted = async () => 
    {
      console.log("inside onRowInserted: ");
      let response = await getIssueData(projectSelected.name, issueLinkSelected, issueKey);
      setDataSource(response.result);
    }

    const onRowUpdating = async (e) => 
    {
      console.log("inside onRowUpdating: ");
      let response = await onUpdateRow(e, projectSelected.name, issueLinkSelected, issueKey);
      setDataSource(response);
    }

    const onRowUpdated = async (e) => 
    {
      console.log("inside onRowUpdated: ");
      let response = await getIssueData(projectSelected.name, issueLinkSelected, issueKey);
      setDataSource(response.result);
    }

    const onInitNewRow = (e) => {
        console.log("onInitNewRow")
        console.log(e);
    }

    const onDragChange = async (e) => {
      console.log("0 inside onDragChange",e);
      let visibleRows = e.component.getVisibleRows(),
      sourceNode = e.component.getNodeByKey(e.itemData.id),
      targetNode = visibleRows[e.toIndex].node;

    console.log("1 inside onDragChange: ",visibleRows);
    console.log("2 inside onDragChange: ",sourceNode);
    console.log("3 inside onDragChange: ",targetNode);
    while (targetNode && targetNode.data) {
      if (targetNode.data.id === sourceNode.data.id) {
        e.cancel = true;
        break;
      }
      targetNode = targetNode.parent;
    }
  }
  
    const onReorder = async (e) => {
      let response = await onReorderData(e, projectSelected.name, issueLinkSelected, issueKey);
      setDataSource(response);
    }

    return (
        <div>
            <ul class="search-criteria-list">
                <li>
                    <SelectBox
                        value={projectSelected}
                        displayExpr="name"
                        searchEnabled={true}
                        searchMode={"contains"}
                        searchExpr={"name"}
                        searchTimeout={200}
                        minSearchLength={0}
                        showDataBeforeSearch={false}
                        dataSource={projectsDataSource}
                        labelMode={"floating"}
                        label='Select project'
                        onValueChanged={onProjectSelectedChanged}
                    />
                </li>
                <li>
                    <SelectBox
                        value={issueLinkSelected}
                        displayExpr="name"
                        dataSource={issueLinkDataSource}
                        labelMode={"floating"}
                        label='Select Issue Link Type'
                        onValueChanged={onChangeLinkIssueType}
                    />
                </li>
                <li>
                    <TextBox
                        value={issueKey}
                        showClearButton={true}
                        valueChangeEvent="keyup"
                        onValueChanged={onChangeIssueKey}
                        label="Issue key"
                        labelMode={"floating"} />
                </li>
                <li>
                    <Button type="default" stylingMode="contained" onClick={handleClickSearch} >
                        <LoadIndicator className="button-indicator" height={20} width={20} visible={searchButton.loadIndicatorVisible} />
                        <span className="dx-button-text">{searchButton.buttonText}</span>
                    </Button>
                </li>
                <li>
                    <Button text="Reset" type="default" stylingMode="contained" onClick={handleClickReset} />
                </li>
            </ul>
            <div>
                <TreeList
                    id="treeIssues"
                    dataSource={dataSource}
                    showRowLines={true}
                    showBorders={true}
                    columnAutoWidth={true}
                    allowColumnReordering={true}
                    rootValue={-1}
                    keyExpr="id"
                    parentIdExpr="parentId"
                    hasItemsExpr="hasChildren"
                    itemsExpr="childIssues"
                    dataStructure="tree"
                    onInitNewRow={onInitNewRow}
                    onRowInserting={onRowInserting}
                    onRowUpdating={onRowUpdating}
                    onRowInserted={onRowInserted}
                    onRowUpdated={onRowUpdated}
                >
                    {/* <RemoteOperations filtering={true} /> */}
                    <Editing
                        allowAdding={true}
                        allowUpdating={true}
                        mode="row"
                    />
                    
                    <RowDragging
                      onDragChange={onDragChange}
                      onReorder={onReorder}
                      allowDropInsideItem={true}
                      allowReordering={true}
                      showDragIcons={false}
                    />

                    <Column dataField="id" allowHiding={false} />
                    <Column dataField="key" allowHiding={false} />
                    <Column dataField="summary" />
                    <Column dataField="startdate" dataType="date" />
                    <Column dataField="duedate" dataType="date" />
                    <Column dataField="assignee" />
                    <Column dataField="status" />
                    <Column dataField="storyPoint" visible={false} /> {/* visible to defind column is displayed */}
                    <Column dataField="issueType" />
                    <Column dataField="blockers" visible={false} cellTemplate="blockerTemplate" /> {/* cellTemplate to custom displaying */}
                    <Column type="buttons">
                        <CellButton name="add" />
                        <CellButton name="edit" />
                        <CellButton name="save" />
                        <CellButton name="cancel" />
                    </Column>
                    <ColumnChooser enabled={true} allowSearch={true} mode={"select"} />
                    <Template name="blockerTemplate" render={BlockerCell} />

                </TreeList>
            </div>
        </div>
    );
}

export default App;