import ForgeUI, { render, Text, Fragment, GlobalPage, useState,Table,Head,Cell,Row} from '@forge/ui';
import { fetch } from '@forge/api';

const fetchStoryPoint = async() =>{
  const res = await api.asUser().requestJira(route`/rest/api/3/search?jql=assignee=currentuser()');
  const data = await res.json();
	
	var storyScores = [];
	
	for(var issue of data.issues)
	{
		console.log(issue);
		
		if(issue.fields.customfield_10028)
		{
			storyScores.push
			({
				"key": issue.key,
				"sp" : issue.fields.customfield_10028
			});
		}
	}
	
	console.log(storyScores);
	return storyScores;
}
const App = () => {
  const [storyPoints] = useState(async()=> await fetchStoryPoint());
  console.log(storyPoints);
  return (
    <Fragment>
      <Table>
    <Head>
      <Cell>
        <Text>Issue Key</Text>
      </Cell>
      <Cell>
        <Text>Story Point</Text>
      </Cell>
    </Head>
    {storyPoints.map(issue => (
      <Row>
        <Cell>
          <Text>{issue.key}</Text>
        </Cell>
        <Cell>
          <Text>{issue.sp}</Text>
        </Cell>
      </Row>
    ))}
  </Table>
    </Fragment>
  );
};

export const run = render(
  <GlobalPage>
    <App/>
  </GlobalPage>
);