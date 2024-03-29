import ForgeUI, { render, Text, TextField, Tabs, Tab, Fragment, Link,
  ButtonSet, IssueGlance, IssuePanel, useState, Button, ModalDialog, Table, Row, Cell, Head, useProductContext, Form,
  User, DateLozenge, Badge } from '@forge/ui';
import api, { fetch, route } from '@forge/api';

const App = () => {

const [isOpen, setOpen] = useState(false);
const [isOpen1, setOpen1] = useState(false);
let [conanScores, setConanScores] = useState([]);
let [conanHistory, setConanHistory] = useState([]);
let propertyValueLength;

const fetchProjectData = async() =>{
  const context = useProductContext();
  console.log("1 inside fetchProjectData: " +context);
  console.log("2 inside fetchProjectData: " +JSON.stringify(context));

  const issueKey = context.platformContext.issueKey;

  const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties`);
  const data = await res.json();
	
	for(var issuePropKeys of data.keys)
	{
		//console.log("issuePropKeys :"+issuePropKeys);
		
		if(issuePropKeys.key.includes("myProperty"))
		{
      const res1 = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties/${issuePropKeys.key}`);
      //console.log("res1: "+res1);      
      const data1 = await res1.json();
      //console.log("data1: "+ data1);

      //setConanScores( "id"= data1.value.id, "key"= data1.value.name, "value"= data1.value.conanlink);
			conanScores.push
			({
        "id": data1.value.id,
				"key": data1.value.name,
				"value" : data1.value.conanlink
			});
		}
	}
	
	console.log(conanScores);
	return conanScores;
}

const keycounter = async() =>{
  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;
  let count= 0;

  const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties`);
  const data = await res.json();
	
	for(var issuePropKeys of data.keys)
	{
		
		if(issuePropKeys.key.includes("myProperty"))
		{
      count++;
		}
	}

	console.log("Count is:" +count);
	return count;
}

const fetchProjectHistory = async() =>{
  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;

  const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties/myHistory`);
  const data = await res.json();

	console.log("fetching history1: " +JSON.stringify(data.value));
  setConanHistory(data.value);
  propertyValueLength = await Buffer.byteLength(JSON.stringify(data.value), "utf8");
	console.log("fetching history2 propertyValueLength: " +propertyValueLength);
	return conanHistory;
}

let [myHistory, setMyHistory] = useState(async()=> await fetchProjectHistory());
let [conanData, setConanData] = useState(async()=> await fetchProjectData());
let [actualcount, setactualcount] = useState(async()=> await keycounter());

let [editId, setEditId] = useState("");
let [editKey, setEditKey] = useState("");
let [editValue, setEditValue] = useState("");

let [deletedKey, setDeletedKey] = useState("");
let [deletedValue, setDeleteValue] = useState("");

const onSubmit = async (formData) => {
  console.log("Data from the Form:" + formData);
  console.log("Data from the Form:" + JSON.stringify(formData));

  const context = useProductContext()
  const issueKey = context.platformContext.issueKey;

  const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`);
  const res2 = await res.json();
  console.log("response 2: "+res2);
  const issueId = parseInt(res2.id);
  console.log("IssueID: "+issueId);
  
  
  console.log("Count inside onSubmit:" +actualcount);
  
  let propkey = ++actualcount;
  console.log("1 the key is= "+propkey);
  
  var propkey1 = propkey.toString()
  console.log("2 the key is= "+propkey1);
  
  var key= "myProperty".concat(propkey1);
  console.log("3 the key is= "+key);

  let newbody2 = 
  {
    id: key,
    name: formData.name,
    conanlink: formData.url
  };

  console.log("Body created by the issueid is= " + JSON.stringify(newbody2));

    const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties/${key}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
	body: JSON.stringify(newbody2)
    });
    //const data = await response.json();
    //console.log(data);
    //console.log(`Response: ${response.status} ${response.statusText}`);
    //console.log(await response.text());
    conanScores.push
			({
        "id": key,
				"key": formData.name,
				"value" : formData.url
			});
    setConanScores(conanScores);
    setactualcount(propkey);
    setOpen(false);
    
    let history = {
      action: 'Added',
      user: context.accountId,
      object: formData,
      time: new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
    }
    await createHistory(history);

};

let beforeEdit = async (data) => {
  console.log("0 Inside beforeEdit func: "+ JSON.stringify(data));
  console.log("1 Inside beforeEdit func: "+ data.id);
  console.log("2 Inside beforeEdit func: "+ data.key);
  console.log("3 Inside beforeEdit func: "+ data.value);
  setEditId(data.id);
  setEditKey(data.key);
  setEditValue(data.value);

}

let afterEdit = async (formData) => {
  console.log("Inside afterEdit Data to be edited :" + JSON.stringify(formData));
  console.log("1 Inside afteredit func: "+ editId);
  console.log("2 Inside afteredit func: "+ editKey);
  console.log("3 Inside afteredit func: "+ editValue);

  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;

 let newbody2 = 
  {
    id: editId,
    name: formData.name,
    conanlink: formData.url,
  };

  console.log("Body created by the issueid is= " + JSON.stringify(newbody2));

    const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties/${editId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
	body: JSON.stringify(newbody2)
    });
    console.log(`Response: ${response.status} ${response.statusText}`);
    console.log(await response.text());
    
    let itemEdit = conanScores.findIndex(data => data.id == editId);
    console.log(itemEdit);
    conanScores[itemEdit] = {...conanScores[itemEdit], "key": formData.name, "value" : formData.url};
    console.log(conanScores);

    setConanScores(conanScores);
    setOpen1(false);

    let history = {
      action: 'Edited',
      user: context.accountId,
      object: formData,
      oldObjectKey: editKey,
      oldObjectValue: editValue,
      time: new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
    }
    await createHistory(history);
}

let onDelete = async (deleteId) => {
  console.log("Key to be deleted:" + deleteId);
  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;
  
  let deletedConanScores = conanScores.filter(x => x.id == deleteId);
  deletedConanScores.forEach(o => {
    if (o.id ===  deleteId) {
      deletedKey = o.key;
      deletedValue = o.value;
    }
  });
  console.log("1 To be deleted:  "+ JSON.stringify(deletedConanScores));
  console.log("2 To be deleted:  "+ deletedKey);
  console.log("3 To be deleted:  "+ deletedValue);

  const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties/${deleteId}`, {
    method: 'DELETE'
  });
  console.log(`Response: ${response.status} ${response.statusText}`);
  console.log(await response.text());
  
  let afterDeleteConanScores = conanScores.filter(y => y.id != deleteId);
  console.log("After deletion array: " +JSON.stringify(afterDeleteConanScores));
  
  conanScores = afterDeleteConanScores;
  setConanScores(conanScores);
  console.log("Actual Array: " +JSON.stringify(conanScores));

  let history = {
    action: 'Deleted',
    user: context.accountId,
    objectKey: deletedKey,
    objectValue: deletedValue,
    time: new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
  }
  await createHistory(history);

}
let createHistory = async (history) => 
{

  if(conanHistory == undefined)
  {
    conanHistory = [];
  }

  if (history.action == "Added") 
  {
    console.log("Add inside history: "+JSON.stringify(history));
    conanHistory.push
			({
        "action": history.action,
        "user": history.user,
        "linkname": history.object.name,
        "url": history.object.url,
        "time": history.time
			});
      console.log("Add2 inside history: "+JSON.stringify(conanHistory));
    }
  else if (history.action == "Edited")
  {
    console.log("Edit inside history: "+JSON.stringify(history));
    conanHistory.push
			({
        "action": history.action,
        "user": history.user,
        "linkname": history.object.name,
        "url": history.object.url,
        "oldlinkname": history.oldObjectKey,
        "oldurl": history.oldObjectValue,
        "time": history.time
			});
      console.log("Edit2 inside history: "+JSON.stringify(conanHistory));
  }
  else
  {
    console.log("Delete inside history: "+JSON.stringify(history));
    conanHistory.push
			({
        "action": history.action,
        "user": history.user,
        "linkname": history.objectKey,
        "url": history.objectValue,
        "time": history.time
			});
      console.log("Delete2 inside history: "+JSON.stringify(conanHistory));
  }
  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;
  const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties/myHistory`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(conanHistory)
    });

    setConanHistory(conanHistory);
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
                <Text>Edit</Text>
               </Cell>
               <Cell>
                <Text>Delete</Text>
               </Cell>
            </Head>
            {conanScores.map(data => (
                <Row>
                  <Cell>
                    <Text>{data.key}</Text>
                  </Cell>
                  <Cell>
                    <Text>
                      <Link appearance="link" href={data.value} openNewTab="true">
                        {data.value}
                     </Link>
                    </Text>
                  </Cell>
                  <Cell>
                        <Button icon='edit' onClick={() => {
                          setOpen1(true)
                          beforeEdit(data)
                          }} />
                        {isOpen1 && (
                            <ModalDialog header="Edit Conan Link" onClose={() => setOpen1(false)}>
                              <Form onSubmit={afterEdit} submitButtonText="Submit">
                                <TextField label="Name" name="name" defaultValue={data.key} isRequired="true"/>
                                <TextField label="Url" name="url" defaultValue={data.value} isRequired="true"/>
                              </Form>
                            </ModalDialog>
                         )}
                  </Cell>
                  <Cell>
                      <Button icon='trash' onClick={async()=> await onDelete(data.id)}></Button>
                  </Cell>
                </Row>
              ))}
      </Table>
      </Tab>
      <Tab label="History">
      {conanHistory !== undefined && conanHistory.reverse().map(historydata =>
            <Fragment>
                {historydata.action == 'Added' &&
                    <Text>
                        <User accountId={historydata.user} /> <Badge appearance="added" text={historydata.action} /> below data at <Badge text={historydata.time} />
                        {historydata.linkname}
                        {historydata.url}
                    </Text>}
                {historydata.action == 'Edited' &&
                    <Text>
                        <User accountId={historydata.user} /> <Badge appearance="primary" text={historydata.action} /> below data at <Badge text={historydata.time} />
                        '\n'Old Value:'\n'
                        '\n'{historydata.oldlinkname}'\n'
                        '\n'{historydata.oldurl}'\n'
                        '\n'New Value:'\n'
                        '\n'{historydata.linkname}'\n'
                        '\n'{historydata.url}'\n'
                    </Text>}
                {historydata.action == 'Deleted' &&
                    <Text>
                        <User accountId={historydata.user} /> <Badge appearance="removed" text={historydata.action} /> below data at <Badge text={historydata.time} />
                        {historydata.linkname}
                        {historydata.url}
                    </Text>}
            </Fragment>
        )}
        <Fragment>
          <Text>Data size of the History: {propertyValueLength}</Text>
        </Fragment>
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
