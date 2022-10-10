import api from '@forge/api';
import ForgeUI, { Button } from '@forge/ui';
import countryFieldOperations from './CountryFieldOperations';

export default class CountryFieldAdmin {

  render = () => {
    return (
      <Button
        text="Create country field"
        onClick={countryFieldOperations.createCountryCustomField}
      />
    );
  }

}

