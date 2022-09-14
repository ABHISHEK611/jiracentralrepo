import ForgeUI, { render, Text, TextField, Tabs, Tab, Fragment, ButtonSet, IssueGlance, IssuePanel, useState, Button, ModalDialog, Table, Row, Cell, Head, useProductContext, Form } from '@forge/ui';
import api, { fetch, route } from '@forge/api';

const App = () => {

const [isOpen, setOpen] = useState(false);
let count=0;

const fetchProjectData = async() =>{
  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;

  const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties`);
  const data = await res.json();
	
	var conanScores = [];
	
	for(var issuePropKeys of data.keys)
	{
		console.log("issuePropKeys :"+issuePropKeys);
		
		if(issuePropKeys.key.includes("myProperty"))
		{
      const res1 = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties/${issuePropKeys.key}`);
      console.log("res1: "+res1);      
      const data1 = await res1.json();
      console.log("data1: "+ data1);
      count++;

			conanScores.push
			({
				"key": data1.value.name,
				"value" : data1.value.conanlink
			});
		}
	}
	
	console.log(conanScores);
	console.log("Count is:" +count);
	return conanScores;
}

let [conandata, setconandata] = useState(async()=> await fetchProjectData());

const onSubmit = async (formData) => {
  console.log("Data from the Form:" + formData);
  console.log("Data from the Form:" + JSON.stringify(formData));

  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;

  const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`);
  const res2 = await res.json();
  console.log("response 2: "+res2);
  const issueId = parseInt(res2.id);
  console.log("IssueID: "+issueId);
  console.log("Count inside onSubmit:" +count);

  let newbody2 = 
  {
    issues: [
  {
    issueID: issueId,
      properties: {
        myProperty1: {
          name: formData.name,
          conanlink: formData.url
        }
      }
    }
  ]
  };

  console.log("Body created by the issueid is= " + JSON.stringify(newbody2));

    const response = await api.asApp().requestJira(route`/rest/api/3/issue/properties/multi`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
	body: JSON.stringify(newbody2)
    });
    const data = await response.json();
    console.log(data);
    console.log(`Response: ${response.status} ${response.statusText}`);
    console.log(await response.text());
    setconandata(conandata);

};

let onEdit = (data) => {
  console.log("Data to be edited:" + JSON.stringify(data));
}

let onDelete = async (data) => {
  console.log("Data to be deleted:" + JSON.stringify(data));
}


  return (
    <Fragment>
      <Tabs>
        <Tab label="Details">
      <Button text="Add New Link" onClick={() => setOpen(true)} />
      {isOpen && (
        <ModalDialog header="Add Conan Link" onClose={() => setOpen(false)}>
          <Form onSubmit={onSubmit} submitButtonText="Add">
            <TextField label="Name" name="name" isRequired="true"/>
            <TextField label="URL" name="url" isRequired="true" />
          </Form>
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
                <Text>Action</Text>
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
                  <Cell>
                      <ButtonSet>
                        <Button icon='edit' onClick={async()=> onEdit(data)}></Button>
                        <Button icon='trash' onClick={async()=> await onDelete(data)}></Button>
                      </ButtonSet>
                  </Cell>
                </Row>
              ))}
      </Table>
      </Tab>
      <Tab label="History">
          <Text>Hello from History Page</Text>
      </Tab>
      </Tabs>
    </Fragment>
  );
};

export const run = render(
  <IssueGlance>
    <App/>
  </IssueGlance>
);
