import ForgeUI, { render, IssueGlance, useProductContext, Fragment, Text } from '@forge/ui';

const App = () => {
  const {platformContext: {issueKey}} = useProductContext();
  console.log("Issue Key: "+issueKey);
  return (
    <Fragment>
      <Text>Issue Key: {issueKey}</Text>
    </Fragment>
  );
};

export const run = render(
  <IssueGlance>
    <App />
  </IssueGlance>
);