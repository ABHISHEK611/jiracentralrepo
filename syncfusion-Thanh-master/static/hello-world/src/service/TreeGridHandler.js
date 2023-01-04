import { findChildByJql } from "../data/ManageData";

export const handleExpand = async (projects, issueLinkType, treegridIssue, dataState) => { // lazy loading
    treegridIssue && treegridIssue.showSpinner(); // show the spinner
    const data = await findChildByJql(projects, issueLinkType, dataState.data);
    treegridIssue && treegridIssue.hideSpinner(); // hide the spinner  
    return data;
}