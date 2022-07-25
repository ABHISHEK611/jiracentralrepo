import ForgeUI, {
    render,
    AdminPage,
    Fragment,
    Form,
    Select,
    Option,
    Toggle,
    Text,
    Strong,
    useState,
    useEffect,
    SectionMessage, useProductContext,
} from '@forge/ui';
import { format } from "date-fns";
import { DATE_TIME_OPTIONS, DEFAULT_CONFIGURATION, STORAGE_KEY_PREFIX } from './constants';


import { storage } from '@forge/api';
import { getProjects } from "./helpers";

const App = () => {
    const [projectConfigState, setProjectConfigState] = useState(undefined);
    const [isProjectConfigSubmitted, setProjectConfigSubmitted] = useState(false);
    const [projectKey, setProjectKey] = useState(undefined);
    const [projectData] = useState(() => getProjects());

    useEffect(async () => {
        const storageData = await storage.get(`${STORAGE_KEY_PREFIX}_${projectKey}`);
        setProjectConfigState(storageData || DEFAULT_CONFIGURATION);
    }, [projectKey]);

    const onProjectPicked = ({ project }) => {
        setProjectKey(project);
    }

    const onProjectConfigSubmit = async (projectConfig) => {
        await storage.set(`${STORAGE_KEY_PREFIX}_${projectKey}`, projectConfig);
        setProjectConfigState(projectConfig);
        setProjectConfigSubmitted(true);
    };

    const isDateOptionSelected = (value) => projectConfigState && projectConfigState.timeConfig && projectConfigState.timeConfig === value && { defaultSelected: true };

    const isToggleConfigSelected = (name) => projectConfigState && projectConfigState[name] && { defaultChecked: true }

    const renderDateTimeOption = (option) => {
        let label;
        const sampleDate = new Date();

        switch (option) {
            case DATE_TIME_OPTIONS.day:
                label = `Day-month-year: ${format(sampleDate, DATE_TIME_OPTIONS.day)}`;
                break;
            case DATE_TIME_OPTIONS.month:
                label = `Month day, year: ${format(sampleDate, DATE_TIME_OPTIONS.month)}`;
                break;
            case DATE_TIME_OPTIONS.year:
                label = `Year, month day: ${format(sampleDate, DATE_TIME_OPTIONS.year)}`;
                break;
            default:
                label = `Year-month-day: ${format(sampleDate, DATE_TIME_OPTIONS.default)}`;
                break;
        }
        return <Option label={label} value={option} {...isDateOptionSelected(option)} />
    }

    const renderProjectPicker = () => {
        return projectData.length !== 0
            ? <Fragment>
                <Text>In this page you can modify <Strong>Issue health monitor</Strong> configuration for selected project</Text>
                <Form onSubmit={onProjectPicked} submitButtonText="Choose">
                    <Select label="Choose project" name="project" >
                        {projectData.map(project => <Option label={project.name} value={project.key} />)}
                    </Select>
                </Form>
            </Fragment>
            : <Text content="No configurable projects available" />
    }

    const renderDateTimeConfig = () => (
        <Select label="Date time configuration" name="timeConfig">
            {Object.values(DATE_TIME_OPTIONS).map(option => renderDateTimeOption(option))}
        </Select>
    )

    const renderAssigneeConfig = () => (
        <Toggle {...isToggleConfigSelected('isAssigneeVisible')} label="Show/hide Assignee" name="isAssigneeVisible" />
    )

    const renderNotificationButtonConfig = () => (
        <Toggle {...isToggleConfigSelected('isNotifyAssigneeButtonVisible')}  label="Show/hide Assignee notification button" name="isNotifyAssigneeButtonVisible" />
    )

    const renderHistoricalAssigneeConfig = () => (
        <Toggle {...isToggleConfigSelected('isHistoricalAssigneeVisible')}  label="Show/hide Historical assignees" name="isHistoricalAssigneeVisible" />
    )

    return (
        <Fragment>
            {isProjectConfigSubmitted && <SectionMessage title="Configuration Saved" appearance="confirmation"/>}
            {!projectKey ? renderProjectPicker() : <Form onSubmit={onProjectConfigSubmit}>
                {renderDateTimeConfig()}
                {renderAssigneeConfig()}
                {renderNotificationButtonConfig()}
                {renderHistoricalAssigneeConfig()}
            </Form>}
        </Fragment>
    );
};

export const run = render(
    <AdminPage>
        <App />
    </AdminPage>
);
