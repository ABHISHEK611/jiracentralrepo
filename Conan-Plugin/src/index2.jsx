import { render, Fragment, Text, AdminPage } from '@forge/ui';

const App2 = () => {
    return (
        <Fragment>
            <Text>Hello from Admin Page</Text>
        </Fragment>
)}

export const run2 = render(
  <AdminPage>
    <App2 />
  </AdminPage>
);
