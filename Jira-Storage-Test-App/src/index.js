import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';
import { router } from '@forge/bridge';

const resolver = new Resolver();
const resolver1 = new Resolver();

resolver.define('getProjectStory', async (req) => {
    console.log(req);
	console.log("Hello");
	
	const response = await api.asUser().requestJira(route`/rest/api/3/search?jql=assignee=currentuser()`);
	
	const data = await response.json();
		 
	var issueScores = [];
	issueScores.push({
	"totalissues": data.total
	});
	for(var issue of data.issues)
	{
		console.log(issue);
		
		if(issue.fields.customfield_10028)
		{
			issueScores.push
			({
				"key": issue.key,
				"sp" : issue.fields.customfield_10028
			});
		}
	}
	
	console.log(issueScores);
	return issueScores;
	
});


resolver.define('getStoryPoint', async (req) => {
    console.log(req);
	console.log("Hello from get Story function");
	
	const response1 = await api.asUser().requestJira(route`/rest/api/3/myself`);

    const data1 = await response1.json();
	console.log(data1.displayName);
	
	var basicDetails = [];
	
	basicDetails.push({
	"name":  data1.displayName,
	"email": data1.emailAddress
	});
	
	console.log(basicDetails);
	return basicDetails;
});

export const handler = resolver.getDefinitions();
