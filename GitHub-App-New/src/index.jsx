import ForgeUI, { render, IssueGlance, useProductContext, Fragment, Text } from '@forge/ui';


const App = () => {
  const {
    platformContext: { issueKey }
  } = useProductContext();
console.log({issueKey});

const App1 = () => {
  return (
    <Fragment>
      <Text>Hello</Text>
    </Fragment>
  );
}};

export const run = render(
  <IssueGlance>
    <App />
  </IssueGlance>
)