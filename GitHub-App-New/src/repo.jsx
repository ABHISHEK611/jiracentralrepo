import ForgeUI, { Code, Fragment, Text, Link, Heading, ModalDialog, Table, Row, Cell, Head, useState, Button, Select, Option, Form } from "@forge/ui";
import api from '@forge/api';

export const RepoList = (profile) => {
    const [isOpen, setOpen] = useState(false);
    const [formState, setFormState] = useState(undefined);
console.log("inside repo");

    const [repositories] = useState(async () => {
        const github = api.asUser().withProvider('github', 'github-apis')
        const response = await github.fetch(`/users/${profile.selecteduser}/repos`);
        if (response.ok) {
            return response.json()
        }

        return {
            status: response.status,
            statusText: response.statusText,
            text: await response.text(),
        }
    })
    console.log("inside repo2");
    const onSubmit = async (formData) => {
        setFormState(formData);
        setOpen(true)
    };

    return (<Fragment>

        <Form onSubmit={onSubmit}>
            <Select isRequired label="Select a repository" name="repository">
                {repositories.map(repo =>
                    (<Option label={repo.name} value={repo.name} />)
                )}
            </Select>
        </Form>
        {isOpen && (<index2 open={setOpen} repo={formState.repository}></index2>
        )}

    </Fragment>)
};