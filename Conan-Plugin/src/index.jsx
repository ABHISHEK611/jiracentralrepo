import ForgeUI, { render, Text, Fragment, GlobalPage } from '@forge/ui';

const fetchProjectData = async() =>{

  const res = await api.asUser().requestJira(route`/rest/api/3/project/OEM/properties`);
  const data = await res.json();
	
	var conanScores = [];
	
	for(var projectPropKeys of data.keys)
	{
		console.log(projectPropKeys);
		
		if(projectPropKeys.key == "ConanLinks")
		{
			conanScores.push
			({
				"key": projectPropKeys.value.name,
				"value" : projectPropKeys.value.conanlink
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
        <ModalDialog header="My modal dialog" onClose={() => setOpen(false)}>
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
                    <Text>{issue.value}</Text>
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