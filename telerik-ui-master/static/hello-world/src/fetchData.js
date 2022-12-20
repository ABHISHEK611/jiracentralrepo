import {
    requestJira
} from "@forge/bridge"

const data = async (projects, linkType, issueKey) => {
    let listProject = projects.map(element => JSON.stringify(element.key))
    const params = issueKey === "" ? `project in (${listProject}) AND (filter != ${linkType.id})` : `project in (${listProject}) AND (filter != ${linkType.id}) AND issue =${issueKey}`;
    const response = await requestJira(`/rest/api/2/search?jql=${params}`);
    return await response.json();
};

const issueData = async (projects, linkType, issueKey) => {
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
            status: {
                text: element.fields.status.name
            },
            storyPoint: element.fields.customfield_10033,
            issueType: element.fields.issuetype.name
        }

        let children = await findChildByJql(projects, linkType, item);
        item.issues = children;
        issues.push(item)
    }))
    return issues.sort((a, b) => b.id - a.id);
}

export const findChildByJql = async (projects, linkType, issue) => {
    let listProject = projects.map(element => JSON.stringify(element.key))
    let jqlFindChildByID = `project in (${listProject}) and issue in linkedIssues("${issue.key}", ${linkType.outward})`
    let url = `/rest/api/2/search?jql=${jqlFindChildByID}`
    const response = await requestJira(url);
    const data = await response.json();
    let listChildren = []
    await data.issues.forEach(element => {
        let item = {
            id: element.id,
            key: element.key,
            summary: element.fields.summary,
            assignee: element.fields.assignee ? element.fields.assignee.displayName : null,
            status: {
                text: element.fields.status.name
            },
            storyPoint: element.fields.customfield_10033,
            issueType: element.fields.issuetype.name
        }
        listChildren.push(item);
    })
    return listChildren;
}
const getIssueLinks = async (issueKey) => {
    const response = await requestJira(`/rest/api/3/issue/${issueKey}?fields=issuelinks`);
    const data = await response.json()
    return await data.fields.issuelinks
}
export default issueData;