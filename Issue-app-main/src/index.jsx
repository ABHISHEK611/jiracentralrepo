import api, { route } from "@forge/api";
import ForgeUI, { render, Fragment, Text, GlobalPage, useState, Table, Head, Row, Cell,Link } from "@forge/ui";

const getCurrentUser = async () => {
  const res = await api
    .asUser()
    .requestJira(route`/rest/api/3/myself`);

  const data = await res.json();
  return data;
};

const getIssueforMe = async () => {
  const res = await api
    .asUser()
    .requestJira(route`/rest/api/3/search?jql=assignee=currentuser()`);

  const data = await res.json();
  return data;
};

const App = () => {
  // const context = useProductContext();
  const [user] = useState(async () => await getCurrentUser());
  const [issue] = useState(async () => await getIssueforMe());
  const issues = issue.issues
  return (
    <Fragment>
      <Text>Current User</Text>
      <Text>Name: {user.displayName}</Text>
      <Text>Email: {user.emailAddress}</Text>

      <Text>Total issue assignee for me: {issues.length}</Text>
      <Table>
        <Head>
          <Cell>
            <Text>Project</Text>
          </Cell>
          <Cell>
            <Text>Issue Key</Text>
          </Cell>
          <Cell>
            <Text>Summary</Text>
          </Cell>
        </Head>

        {issues.map(issue =>
          <Row>
            <Cell>
              <Text>{issue.fields.project.name}</Text>
            </Cell>
            <Cell>
              <Text>
                <Link appearance="button" href={"/browse/"+issue.key}>
                  {issue.key}
                </Link>
              </Text>
            </Cell>
            <Cell>
              <Text>{issue.fields.summary}</Text>
            </Cell>
          </Row>
        )}
      </Table>
    </Fragment>
  );
};

export const run = render(
  <GlobalPage>
    <App />
  </GlobalPage>
);