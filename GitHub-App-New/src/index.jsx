import ForgeUI, { render, IssueGlance, useProductContext, Fragment, Text, ProjectPage } from '@forge/ui';

const App = () => {
  return (
    <Fragment>
      <Text>Hello World!</Text>
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
      <Text>Project Key:{projectKey}</Text>
    </Fragment>
  )
};

export const run2 = render(
  <ProjectPage>
    <App2 />
  </ProjectPage>
);