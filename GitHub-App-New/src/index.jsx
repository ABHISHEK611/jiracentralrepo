import ForgeUI, { render, IssueGlance, useProductContext, Fragment, Text, ProjectPage } from '@forge/ui';

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

const App2 = () =>
{
  const {platformContext: {projectKey}} = useProductContext();
  console.log("Project Key: "+projectKey);
  return (
    <Fragment>
      <Text>Project Key: {projectKey}</Text>
    </Fragment>
  );
};

export const run2 = render(
  <ProjectPage>
    <App2 />
  </ProjectPage>
);