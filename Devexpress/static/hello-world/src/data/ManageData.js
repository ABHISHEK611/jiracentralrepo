import { requestJira } from "@forge/bridge";
import notify from 'devextreme/ui/notify';
import api, { route } from "@forge/api";

const data = async (projects, linkType, issueKey) => {
    // let listProject = projects.map(element => JSON.stringify(element.key))
    // const params = issueKey === "" ? `project in (${listProject}) AND (filter != ${linkType.id})` : `project in (${listProject}) AND (filter != ${linkType.id}) AND issue =${issueKey}`;
    console.log("inside data: ",projects, linkType, issueKey);
    const params = issueKey === "" ? `project = "${projects}" AND (filter != "${linkType.id}")` : `project = "${projects}" AND (filter != "${linkType.id}") AND issue =${issueKey}`;
    console.log("0 inside data: ", params);
    const response = await requestJira(`/rest/api/2/search?jql=${params}`);
    console.log("1 inside data: ", JSON.stringify(response));
    return await response.json();
};

export const getIssueData = async (projects, linkType, issueKey) => {
    const result = await data(projects, linkType, issueKey);
    if (result.errorMessages) {
        return {
            error: result.errorMessages
        };
    }
    let issues = [];
    await Promise.all(result.issues.map(async (element) => {
        let item = {
            id: element.id,
            key: element.key,
            summary: element.fields.summary,
            startdate: element.fields.customfield_10015, // depend on customfield was definded
            duedate: element.fields.duedate,
            assignee: element.fields.assignee ? element.fields.assignee.displayName : null,
            status: element.fields.status.name,
            storyPoint: element.fields.customfield_10028, // depend on customfield was definded
            issueType: element.fields.issuetype.name,
            blockers: getBlockersString(element),
            parentId: -1 // level 1 items
        }
        let children = await findChildByJql(projects, linkType, item); // find children of an item to set property for displaying expand icon
        item.hasChildren = children.length > 0;
        item.childIssues = children;

        issues.push(item)
    }))
    issues.sort((a, b) => b.id - a.id);
    return {
        result: issues // using dataSource need to put array in result
    };
}

export const findChildByJql = async (projects, linkType, issue) => {
    // let listProject = projects.map(element => JSON.stringify(element.key))
    // let jqlFindChildByID = `project in (${listProject}) and issue in linkedIssues("${issue.key}", ${linkType.outward})`
    let jqlFindChildByID = `project = "${projects}" and issue in linkedIssues("${issue.key}", "${linkType.outward}")`
    let url = `/rest/api/2/search?jql=${jqlFindChildByID}`
    const response = await requestJira(url);
    const data = await response.json();
    let listChildren = []
    await Promise.all(data.issues.map(async (element) => {
        let item = {
            id: element.id,
            key: element.key,
            summary: element.fields.summary,
            assignee: element.fields.assignee ? element.fields.assignee.displayName : null,
            status: element.fields.status.name,
            storyPoint: element.fields.customfield_10028, // depend on customfield was definded
            issueType: element.fields.issuetype.name,
            blockers: getBlockersString(element),
            parentId: issue.id
        }
        let children = await findChildByJql(projects, linkType, item); // find children of an item to set property for displaying expand icon
        item.isParent = children.length > 0;
        // item.childIssues = children;

        listChildren.push(item);
    }))
    return listChildren;
}

const getBlockersString = (issue) => {
    const INWARD_IS_BLOCKED_BY = "is blocked by";
    if (!issue.fields.issuelinks) return '';
    let blockerToView = [];
    issue.fields.issuelinks.forEach(link => {
        if (link.type.inward === INWARD_IS_BLOCKED_BY && link.inwardIssue) {
            if (!link.inwardIssue) return '';
            blockerToView.push(
                { key: link.inwardIssue.key }
            );
        }
    });
    return blockerToView;
}

export const getAllProject = async () => {
    const response = await requestJira(`/rest/api/2/project/search`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    let result = await response.json();
    return result.values;
};

export const getIssueLinkType = async (props) => {
    const response = await requestJira(`/rest/api/2/issueLinkType`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    let result = await response.json();
    return result.issueLinkTypes;
};

// const linkNewIssue = async (outwardKey, inwardKey, issueLinkType) => {
//     let body = {
//         "outwardIssue": {
//             "key": outwardKey
//         },
//         "inwardIssue": {
//             "key": inwardKey
//         },
//         "type": {
//             "name": issueLinkType.name
//         }
//     }
//     const response = await requestJira(`/rest/api/2/issueLink`, {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(body)
//     })
//     console.log(`Response: ${response.status} ${response.statusText}`);
//     console.log(await response.text());
// }

// export const updateIssueLink = async (newParentKey, oldParentID, childKey, issueLinkType) => {
//     if (oldParentID !== null) {
//         const response = await requestJira(`/rest/api/2/issue/${childKey}?fields=issuelinks`);
//         const data = await response.json()
//         const oldIssueLinksChild = await data.fields.issuelinks
//         const oldIssueLink = await oldIssueLinksChild.find(
//             element =>
//             (element.inwardIssue !== undefined &&
//                 element.type.id === issueLinkType.id &&
//                 element.inwardIssue.id === oldParentID));
//         //delete old issue link
//         deleteIssueLink(oldIssueLink.id)
//     }
//     //add new link issue
//     linkNewIssue(childKey, newParentKey, issueLinkType)
// }

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

const updateIssueLink = async (sourceData, targetData, issueLinkSelected) => {
  
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
    savingDragandDrop(sourceData.key, dataLink.key, issueLinkSelected);
}

const savingDragandDrop = async (source, target, issueLinkSelected) => {
   
    console.log("0 inside savingDragandDrop",source);
    console.log("1 inside savingDragandDrop",target);
  
    let body = {
      "outwardIssue": {
          "key": source
      },
      "inwardIssue": {
          "key": target
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
//   let finalResponse = await getIssueData(projectName, issueLinkSelected, issueKey);
//   setDataSource(finalResponse.result);
}

export const onAddRow = async (e, projectName, issueLinkSelected, issueKey) =>  {

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
  if(e.data.parentId !== -1)
      {
        console.log("4.5 inside dataLink: ",e.data.parentId);
        const responseLink = await requestJira(`/rest/api/2/issue/${e.data.parentId}`);
        console.log("5 responseLink: ",JSON.stringify(responseLink));
        const dataLink = await responseLink.json();
        console.log("5.5 dataLink in json:",dataLink);
        savingDragandDrop(data.key,dataLink.key,issueLinkSelected);
      }
  notify("The selected issue is added successfully");
  let finalResponse = await getIssueData(projectName, issueLinkSelected, issueKey);
  console.log("4 inside onRowInserting: ",JSON.stringify(finalResponse));
  return finalResponse.result;
  //setDataSource(finalResponse.result);
}

export const onUpdateRow = async (e, projectName, issueLinkSelected, issueKey) => {
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
        let finalResponse = await getIssueData(projectName, issueLinkSelected, issueKey);
        console.log("3 inside onRowUpdating: ",JSON.stringify(finalResponse));
        return finalResponse.result;
        //setDataSource(finalResponse.result);
}

export const onReorderData= async (e, projectName, issueLinkSelected, issueKey) => {
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
          savingDragandDrop(sourceData.key, targetData.key, issueLinkSelected);
        }
        else{
          console.log("7.2 inside onReorder inside if inside else:");
          savingDragandDrop(sourceData.key, targetData.key, issueLinkSelected);
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
            updateIssueLink(sourceData, targetData, issueLinkSelected);
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
      let finalResponse = await getIssueData(projectName, issueLinkSelected, issueKey);
      return finalResponse.result;
      //setDataSource(finalResponse.result);
}