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

/*--------------------------------------------------------------------------*/

const gitIssueKey =() =>
{
  const {platformContext:{projectKey}} = useProductContext();
  console.log("Project Key: "+projectKey);
  return (
    <Fragment>
      <Text>Issue Key:{projectKey}</Text>
    </Fragment>
  )
}
export const gitProjectPage = render(
  <ProjectPage>
    <gitIssueKey/>
  </ProjectPage>
);