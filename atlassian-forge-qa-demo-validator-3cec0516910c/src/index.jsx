import ForgeUI, { Form, IssueGlance, ModalDialog, Button, useProductContext, Fragment, useState, render, Text, useAction, Checkbox, CheckboxGroup, Table, Head, Row, Cell } from "@forge/ui";
import { properties } from '@forge/api';
import { availableParts as defaultParts} from "./admin";

const getValues = async (issueKey) => await properties.onJiraIssue(issueKey).get('qa_demo_validator');
const getRequiredInProject = async (projectKey) => await properties.onJiraProject(projectKey).get('qa_demo_validator');

const App = () => {
    const context = useProductContext();
    const issueKey = context.platformContext.issueKey;
    const projectKey = context.platformContext.projectKey;
    const [values, setValues] = useState(getValues(issueKey));

    const [requiredInProject, setRequiredInProject] = useAction(
        () => getRequiredInProject(projectKey),
        () => getRequiredInProject(projectKey),
    );

    const saveValues = async (formData, issueKey) => {
        let dataToSave = requiredInProject ? [...requiredInProject] : [...defaultParts]

        dataToSave.forEach((value, index) => {
            const indexInForm = formData.parts.findIndex(part => part.name === value.name);
            dataToSave[index].completed = indexInForm !== -1;
        });

        await properties.onJiraIssue(issueKey).set('qa_demo_validator', dataToSave);
        await setValues(dataToSave);

        return formData;
    };

    const [submitted, setSubmitted] = useAction(
        (_, formData) => saveValues(formData, issueKey),
        values
    );

    const openModal = async () => {
        await setRequiredInProject();
        setOpen(true);
    };

    const partsInProject = requiredInProject ? requiredInProject : defaultParts;
    const [isOpen, setOpen] = useState(false);
    let qaDemoParts;

    if (values) {
        qaDemoParts = values;

        partsInProject.forEach((part, index) => {
            const indexInValues = values.findIndex(value => value.name === part.name);

            if (indexInValues !== -1) {
                qaDemoParts[indexInValues].required = part.required;
            } else {
                qaDemoParts.push(part);
            }
        })
    } else {
        qaDemoParts = partsInProject;
    }

    return (
        <Fragment>
            <Button
                text={`Update QA Demo status`}
                onClick={() => openModal()}
            />

            {isOpen && (
                <ModalDialog header="QA Demo Validator" onClose={() => setOpen(false)}>
                    <Form
                        onSubmit={async (data) => {
                            await setSubmitted(data);
                            setOpen(false);
                        }}
                    >
                        <CheckboxGroup label="Areas covered" name="parts">
                            {qaDemoParts.map(part => part.required ? (
                                <Checkbox label={part.name} value={part} defaultChecked={part.completed} />
                            ) : null)}
                        </CheckboxGroup>
                    </Form>
                </ModalDialog>
            )}

            <Table>
                <Head>
                    <Cell>
                        <Text content="Item" />
                    </Cell>
                    <Cell>
                        <Text content="Completed" />
                    </Cell>
                </Head>

                {qaDemoParts.map(entry => entry.required ? (
                    <Row>
                        <Cell>
                            <Text content={entry.name} />
                        </Cell>
                        <Cell>
                            {entry.completed ? (<Text content={"✅"} />) : null}
                        </Cell>
                    </Row>
                ) : null)}
            </Table>
        </Fragment>
    );
};

export const run = render(
    <IssueGlance>
        <App />
    </IssueGlance>
);
