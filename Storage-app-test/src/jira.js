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
    let newbody = `
	{
	"issues":[
<<<<<<< HEAD
	{
		"issueID": ${event.issue.id},
		"properties": {
       		   "myProperty": {
			"storyPoint": ${storyPoint}
       		 }
     	}
    	}]}`;
    console.log("Body created by the edit issue command is= " + JSON.stringify(newbody));
=======
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
>>>>>>> ddbdea51e37ef00ed0d58a81129331e1bd35db40
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
