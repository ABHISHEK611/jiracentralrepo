import {requestJira} from "@forge/bridge"

const linkType = {
    id: '10006', name: 'Hierarchy link (WBSGantt)', inward: 'is contained in', outward: 'contains'
}
const projectKey = `TD`;
const data = async () => {
    const params = `project = "${projectKey}" AND (filter != IsContainedIn)`;
    const response = await requestJira(`/rest/api/2/search?jql=${params}`);
    return await response.json();
};

const issuesData = async () => {
    const result = await data();
    let issues = [];
    await Promise.all(result.issues.map(async (element)=> {
        let item = {
            id: element.id,
            key: element.key,
            title: element.fields.summary,
            start: new Date(element.fields.created),
            end: new Date()
        }
        let children = await findChildByJql(item);
        item.children = children;
        issues.push(item)
    }))
    return issues;
}

const findChild = (item, issueLinks) => {
    let children = []
    issueLinks.forEach(issueLink => {
        if (issueLink.type.id === linkType.id && issueLink.outwardIssue !== undefined) {
            let child = {
                id: issueLink.outwardIssue.id,
                key: issueLink.outwardIssue.key,
                title: issueLink.outwardIssue.fields.summary,
                start: new Date(issueLink.outwardIssue.fields.created),
                end: new Date()
            }
            getIssueLinks(issueLink.outwardIssue.key).then(result => {
                findChild(child, result);
            })
            children.push(child)
        }
    })
    if (children.length > 0) item.children = children;
}
export const findChildByJql = async (issue) => {
    let jqlFindChildByID = `project = "${projectKey}" and issue in linkedIssues("${issue.key}", ${linkType.outward})`
    let url = `/rest/api/2/search?jql=${jqlFindChildByID}`
    const response = await requestJira(url);
    const data = await response.json();
    let listChildren = []
    await data.issues.forEach(element => {
        let item = {
            id: element.id,
            key: element.key,
            title: element.fields.summary,
            start: new Date(element.fields.created),
            end: new Date()
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
export default issuesData;