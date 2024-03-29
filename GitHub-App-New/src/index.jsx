import ForgeUI, { render, IssueGlance, useProductContext, Fragment, Text } from '@forge/ui';

const App = () => {
  const {platformContext: {issueKey}} = useProductContext();
  console.log("Issue Key: "+issueKey);
  return (
    <Fragment>
      <Text>The issue Key is as: {issueKey}</Text>
    </Fragment>
  );
};

export const run = render(
  <IssueGlance>
    <App />
  </IssueGlance>
);