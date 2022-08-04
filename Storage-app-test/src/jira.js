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

    const myVar = process.env.MY_GITHUB_EY;
    const myVar2 = process.env.MY_JIRA_KEY;
    console.log("myVar= " + myVar);
    console.log("myVar2= " + myVar2);

    let newbody = `
	{
	"issues":[
		{
		"issueID": ${event.issue.id},
		"properties": {
			"myProperty": {
				"storyPoint": ${parseInt(storyPoint)},
                "github": ${myVar},
                "jira": ${myVar2}
        }
      }
    }
	]
	}`;
	console.log("test")
    console.log("Body created by the edit issue command is= " + JSON.stringify(newbody));

    const response = await api.asApp().requestJira(route`/rest/api/3/issue/properties/multi`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
	body: newbody
    });
    const data = await response.json();
    console.log(data);
    console.log(`Response: ${response.status} ${response.statusText}`);
    console.log(await response.text());
    return true;
}
