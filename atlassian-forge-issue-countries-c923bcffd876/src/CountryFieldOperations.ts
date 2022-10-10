import api, { route } from "@forge/api";
import { useProductContext } from "@forge/ui";
import countryData from "./CountryData";

const countriesFieldName = "Countries";

class CountryFieldOperations {
  getFieldData = async () => {
    const response = await api.asUser().requestJira(route`/rest/api/3/field`);
    const fieldData = await response.json();
    return fieldData;
  };

  getCountriesFieldData = (fieldData) => {
    if (fieldData) {
      for (const field of fieldData) {
        if (field.name === countriesFieldName) {
          return field;
        }
      }
    }
    return undefined;
  };

  getIssueData = async () => {
    const context = useProductContext();
    // @ts-ignore
    const issueKey = context.platformContext.issueKey;
    const response = await api
      .asUser()
      .requestJira(route`/rest/api/3/issue/${issueKey}?expand=renderedFields`);
    const issueData = await response.json();
    return issueData;
  };

  getIssueCountryNames = (countriesFieldData, issueData) => {
    if (
      countriesFieldData &&
      countriesFieldData.id &&
      issueData &&
      issueData.fields &&
      issueData.fields[countriesFieldData.id]
    ) {
      const countryNames = [];
      for (const field of issueData.fields[countriesFieldData.id]) {
        console.log(`Found countries field: ${JSON.stringify(field, null, 2)}`);
        countryNames.push(field.value);
      }
      return countryNames;
    }
    return undefined;
  };

  createCountryCustomField = async () => {
    const countriesFieldData = await this.createEmptyCountryCustomField();
    await this.addCountryFieldOptions(countriesFieldData);
    await this.addCountryFieldToDefaultScreen(countriesFieldData);
  };

  createEmptyCountryCustomField = async () => {
    const payload = {
      searcherKey:
        "com.atlassian.jira.plugin.system.customfieldtypes:multiselectsearcher",
      name: countriesFieldName,
      description: "Custom field for picking countries",
      type: "com.atlassian.jira.plugin.system.customfieldtypes:multiselect",
    };
    const options = {
      method: "POST",
      body: JSON.stringify(payload),
    };
    const response = await api
      .asUser()
      .requestJira(route`/rest/api/3/field`, options);
    console.log("Create country field response:", response);
    const countriesFieldData = await response.json();
    console.log(countriesFieldData);
    /*
        Example response:
        {
          id: 'customfield_10032',
          key: 'customfield_10032',
          name: 'Countries',
          custom: true,
          orderable: true,
          navigable: true,
          searchable: true,
          clauseNames: [ 'cf[10032]', 'Countries' ],
          schema: {
            type: 'array',
            items: 'option',
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:multiselect',
            customId: 10032
          }
        }
    */
    return countriesFieldData;
  };

  getCustomFieldContextId = async (fieldId) => {
    try {
      const response = await api
        .asUser()
        .requestJira(route`/rest/api/3/field/${fieldId}/context`);
      const result = await response.json();
      const contextId = result?.values[0]?.id;
      return contextId;
    } catch (error) {
      console.log(error);
    }
  };

  addCountryFieldOptions = async (countriesFieldData) => {
    const fieldId = countriesFieldData.id;
    const contextId = await this.getCustomFieldContextId(fieldId);

    const payload = {
      options: [],
    };
    for (const countryInfo of countryData.countryInfos) {
      // @ts-ignore
      if (countryInfo.name) {
        payload.options.push({
          // @ts-ignore
          value: countryInfo.name,
        });
      } else {
        // @ts-ignore
        throw new Error(`No name found for ID: ${countryInfo.id}`);
      }
    }
    const options = {
      method: "POST",
      body: JSON.stringify(payload),
    };

    try {
      const response = await api
        .asUser()
        .requestJira(
          route`/rest/api/3/field/${fieldId}/context/${contextId}/option`,
          options
        );
      console.log("Add country field options response:", response);
    } catch (error) {
      console.log(error);
    }
  };

  addCountryFieldToDefaultScreen = async (countriesFieldData) => {
    const fieldId = countriesFieldData.schema.customId;
    const options = {
      method: "POST",
    };
    const response = await api
      .asUser()
      .requestJira(
        route`/rest/api/3/screens/addToDefault/customfield_${fieldId}`,
        options
      );
    console.log("Add country field to default screen response:", response);
    const responseData = await response.json();
    console.log(" * responseData:", responseData);
  };
}

export default new CountryFieldOperations();
