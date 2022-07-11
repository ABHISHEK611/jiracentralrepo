import { fetch } from '@forge/api';

export async function issueCreationTrigger(event, context) {
    if (event.changelog.items === undefined) {
        return false;
    }
    if (event.changelog.items.filter(e => e.field === 'Story Points').length === 0) {
        return false;
    }
    let storyPoint = event.changelog.items.filter(e => e.field === 'Story Points')[0].toString;
    console.log("event: " + JSON.stringify(event));
    let body = {
        "issueKey": event.issue.key,
        "storyPoint": parseInt(storyPoint)
    }
    console.log(body);
    const response = await fetch('https://woven-handbook-352309.el.r.appspot.com/insert', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    const data = await response.json();
    console.log(data);
    return true;
}
