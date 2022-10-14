import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';
import { router } from '@forge/bridge';

const resolver = new Resolver();
const resolver1 = new Resolver();

resolver.define('getProjectOverview', async (req) => {
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
				
		var linkcreate =issue.fields.priority.iconUrl;
		const myArray = linkcreate.split("/");
		console.log(myArray);
		
		var linkcreate2= "https://";
		linkcreate2 = linkcreate2.concat(myArray[2]);
		linkcreate2 = linkcreate2.concat("/browse/");
		linkcreate2 = linkcreate2.concat(issue.key);
		
		console.log(linkcreate2);
		
		issueScores.push
		({
			"key": issue.key,
			"id": issue.id,
			"projectname": issue.fields.project.name, 
			"summary":issue.fields.summary,
			"issuelink": linkcreate2
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

