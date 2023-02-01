import React, { useEffect, useRef, useState }  from 'react';
import api, { route } from "@forge/api";
import notify from 'devextreme/ui/notify';
import { requestJira } from "@forge/bridge";


export const saveNewRow = async (e) =>
{
  if(!e.row.oldData)
  {
      console.log("0 inside saveNewRow add: ",e);
      //console.log("1 inside saveNewRow add: ",e.row.data.Summary);
      //console.log("1.5 inside saveNewRow add: ",e.row.data.Issue_Type);
      let body = {
        fields: {
          summary: e.row.data.Summary,
          project: {
            key: "OEM",
          },
          issuetype: {
            name: e.row.data.Issue_Type,
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
    const data  = await response.json();
    console.log("3 data in json:",JSON.stringify(data));
    console.log("4 data:",data);
    if(e.row.data.Head_ID != -1)
        {
            console.log("4.5 inside dataLink: ",e.row.data.Head_ID);
            const responseLink = await requestJira(`/rest/api/2/issue/${e.row.data.Head_ID}`);
            console.log("5 responseLink: ",JSON.stringify(responseLink));
            const dataLink = await responseLink.json();
            console.log("5.5 dataLink in json:",dataLink);
            savingDragandDrop(data.key,dataLink.key);
        }
    notify("The selected issue is added successfully");
    let finalResponse = await issues();
    setCurrentIssues(finalResponse.result);
  }
  else
  {
    console.log("0 inside saveNewRow edit: ",e);
    let body = {
      fields: {
        summary: e.row.data.Summary,
        project: {
          key: "OEM",
        },
        issuetype: {
          name: e.row.data.Issue_Type,
        },
        assignee: {
          name: "ABHISHEK SRIVASTAVA",
        },
        "customfield_10042": "https://google.com",
        "customfield_10034": 8
      }
    };

    let body1 = JSON.stringify(body);
      console.log("1 inside saveNewRow edit: ",JSON.stringify(body));
      const response = await requestJira(`/rest/api/2/issue/${e.row.data.ID}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: body1
      })
      console.log(`Response: ${response.status} ${response.statusText}`);
      console.log(await response.json());
      let finalResponse = await issues();
      setCurrentIssues(finalResponse.result);
      notify("The selected issue is edited successfully");
  }
}

export const savingDragandDrop = async (source, target) => {
  console.log("inside savingDragandDrop",currentIssues);
  console.log("0 inside savingDragandDrop",source);
  console.log("1 inside savingDragandDrop",target);
  //console.log("2 inside savingDragandDrop",source.Issue_Key);
  //console.log("3 inside savingDragandDrop",target.Issue_Key);
  let body = {
    "outwardIssue": {
        "key": target
    },
    "inwardIssue": {
        "key": source
    },
    "type": {
        "name": "Blocks"
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
  //console.log(`Response: ${response.status} ${response.statusText}`);
  //console.log(await response.text());
  console.log(JSON.stringify(response));
}catch(err)
{
  console.log("Error ",JSON.stringify(err));}
}

export default saveNewRow;