## Forge QA demo validator

[![Atlassian license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](LICENSE)

Adds a Jira issue glance that shows whether or not all required testing areas have been checked
during QA demos. You can create and customize a checklist that contains the required testing
areas per project.

This project demonstrates how to create a settings page for a Forge app using the Jira admin page module. 
With the admin page module you create dynamic, per-project settings and preferences pages.

QA demos are a common practice of presenting a project's code and functionality to a peer engineer.
This helps to confirm that the implemented feature works as expected and complies with standards and
requirements. See [How Atlassian Does QA](https://www.atlassian.com/inside-atlassian/qa) for more details.

### How to run the QA demo validator
0. Install the app (see quick start section)
1. Open Jira Settings > Apps > QA Demo Validator
2. Select a project
3. Select the parts you want to exercise in the QA demo
4. Go to an issue in the selected project and click the "QA Demo Validator" issue glance. You can mark off parts covered in your QA and see the overall status of the QA demo.

![App gif](QA_Demo_Validator.gif)

### QA demo validator features
- Sets the QA demo parts by project
- Persists QA demo status per issue

### Forge documentation

For documentation and tutorials explaining Forge, see [developer.atlassian.com/platform/forge/](https://developer.atlassian.com/platform/forge).

### Requirements

You need a Forge environment to run this example. For instructions on how to set up a Forge environment, see [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/).

### Quick start
- Install dependencies:
```
npm install
```
- Register the app:
```
forge register
```

- Build and deploy your app:
```
forge deploy
```

- Install app in an Atlassian site:
```
forge install
```

- Prepare for development by proxying invocations locally:
```
forge tunnel
```

### Notes
- Use `forge deploy` to apply code changes to installed versions of the app.
- Use `forge install` to install the app on another site.
- When the app is installed on a site, the site picks up your deployed app changes automatically. You do not need to rerun the install command.

### Support

For information on how to get help and provide feedback, see [Get help](https://developer.atlassian.com/platform/forge/get-help/).

## License

Copyright (c) 2020 Atlassian and others.
Apache 2.0 licensed, see [LICENSE](LICENSE) file.

[![From Atlassian](https://raw.githubusercontent.com/atlassian-internal/oss-assets/master/banner-cheers.png)](https://www.atlassian.com)