import React, { useEffect, useState } from 'react';
import { TreeList, RemoteOperations, Editing, Button as CellButton, Column, ColumnChooser, RowDragging } from 'devextreme-react/tree-list';
import { Button } from 'devextreme-react/button';
import { LoadIndicator } from 'devextreme-react/load-indicator';
import { Template } from 'devextreme-react/core/template';
import SelectBox from 'devextreme-react/select-box';
import { getIssueData, getAllProject, getIssueLinkType } from "./data/ManageData";
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

    const onRowInserting = async (e) => { // we have option to cancel insert when cannot create new issue via API
        
        console.log("Inside Adding");
        console.log("0 inside onRowInserting: ",e);
        let body;
        if(e.data.issueType === "Story"){
          body = {
            fields: {
              summary: e.data.summary,
              project: {
                key: "OEM",
              },
              issuetype: {
                name: e.data.issueType,
              },
              "customfield_10042": "https://google.com",
              "customfield_10034": 8,
              "customfield_10028": e.data.storyPoint
            }
          };
        }
        else
        {
          body = {
            fields: {
              summary: e.data.summary,
              project: {
                key: "OEM",
              },
              issuetype: {
                name: e.data.issueType,
              },
              "customfield_10042": "https://google.com",
              "customfield_10034": 8
            }
          };
        }

        let body1 = JSON.stringify(body);
        console.log("1 inside onRowInserting: ",JSON.stringify(body));
        const response = await requestJira('/rest/api/3/issue', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: body1
        })
      const data  = await response.json();
      console.log("2 inside onRowInserting: ",JSON.stringify(data));
      console.log("3 inside onRowInserting: ",data);
      notify("The selected issue is added successfully");
      let finalResponse = await getIssueData(projectSelected.name, issueLinkSelected, issueKey);
      console.log("4 inside onRowInserting: ",JSON.stringify(finalResponse));
      setDataSource(finalResponse.result);
    }

    const onRowUpdating = async (e) => 
    {
        console.log("Inside Editing");
        console.log("0 inside onRowUpdating: ",e);
        let body;
        let item = 
        {
            issueType: e.newData.hasOwnProperty("issueType") ? e.newData.issueType : e.oldData.issueType,
            summary: e.newData.hasOwnProperty("summary") ? e.newData.summary : e.oldData.summary,
            storyPoint: e.newData.hasOwnProperty("storyPoint") ? e.newData.storyPoint : e.oldData.storyPoint,
        }
        console.log("0.5 inside onRowUpdating: ",item);
        if(item.issueType === "Story")
        {
          body = {
            fields: {
              summary: item.summary,
              project: {
                key: "OEM",
              },
              issuetype: {
                name: item.issueType,
              },
              "customfield_10042": "https://google.com",
              "customfield_10034": 8,
              "customfield_10028": item.storyPoint
            }
          };
        }
        else
        {
          body = {
            fields: {
              summary: item.summary,
              project: {
                key: "OEM",
              },
              issuetype: {
                name: item.issueType,
              },
              "customfield_10042": "https://google.com",
              "customfield_10034": 8
            }
          };
        }

        let body1 = JSON.stringify(body);
        console.log("1 inside onRowUpdating: ",JSON.stringify(body));
        const response = await requestJira(`/rest/api/2/issue/${e.oldData.id}`, {
            method: 'PUT',
            headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: body1
            })
        console.log(`Response: ${response.status} ${response.statusText}`);
        const data  = await response.json();
        console.log("1.5 inside onRowUpdating: ",JSON.stringify(data));
        console.log("2 inside onRowUpdating: ",data);
        notify("The selected issue is edited successfully");
        let finalResponse = await getIssueData(projectSelected.name, issueLinkSelected, issueKey);
        setDataSource(finalResponse.result);
    }

    const onInitNewRow = (e) => {
        console.log("onInitNewRow")
        console.log(e);
    }

    const deleteIssueLink = async (issueLinkID) => {
      console.log("1 inside deleteIssueLink",issueLinkID);
      const response = await requestJira(`/rest/api/3/issueLink/${issueLinkID}`, {
          method: 'DELETE',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
      });
      console.log(`Response: ${response.status} ${response.statusText}`);
      console.log(await response.text());
  }

    const updateIssueLink = async (sourceData, targetData) => {
  
      console.log("1 inside updateIssueLink",sourceData);
      console.log("2 inside updateIssueLink",targetData);
      const response = await requestJira(`/rest/api/2/issue/${sourceData.id}?fields=issuelinks`);
      console.log("3 inside updateIssueLink",JSON.stringify(response));
      const data = await response.json()
      console.log("4 inside updateIssueLink",data);
      const oldIssueLinksChild = await data.fields.issuelinks
      console.log("5 inside updateIssueLink",oldIssueLinksChild);
      const oldIssueLink = await oldIssueLinksChild.find(
              element =>
              (element.inwardIssue.id === targetData.id));
      //delete old issue link
      console.log("6 inside updateIssueLink",oldIssueLink);
      deleteIssueLink(oldIssueLink.id)
      
      //add new link issue
      const responseLink = await requestJira(`/rest/api/2/issue/${targetData.parentId}`);
      console.log("7 inside updateIssueLink",responseLink);
      const dataLink = await responseLink.json();
      console.log("8 inside updateIssueLink",dataLink);
      savingDragandDrop(sourceData.key, dataLink.key);
  }

  const savingDragandDrop = async (source, target) => {
   
    console.log("0 inside savingDragandDrop",source);
    console.log("1 inside savingDragandDrop",target);
  
    let body = {
      "outwardIssue": {
          "key": target
      },
      "inwardIssue": {
          "key": source
      },
      "type": {
          "name": issueLinkSelected.name
      }
  }
  console.log("4 inside savingDragandDrop",JSON.stringify(body));
  try{
    const response = await requestJira(`/rest/api/3/issueLink`, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
     })
    console.log(JSON.stringify(response));
  }catch(err)
  {
    console.log("Error ",JSON.stringify(err));
  }
  let finalResponse = await getIssueData(projectSelected.name, issueLinkSelected, issueKey);
  setDataSource(finalResponse.result);
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
      console.log("0 inside onReorder",e);
      let visibleRows = e.component.getVisibleRows(),
        sourceData = e.itemData,
        targetData = visibleRows[e.toIndex].data;
  
      console.log("1 inside onReorder visible rows: ",visibleRows);
      console.log("2 inside onReorder source: ",sourceData);
      console.log("3 inside onReorder target: ",targetData);

      if (e.dropInsideItem) {
        console.log("7 inside onReorder inside if:");
        if(sourceData.parentId !== -1)
        {
          console.log("7.1 inside onReorder inside if inside if:");
          const response = await requestJira(`/rest/api/2/issue/${sourceData.id}?fields=issuelinks`);
          const data = await response.json()
          const oldIssueLinksChild = await data.fields.issuelinks
          const oldIssueLink = await oldIssueLinksChild.find(
                    element =>
                    (element.inwardIssue.id === sourceData.parentId));
          deleteIssueLink(oldIssueLink.id)
          savingDragandDrop(sourceData.key, targetData.key);
        }
        else{
          console.log("7.2 inside onReorder inside if inside else:");
          savingDragandDrop(sourceData.key, targetData.key);
        }
      }
      else {
        console.log("8 inside onReorder inside else:");
        if (sourceData.parentId !== targetData.parentId) 
        {
          console.log("9 inside onReorder inside else 1stif:");
          console.log("9.1 inside onReorder inside else 1stif:",sourceData);
          if(targetData.parentId !== -1)
          {
            console.log("10 inside onReorder inside else 2ndtif:");
            updateIssueLink(sourceData, targetData);
          }
          else
          {
            console.log("11 inside onReorder inside else 2ndelse:");
            const response = await requestJira(`/rest/api/2/issue/${sourceData.id}?fields=issuelinks`);
            const data = await response.json()
            const oldIssueLinksChild = await data.fields.issuelinks
            const oldIssueLink = await oldIssueLinksChild.find(
                    element =>
                    (element.outwardIssue.id === sourceData.parentId));
            deleteIssueLink(oldIssueLink.id)
          } 
        }
      }
      let finalResponse = await getIssueData(projectSelected.name, issueLinkSelected, issueKey);
      setDataSource(finalResponse.result);
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