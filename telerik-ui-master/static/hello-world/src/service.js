import {
    requestJira
} from "@forge/bridge"
const linkType = {
    id: '10006',
    name: 'Hierarchy link (WBSGantt)',
    inward: 'is contained in',
    outward: 'contains'
}
const deleteIssueLink = async (issueLinkID) => {
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
export const linkNewIssue = async (outwardKey, inwardKey) => {
    let body = {
        "outwardIssue": {
            "key": outwardKey
        },
        "inwardIssue": {
            "key": inwardKey
        },
        "type": {
            "name": linkType.name
        }
    }
    const response = await requestJira(`/rest/api/3/issueLink`, {
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
const updateIssueLink = async (newParent, oldParent, child) => {
    if (oldParent !== null) {
        const response = await requestJira(`/rest/api/3/issue/${child.key}?fields=issuelinks`);
        const data = await response.json()
        const oldIssueLinksChild = await data.fields.issuelinks
        const oldIssueLink = await oldIssueLinksChild.find(
            element =>
            (element.inwardIssue !== undefined &&
                element.type.id === linkType.id &&
                element.inwardIssue.id === oldParent.id));
        //delete old issue link
        deleteIssueLink(oldIssueLink.id)
    }
    //add new link issue
    linkNewIssue(child.key, newParent.key)

}
export const updateIssue = async (body, issueIdOrKey) => {
    const response = await requestJira(`/rest/api/3/issue/${issueIdOrKey}`, {
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
export const transitionIssue = async (issueIdOrKey, transitionID) => {
    let body = {
        transition: {
            id: transitionID,
        },
    }
    const response = await requestJira(`/rest/api/3/issue/${issueIdOrKey}/transitions`, {
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
    const response = await requestJira(`/rest/api/3/issue/${issueIdOrKey}/assignee`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    console.log(`Response: ${response.status} ${response.statusText}`);
}
export const createIssue = async (body) => {
    const response = await requestJira('/rest/api/3/issue', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: body
    })
    console.log(`Response: ${response.status} ${response.statusText}`);
    return await response.json()
}
export const bulkCreateIssue = async (bulkIssue, projectKey) => {
    let body = {
        issueUpdates: []
    }
    for (const issue of bulkIssue) {
        if (issue.summary) {
            body.issueUpdates.push({
                update: {},
                fields: {
                    summary: issue.summary,
                    issuetype: {
                        id: issue.issueType
                    },
                    project: {
                        key: projectKey
                    },
                    assignee: {
                        id: issue["assignee.displayName"].id || null
                    }
                }
            })
        }
    }
    const response = await requestJira('/rest/api/3/issue/bulk`', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    console.log(`Response: ${response.status} ${response.statusText}`);
    return await response.json()
}
export default updateIssueLink;