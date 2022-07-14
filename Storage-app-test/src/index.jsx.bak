import ForgeUI, { render, Text, Fragment, GlobalPage, useState,Table,Head,Cell,Row} from '@forge/ui';
import { fetch } from '@forge/api';

const fetchStoryPoint = async() =>{
  const res = await fetch('https://woven-handbook-352309.el.r.appspot.com/all');
  const data = res.json();
  return data;
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
          <Text>{issue.issueKey}</Text>
        </Cell>
        <Cell>
          <Text>{issue.storyPoint}</Text>
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