import ForgeUI, { Code, Fragment, Text, Link, Heading, ModalDialog, Table, Row, Cell, Head, useState, Button, Select, Option, Form } from "@forge/ui";
import api from '@forge/api';

export const RepoList = (props) => {
    const [isOpen, setOpen] = useState(false);
    const [formState, setFormState] = useState(undefined);

    const [repositorys] = useState(async () => {
        const github = api.asUser().withProvider('github', 'github-apis')
        const response = await github.fetch(`/users/${props.user}/repos`);
        if (response.ok) {
            return response.json()
        }

        return {
            status: response.status,
            statusText: response.statusText,
            text: await response.text(),
        }
    })
};