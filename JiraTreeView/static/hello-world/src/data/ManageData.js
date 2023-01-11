import { requestJira } from "@forge/bridge"

const data = async (projects, linkType, issueKey) => {
    const params = issueKey === "" ? `project = ${projects} AND (filter != "${linkType.id}")` : `project = ${projects} AND (filter != "${linkType.id}") AND issue =${issueKey}`;
    const response = await requestJira(`/rest/api/2/search?jql=${params}`);
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
            assignee: element.fields.assignee ? element.fields.assignee.displayName : null,
            status: element.fields.status.name,
            storyPoint: element.fields.customfield_10034, // depend on customfield was definded
            issueType: element.fields.issuetype.name,
            parentId: -1 // level 1 items
        }
        // find children of an item to set property for displaying expand icon
        let children = await findChildByJql(projects, linkType, item);
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
    let jqlFindChildByID = `project = ${projects} and issue in linkedIssues("${issue.key}", "${linkType.outward}")`
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
            storyPoint: element.fields.customfield_10034, // depend on customfield was definded
            issueType: element.fields.issuetype.name,
            parentId: issue.id
        }
        // find children of an item to set property for displaying expand icon
        let children = await findChildByJql(projects, linkType, item);
        item.isParent = children.length > 0;
        // item.childIssues = children;

        listChildren.push(item);
    }))
    return listChildren;
}


const deleteIssueLink = async (issueLinkID) => {
    const response = await requestJira(`/rest/api/2/issueLink/${issueLinkID}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });
    console.log(`Response: ${response.status} ${response.statusText}`);
    console.log(await response.text());

}

const linkNewIssue = async (outwardKey, inwardKey, issueLinkType) => {
    let body = {
        "outwardIssue": {
            "key": outwardKey
        },
        "inwardIssue": {
            "key": inwardKey
        },
        "type": {
            "name": issueLinkType.name
        }
    }
    const response = await requestJira(`/rest/api/2/issueLink`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    console.log(`Response: ${response.status} ${response.statusText}`);
    console.log(await response.text());
}

export const updateIssueLink = async (newParentKey, oldParentID, childKey, issueLinkType) => {
    if (oldParentID !== null) {
        const response = await requestJira(`/rest/api/2/issue/${childKey}?fields=issuelinks`);
        const data = await response.json()
        const oldIssueLinksChild = await data.fields.issuelinks
        const oldIssueLink = await oldIssueLinksChild.find(
            element =>
            (element.inwardIssue !== undefined &&
                element.type.id === issueLinkType.id &&
                element.inwardIssue.id === oldParentID));
        //delete old issue link
        deleteIssueLink(oldIssueLink.id)
    }
    //add new link issue
    linkNewIssue(childKey, newParentKey, issueLinkType)
}

export const transitionIssue = async (issueIdOrKey, transitionID) => {
    let body = {
        transition: {
            id: transitionID,
        },
    }
    const response = await requestJira(`/rest/api/2/issue/${issueIdOrKey}/transitions`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    console.log(`Response: ${response.status} ${response.statusText}`);
}

export const assigneeIssue = async (issueIdOrKey, accountID) => {
    let body = {
        "accountId": accountID
    }
    const response = await requestJira(`/rest/api/2/issue/${issueIdOrKey}/assignee`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    console.log(`Response: ${response.status} ${response.statusText}`);
}

export const updateIssue = async (body, issueIdOrKey) => {
    const response = await requestJira(`/rest/api/2/issue/${issueIdOrKey}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: body
    })
    console.log(`Response: ${response.status} ${response.statusText}`);
    return response.status
}

export const saveEditingIssue = async (issue) => {
    let body = {
        fields: {
            summary: issue.summary,
        },
    };
    body.fields = {
        ...body.fields,
        ...(issue.storyPoint && { customfield_10028: issue.storyPoint }),
    };
    if (issue["status.text"]) {
        issue["status"].text = issue["status.text"].text;
        await transitionIssue(issue.key, issue["status.text"].id);
    }
    if (issue["assignee.displayName"]) {
        issue.assignee = {
            displayName: issue["assignee.displayName"].text,
            accountId: issue["assignee.displayName"].id,
        };
        await assigneeIssue(issue.key, issue["assignee.displayName"].id);
    }
    await updateIssue(JSON.stringify(body), issue.key);
}
