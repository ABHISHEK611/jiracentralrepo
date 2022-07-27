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
  const {platformContext:{issueKey}} = useProductContext();
  console.log("IssueKey: "+issueKey);
  return (
    <Fragment>
      <Text>Issue Key:{issueKey}</Text>
    </Fragment>
  )
}
export const gitProjectPage = render(
  <ProjectPage>
    <gitIssueKey/>
  </ProjectPage>
);