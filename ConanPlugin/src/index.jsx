import ForgeUI, { render, Fragment, Text, IssuePanel, Link, TextField  } from '@forge/ui';

const App = () => {
  return (
    <Fragment>
	   <TextField label="Name" name="name" />
      <Text>
		  <Link appearance="text" href="https://atlassian.com">Atlassian</Link>
	  </Text>
    </Fragment>
  );
};

export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);
