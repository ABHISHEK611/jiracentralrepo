# Forge Issue Countries

[![Atlassian license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](LICENSE)

This is an example [Forge](https://developer.atlassian.com/platform/forge/) app that displays an issue panel comprising a world map highlighting the countries identified by a custom field.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

Once you have logged into the CLI (`forge login`), follow the steps below to install the app onto your site:

1. Clone this repository
2. Run `forge register` to register a new copy of this app to your developer account
3. Run `npm install` to install your dependencies
4. Run `forge deploy` to deploy the app into the default environment
5. Run `forge install` and follow the prompts to install the app

## Usage

When viewing an issues, a map will appear below the description of the issue. Use the countries custom field to select the countries that the issue applied to. After changing the countries, click the "Refresh" button below the map to hgihlight the selected countries.

![Animation of translate issue content panel](./demo.gif)

## Installation

1. Navigate to a Jira issue page. You should see the a panel below the description titled "Countries" which contains a world map. This panel is produced by the app.
2. At the bottom of the panel, you should see a button labelled "Create country field". Click the button to create the custome field required by the app.
3. Reload the issue view and you should see the "Create country field" button is no longer visible.
4. To the right of the issue view, check if you see a field labelled "Countries". If you don't, visit the [custom fields admin](https://your-tenant.atlassian.net/secure/admin/ViewCustomFields.jspa), click the "..." button beside the "Countries" field, select "Associate to screens" and then select the screens corresponding to your issue view being shown.
5. Reload the issue view and check the "Countries" field is visible.
6. Select one of more countries from the "Countries" field.
7. Click the "Refresh" button below the countries map and check the selected countries are highlighted.

## Debugging

You can use the [`forge tunnel`](https://developer.atlassian.com/platform/forge/change-the-frontend-with-forge-ui/#set-up-tunneling) command to run your Forge app locally. 

## License

Copyright (c) 2020 Atlassian and others.
Apache 2.0 licensed, see [LICENSE](LICENSE) file.

[![From Atlassian](https://raw.githubusercontent.com/atlassian-internal/oss-assets/master/banner-cheers.png)](https://www.atlassian.com)
