import ForgeUI, {
  Button,
  render,
  Fragment,
  IssuePanel,
  useAction,
  useState
} from '@forge/ui';
import WorldMap from './WorldMap';
import countryFieldOperations from './CountryFieldOperations';
import CountryFieldAdmin from './CountryFieldAdmin';

const App = () => {

  const [fieldData] = useAction(value => value, async () => {
    return await countryFieldOperations.getFieldData()
  });
  const [initialCountriesFieldData] = useAction(value => value, () => {
    return countryFieldOperations.getCountriesFieldData(fieldData)
  });
  const [countriesFieldData, setCountriesFieldData] = useState(initialCountriesFieldData);
  const [issueData] = useAction(value => value, async () => {
    return await countryFieldOperations.getIssueData()
  });
  const initialCountryNames = countryFieldOperations.getIssueCountryNames(
    countriesFieldData, issueData);
  const [countryNames, setCountryNames] = useState(initialCountryNames);

  const refresh = async () => {
    const issueData = await countryFieldOperations.getIssueData();
    const refreshedCountryNames = countryFieldOperations.getIssueCountryNames(countriesFieldData, issueData);
    setCountryNames(refreshedCountryNames);
  }

  const worldMap = new WorldMap(countryNames);
  const renderedWorldMap = worldMap.render();
  return (
    <Fragment>
      {renderedWorldMap}
      <Button
        text="Refresh"
        onClick={refresh}
      />
      {countriesFieldData ? null : new CountryFieldAdmin().render()}
    </Fragment>
  );
};

export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);
