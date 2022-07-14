import api, { fetch, route } from '@forge/api';

export async function storyPointCreation(event, context) {
    if (event.changelog.items === undefined) {
        return false;
    }
    if (event.changelog.items.filter(e => e.field === 'Story Points').length === 0) {
        return false;
    }
    let storyPoint = event.changelog.items.filter(e => e.field === 'Story Points')[0].toString;
    console.log("event: " + JSON.stringify(event));
    let body = {
		"issueID": event.issue.id,
		"properties": {
        "myProperty": {
			"storyPoint": parseInt(storyPoint)
        }
      }
    }
    console.log(body);
    const response = await api.asUser().requestJira(route`/rest/api/3/issue/properties/multi`, {
        method: 'PUT',
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