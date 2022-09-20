import ForgeUI, { Select, Form, Option, AdminPage, render, useAction, Checkbox, CheckboxGroup, useState, ModalDialog } from "@forge/ui";
import { properties, asApp, asUser, route } from '@forge/api';

export const availableParts = [
    {
        name: "QA Demo with design/PM",
        required: true
    },
    {
        name: "Front-End",
        required: true
    },
    {
        name: "Back-End",
        required: true
    },
    {
        name: "Screen resolutions",
        required: true
    },
    {
        name: "I18n",
        required: true
    },
    {
        name: "Edge cases",
        required: true
    },
    {
        name: "Error messages",
        required: true
    },
    {
        name: "Accessibility",
        required: true
    },
];

const getProjects = async () => {
    const result = await asApp()
        .requestJira(
            route`/rest/api/3/project/search`
        );

    return await result.json().then(data => {
        return data;
    })
};

const saveRequiredInProjectAsUser = async (requiredParts, projectKey) => await asUser()
    .requestJira(
        route`/rest/api/3/project/${projectKey}/properties/qa_demo_validator`,
        {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requiredParts)
        }
    );

const getRequiredInProject = async (projectKey) => await properties.onJiraProject(projectKey).get('qa_demo_validator');

export const AdminConfigPage = () => {
    const [projects, setProjects] = useAction(
        () => getProjects(),
        () => getProjects(),
    );

    const [projectKey, setProjectKey] = useState(null);
    const [requiredInProject, setRequiredInProject] = useState([...availableParts]);
    const [isOpen, setOpen] = useState(false);

    const onProjectFormSubmit = async (data) => {
        await setProjectKey(data.selectedProjectKey);
        const partsRequiredInProject = await getRequiredInProject(data.selectedProjectKey);

        if (partsRequiredInProject) {
            await setRequiredInProject(partsRequiredInProject);
        } else {
            await setRequiredInProject(availableParts);
        }

        await setOpen(true);
    };

    const onPartsFormSubmit = async (data) => {
        let dataToSave = [...availableParts];

        dataToSave.forEach((value, index) => {
            const formPartsIndex = data.partsInProject.findIndex(part => part.name === value.name);

            if (formPartsIndex === -1) {
                dataToSave[index].required = false;
            }
        })

        await saveRequiredInProjectAsUser(dataToSave, projectKey);
        await setRequiredInProject(dataToSave);
        await setOpen(false);
    };

    return (
        <AdminPage>
            <Form submitButtonText={"Change required QA demo parts in this project"} onSubmit={onProjectFormSubmit}>
                <Select label="Select a project" name="selectedProjectKey" isRequired={true}>
                    {projects.values.map(project =>
                        <Option label={project.name} value={project.key} />
                    )}
                </Select>
            </Form>

            {projectKey && isOpen ? (
                <ModalDialog header={'Parts required in this project'} onClose={() => setOpen(false)}>
                    <Form onSubmit={onPartsFormSubmit}>
                        <CheckboxGroup label="Visible parts in this project" name="partsInProject">
                            {requiredInProject.map(part => <Checkbox label={part.name} value={part} defaultChecked={part.required} />)}
                        </CheckboxGroup>
                    </Form>
                </ModalDialog>
            ) : null}
        </AdminPage>
    );
};

export const run = render(
    <AdminConfigPage />
);
