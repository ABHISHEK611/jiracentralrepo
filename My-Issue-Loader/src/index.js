import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

const resolver = new Resolver();
const resolver1 = new Resolver();

resolver.define('getProjectOverview', async (req) => {
    console.log(req);
	console.log("Hello");
	//var jql= `project in (${req.context.extension.project.key})`;
	const response = await api.asUser().requestJira(route`/rest/api/3/search?jql=assignee=currentuser()`);
	//const response = await api.asUser().requestJira(route`/rest/api/3/myself`);
	//console.log(response);
	
    const data = await response.json();
	//console.log(data);
	 
	var issueScores = [];
	issueScores.push({
	"totalissues": data.total
	});
	for(var issue of data.issues)
	{
		console.log(issue);
		//console.log(issue.fields.summary);
		//console.log(issue.fields.project.name);
		//console.log(issue.key);
		var linkcreate= "https://abhilibrian.atlassian.net/browse/";
		linkcreate = linkcreate.concat(issue.key);
		//console.log(linkcreate);
		
		issueScores.push
		({
			"key": issue.key,
			"id": issue.id,
			"projectname": issue.fields.project.name, 
			"summary":issue.fields.summary,
			"issuelink": linkcreate
		});
	}
	
	console.log(issueScores);
	return issueScores;
	
});


resolver.define('getTitle', async (req) => {
    console.log(req);
	console.log("Hello from get Title");
	
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
export const handler1 = resolver1.getDefinitions();

