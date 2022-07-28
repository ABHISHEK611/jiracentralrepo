import ForgeUI, { render, Fragment, Text, AdminPage, Button, ModalDialog } from '@forge/ui';

const App2 = () =>
{
    const [isOpen, setOpen] = useState(false);

    return (
        <Fragment>
        <Text>Welcome to Github Integration</Text>
        <Button text="Show modal" onClick={() => setOpen(true)} />
            {isOpen && (
                <ModalDialog header="My modal dialog" onClose={() => setOpen(false)}>
                <Text>Hello there!</Text>
                </ModalDialog>
            )}  
        </Fragment>
    );
};

export const run2 = render(
  <AdminPage>
    <App2 />
  </AdminPage>
);