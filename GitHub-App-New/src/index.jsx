import ForgeUI, { render, IssueGlance, useProductContext, Fragment, Text } from '@forge/ui';


const App = () => {
  const {
    platformContext: { issueKey }
  } = useProductContext();
const App1 = () => {
  return (
    <Fragment>
      <Text>Hello ${issueKey}</Text>
    </Fragment>
  );
}};

export const run = render(
  <IssueGlance>
    <App />
  </IssueGlance>
);