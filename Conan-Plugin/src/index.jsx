import ForgeUI, { render, Text, Fragment, GlobalPage, useState, Button, ModalDialog, Table, Row, Cell, Head } from '@forge/ui';
import api, { fetch, route } from '@forge/api';

const fetchProjectData = async() =>{

  const res = await api.asApp().requestJira(route`/rest/api/3/project/OEM/properties`);
  const data = await res.json();
	
	var conanScores = [];
	
	for(var projectPropKeys of data.keys)
	{
		console.log(projectPropKeys);
		
		if(projectPropKeys.key == "ConanLinks")
		{
      const res1 = await api.asApp().requestJira(route`/rest/api/3/project/OEM/properties/ConanLinks`);
      console.log("res1: "+res1);      
      const data1 = await res1.json();
      console.log("data1: "+ data1);
      

			conanScores.push
			({
				"key": data1.value.name,
				"value" : data1.value.conanlink
			});
		}
	}
	
	console.log(conanScores);
	return conanScores;
}
const App = () => {

  const [conandata] = useState(async()=> await fetchProjectData());
  console.log(conandata);
  const [isOpen, setOpen] = useState(false);

  return (
    <Fragment>

      <Button text="Add Link" onClick={() => setOpen(true)} />
      {isOpen && (
        <ModalDialog header="Add Conan Link" onClose={() => setOpen(false)}>
          <Text>Start adding links</Text>
        </ModalDialog>
      )}
 
      <Table>
            <Head>
              <Cell>
                <Text>Name</Text>
              </Cell>
              <Cell>
                <Text>Link</Text>
               </Cell>
               <Cell>
                <Text>Edit/Delete</Text>
               </Cell>
            </Head>
            {conandata.map(data => (
                <Row>
                  <Cell>
                    <Text>{data.key}</Text>
                  </Cell>
                  <Cell>
                    <Text>{data.value}</Text>
                  </Cell>
                </Row>
              ))}
      </Table>
    </Fragment>
  );
};

export const run = render(
  <GlobalPage>
    <App/>
  </GlobalPage>
);
