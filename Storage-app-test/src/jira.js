import api, { fetch, route } from '@forge/api';

export async function storyPointCreation(event, context) {
    if (event.changelog.items === undefined) {
        return false;
    }
    if (event.changelog.items.filter(e => e.field === 'Story Points').length === 0) {
        return false;
    }
    let storyPoint = event.changelog.items.filter(e => e.field === 'Story Points')[0].toString;
    console.log("event= " + JSON.stringify(event));
    let body = `
	{
	"issues":[
		{
		"issueID": ${event.issue.id},
		"properties": {
			"myProperty": {
				"storyPoint": ${parseInt(storyPoint)}
        }
      }
    }
	]
	}`;
	console.log("test")
    console.log("Body created by the edit issue command is= " + JSON.stringify(body));
    const response = await api.asApp().requestJira(route`/rest/api/3/issue/properties/multi`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
	//body: body
       body: JSON.stringify(body)
    });
    const data = await response.json();
    console.log(data);
    console.log(`Response: ${response.status} ${response.statusText}`);
    console.log(await response.text());
    return true;
}
