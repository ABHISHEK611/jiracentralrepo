import ForgeUI, { render, Fragment, Text, AdminPage } from '@forge/ui';
import api, { fetch, route } from '@forge/api';

const App2 = () => {
    return (
        <Fragment>
            <Text>Hello from History Page.</Text>
        </Fragment>
)}

export const run2 = render(
  <AdminPage>
    <App2 />
  </AdminPage>
);
