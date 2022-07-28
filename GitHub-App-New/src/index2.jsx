import ForgeUI, { render, Fragment, Text, AdminPage, useState, useEffect, Image } from '@forge/ui';
import { fetch } from '@forge/api';

const App2 = () =>
{
    console.log("inside app2");
    const [data] = useState(async () => {
        const github = api.asUser().withProvider('github', 'github-apis')
        if (!await github.hasCredentials()) {
          await github.requestCredentials()
        }
        const response = await github.fetch('/user');
        if (response.status === 401)  {
          await github.requestCredentials();
        }
        if (response.ok) {
          return response.json()
        }
        
        return {
          status: response.status,
          statusText: response.statusText,
          text: await response.text(),
        }
      })
      console.log("run index");

    return (
        <Fragment>
          <Text>Welcome {data.login}</Text>
        </Fragment>
      );
};

export const run2 = render(
  <AdminPage>
    <App2 />
  </AdminPage>
);
