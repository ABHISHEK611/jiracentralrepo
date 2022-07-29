import ForgeUI, { render, Fragment, Text, AdminPage, useState, useEffect, Image, Table, Row, Cell, Head, ModalDialog, Button } from '@forge/ui';
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

      const [isOpen, setOpen] = useState(false);
      
    return (
        <Fragment>
          <Table>
            <Head>
              <Cell>
                <Text>User</Text>
              </Cell>
              <Cell>
                <Text>Repositories</Text>
               </Cell>
            </Head>
            <Row>
              <Cell>
                <Text>{data.login}</Text>
              </Cell>
              <Cell>
              <Button text="Link Repo" onClick={() => setOpen(true)} />
                {isOpen && (
                  <ModalDialog header="Select Repository" onClose={() => setOpen(false)}>
                    <Text>Hello there!</Text>
                  </ModalDialog>
                )}
              </Cell>
            </Row>
          </Table>
        </Fragment>
      );
};

export const run2 = render(
  <AdminPage>
    <App2 />
  </AdminPage>
);
