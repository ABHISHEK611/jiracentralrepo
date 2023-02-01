import React, { useEffect, useRef, useState }  from 'react';
import { Button  as ActualButton } from 'devextreme-react/button';
import api, { route } from "@forge/api";
import notify from 'devextreme/ui/notify';
import { requestJira } from "@forge/bridge";

export const onDragChange = async (e) => {
    console.log("0 inside onDragChange",e);
    console.log("0.5 inside onDragChange",currentIssues);
    let visibleRows = e.component.getVisibleRows(),
      sourceNode = e.component.getNodeByKey(e.itemData.ID),
      targetNode = visibleRows[e.toIndex].node;

    console.log("1 inside onDragChange: ",visibleRows);
    console.log("2 inside onDragChange: ",sourceNode);
    console.log("3 inside onDragChange: ",targetNode);
    while (targetNode && targetNode.data) {
      if (targetNode.data.ID === sourceNode.data.ID) {
        e.cancel = true;
        break;
      }
      targetNode = targetNode.parent;
    }
  }

export const onReorder = async (e) => {
    console.log("0 inside onReorder",e);
    console.log("0.5 inside onReorder",currentIssues);
    let visibleRows = e.component.getVisibleRows(),
      sourceData = e.itemData,
      targetData = visibleRows[e.toIndex].data,
      issuesReordered = currentIssues,
      sourceIndex = issuesReordered.indexOf(sourceData),
      targetIndex = issuesReordered.indexOf(targetData);

    console.log("1 inside onReorder visible rows: ",visibleRows);
    console.log("2 inside onReorder source: ",sourceData);
    console.log("3 inside onReorder target: ",targetData);
    //console.log("4 inside onReorder: ",issuesReordered);
    console.log("5 inside onReorder sourceIndex: ",sourceIndex);
    console.log("6 inside onReorder targetIndex: ",targetIndex);
    if (e.dropInsideItem) {
      console.log("7 inside onReorder inside if:");
      sourceData = { ...sourceData, Head_ID: targetData.ID };
      issuesReordered = [...issuesReordered.slice(0, sourceIndex), sourceData, ...issuesReordered.slice(sourceIndex + 1)];
      savingDragandDrop(sourceData.Issue_Key, targetData.Issue_Key);
    }
    else {
      console.log("8 inside onReorder inside else:");
      if (sourceData.Head_ID !== targetData.Head_ID) 
      {
        console.log("9 inside onReorder inside else 1stif:");
        sourceData = { ...sourceData, Head_ID: targetData.Head_ID };
        if (e.toIndex > e.fromIndex) {
          console.log("10 inside onReorder inside else 2ndif:");
          targetIndex++;
        }
      }
      issuesReordered = [...issuesReordered.slice(0, sourceIndex), ...issuesReordered.slice(sourceIndex + 1)];
      console.log("11 inside onReorder inside else:",issuesReordered);
      issuesReordered = [...issuesReordered.slice(0, targetIndex), sourceData, ...issuesReordered.slice(targetIndex)];
      console.log("12 inside onReorder inside else:",issuesReordered);
    }
    setCurrentIssues(issuesReordered);
}

export default onReorder;