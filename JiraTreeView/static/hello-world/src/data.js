import api, { fetch, route } from '@forge/api';
import ForgeUI, { useProductContext } from '@forge/ui';
import { requestJira } from '@forge/bridge';

const projectKey = `OEM`;
let idCount = 1;
let headCount = -1;

export const fetchIssueList = async() =>{
    
    const context = useProductContext();
    console.log("1 inside fetchIssueList: ",context);
    console.log("2 inside fetchIssueList: ",JSON.stringify(context));
    
    const params = `project = ${projectKey}`;
    const res = await requestJira(`/rest/api/2/search?jql=${params}`);
    console.log("3 inside fetchIssueList: ",res);
    console.log("3.5 inside fetchIssueList: ",JSON.stringify(res));
    const data = await res.json();
    console.log("4 inside fetchIssueList: ",JSON.stringify(data));
    return data;
    /*if(data.length > 0)
    {
      return await res.json();
    }*/
}

export const issues = await fetchIssueList().then(result => 
  {
    let issues1 = [];
    console.log("5 inside issues.",result);
    result.issues.forEach((element) => {
      let item = {
            ID: idCount,
            Head_ID: headCount,
            Issue_Key: element.key,
            Issue_Type: element.fields.issuetype.name,
            Summary: element.fields.summary,
            Assignee: element.fields.assignee,
            Reporter: element.fields.reporter.displayName,
            Priority: element.fields.priority.name,
        }
      console.log("6 inside issues: ",JSON.stringify(item));
      issues1.push(item);
      idCount = idCount +1;
      if(headCount === -1)
      {
        headCount = headCount +2;
      }
    });
    console.log("7 inside issues: ",JSON.stringify(issues1));
    return issues1;
});

/*const issues = [{
    ID: 1,
    Head_ID: -1,
    Issue_Key: 'OEM-1',
    Issue_Type: 'Story',
    Summary: 'California',
    Assignee: 'jheart@dx-Assignee.com',
    Sprint: 'jheart_DX_Sprint',
    Priority: '(213) 555-9392'
  }, {
    ID: 2,
    Head_ID: 0,
    Issue_Key: 'OEM-2',
    Issue_Type: 'Story',
    Summary: 'California',
    Assignee: 'samanthab@dx-Assignee.com',
    Sprint: 'samanthab_DX_Sprint',
    Priority: '(213) 555-2858'
  }, {
    ID: 3,
    Head_ID: 1,
    Issue_Key: 'OEM-3',
    Issue_Type: 'Denver',
    Summary: 'Colorado',
    Assignee: 'arthurm@dx-Assignee.com',
    Sprint: 'arthurm_DX_Sprint',
    Priority: '(310) 555-8583'
  }, {
    ID: 4,
    Head_ID: 1,
    Issue_Key: 'OEM-4',
    Issue_Type: 'Bentonville',
    Summary: 'Arkansas',
    Assignee: 'robertr@dx-Assignee.com',
    Sprint: 'robertr_DX_Sprint',
    Priority: '(818) 555-2387'
  }, {
    ID: 5,
    Head_ID: 1,
    Issue_Key: 'OEM-5',
    Issue_Type: 'Atlanta',
    Summary: 'Georgia',
    Assignee: 'gretas@dx-Assignee.com',
    Sprint: 'gretas_DX_Sprint',
    Priority: '(818) 555-6546'
  }, {
    ID: 6,
    Head_ID: 3,
    Issue_Key: 'OEM-6',
    Issue_Type: 'Reno',
    Summary: 'Nevada',
    Assignee: 'brettw@dx-Assignee.com',
    Sprint: 'brettw_DX_Sprint',
    Priority: '(626) 555-0358'
  }, {
    ID: 7,
    Head_ID: 5,
    Issue_Key: 'OEM-7',
    Issue_Type: 'Beaver',
    Summary: 'Utah',
    Assignee: 'sandraj@dx-Assignee.com',
    Sprint: 'sandraj_DX_Sprint',
    Priority: '(562) 555-2082'
  }, {
    ID: 8,
    Head_ID: 4,
    Issue_Key: 'OEM-8',
    Issue_Type: 'Malibu',
    Summary: 'California',
    Assignee: 'edwardh@dx-Assignee.com',
    Sprint: 'edwardh_DX_Sprint',
    Priority: '(310) 555-1288'
  }, {
    ID: 9,
    Head_ID: 3,
    Issue_Key: 'OEM-9',
    Issue_Type: 'Phoenix',
    Summary: 'Arizona',
    Assignee: 'barbarab@dx-Assignee.com',
    Sprint: 'barbarab_DX_Sprint',
    Priority: '(310) 555-3355'
  }, {
    ID: 10,
    Head_ID: 2,
    Issue_Key: 'OEM-10',
    Issue_Type: 'San Diego',
    Summary: 'California',
    Assignee: 'kevinc@dx-Assignee.com',
    Sprint: 'kevinc_DX_Sprint',
    Priority: '(213) 555-2840'
  }, {
    ID: 11,
    Head_ID: 5,
    Issue_Key: 'OEM-11',
    Issue_Type: 'Little Rock',
    Summary: 'Arkansas',
    Assignee: 'cindys@dx-Assignee.com',
    Sprint: 'cindys_DX_Sprint',
    Priority: '(818) 555-6655'
  }, {
    ID: 12,
    Head_ID: 8,
    Issue_Key: 'OEM-12',
    Issue_Type: 'Pasadena',
    Summary: 'California',
    Assignee: 'sammyh@dx-Assignee.com',
    Sprint: 'sammyh_DX_Sprint',
    Priority: '(626) 555-7292'
  }, {
    ID: 13,
    Head_ID: 10,
    Issue_Key: 'OEM-13',
    Issue_Type: 'Pasadena',
    Summary: 'California',
    Assignee: 'davidj@dx-Assignee.com',
    Sprint: 'davidj_DX_Sprint',
    Priority: '(626) 555-0281'
  }, {
    ID: 14,
    Head_ID: 10,
    Issue_Key: 'OEM-14',
    Issue_Type: 'Little Rock',
    Summary: 'Arkansas',
    Assignee: 'victorn@dx-Assignee.com',
    Sprint: 'victorn_DX_Sprint',
    Priority: '(213) 555-9278'
  }, {
    ID: 15,
    Head_ID: 10,
    Issue_Key: 'OEM-15',
    Issue_Type: 'Beaver',
    Summary: 'Utah',
    Assignee: 'marys@dx-Assignee.com',
    Sprint: 'marys_DX_Sprint',
    Priority: '(818) 555-7857'
  }, {
    ID: 16,
    Head_ID: 10,
    Issue_Key: 'OEM-16',
    Issue_Type: 'Story',
    Summary: 'California',
    Assignee: 'robinc@dx-Assignee.com',
    Sprint: 'robinc_DX_Sprint',
    Priority: '(818) 555-0942'
  }, {
    ID: 17,
    Head_ID: 9,
    Issue_Key: 'OEM-17',
    Issue_Type: 'Boise',
    Summary: 'Idaho',
    Assignee: 'kellyr@dx-Assignee.com',
    Sprint: 'kellyr_DX_Sprint',
    Priority: '(818) 555-9248'
  }, {
    ID: 18,
    Head_ID: 9,
    Issue_Key: 'OEM-18',
    Issue_Type: 'Atlanta',
    Summary: 'Georgia',
    Assignee: 'jamesa@dx-Assignee.com',
    Sprint: 'jamesa_DX_Sprint',
    Priority: '(323) 555-4702'
  }, {
    ID: 19,
    Head_ID: 9,
    Issue_Key: 'OEM-19',
    Issue_Type: 'Boise',
    Summary: 'Idaho',
    Assignee: 'anthonyr@dx-Assignee.com',
    Sprint: 'anthonyr_DX_Sprint',
    Priority: '(310) 555-6625'
  }, {
    ID: 20,
    Head_ID: 8,
    Issue_Key: 'OEM-20',
    Issue_Type: 'Atlanta',
    Summary: 'Georgia',
    Assignee: 'oliviap@dx-Assignee.com',
    Sprint: 'oliviap_DX_Sprint',
    Priority: '(310) 555-2728'
  }, {
    ID: 21,
    Head_ID: 6,
    Issue_Key: 'OEM-21',
    Issue_Type: 'San Jose',
    Summary: 'California',
    Assignee: 'taylorr@dx-Assignee.com',
    Sprint: 'taylorr_DX_Sprint',
    Priority: '(310) 555-7276'
  }, {
    ID: 22,
    Head_ID: 6,
    Issue_Key: 'OEM-22',
    Issue_Type: 'Story',
    Summary: 'California',
    Assignee: 'ameliah@dx-Assignee.com',
    Sprint: 'ameliah_DX_Sprint',
    Priority: '(213) 555-4276'
  }, {
    ID: 23,
    Head_ID: 6,
    Issue_Key: 'OEM-23',
    Issue_Type: 'Chatsworth',
    Summary: 'California',
    Assignee: 'wallyh@dx-Assignee.com',
    Sprint: 'wallyh_DX_Sprint',
    Priority: '(818) 555-8872'
  }, {
    ID: 24,
    Head_ID: 6,
    Issue_Key: 'OEM-24',
    Issue_Type: 'San Fernando',
    Summary: 'California',
    Assignee: 'bradleyj@dx-Assignee.com',
    Sprint: 'bradleyj_DX_Sprint',
    Priority: '(818) 555-4646'
  }, {
    ID: 25,
    Head_ID: 6,
    Issue_Key: 'OEM-25',
    Issue_Type: 'South Pasadena',
    Summary: 'California',
    Assignee: 'kareng@dx-Assignee.com',
    Sprint: 'kareng_DX_Sprint',
    Priority: '(626) 555-0908'
  }, {
    ID: 26,
    Head_ID: 5,
    Issue_Key: 'OEM-26',
    Issue_Type: 'Story',
    Summary: 'California',
    Assignee: 'marcuso@dx-Assignee.com',
    Sprint: 'marcuso_DX_Sprint',
    Priority: '(213) 555-7098'
  }, {
    ID: 27,
    Head_ID: 5,
    Issue_Key: 'OEM-27',
    Issue_Type: 'Denver',
    Summary: 'Colorado',
    Assignee: 'sandrab@dx-Assignee.com',
    Sprint: 'sandrab_DX_Sprint',
    Priority: '(818) 555-0524'
  }, {
    ID: 28,
    Head_ID: 6,
    Issue_Key: 'OEM-28',
    Issue_Type: 'San Fernando Valley',
    Summary: 'California',
    Assignee: 'morgank@dx-Assignee.com',
    Sprint: 'morgank_DX_Sprint',
    Priority: '(818) 555-8238'
  }, {
    ID: 29,
    Head_ID: 28,
    Issue_Key: 'OEM-29',
    Issue_Type: 'La Canada',
    Summary: 'California',
    Assignee: 'violetb@dx-Assignee.com',
    Sprint: 'violetb_DX_Sprint',
    Priority: '(818) 555-2478'
  }, {
    ID: 30,
    Head_ID: 5,
    Issue_Key: 'OEM-30',
    Issue_Type: 'St. Louis',
    Summary: 'Missouri',
    Assignee: 'kents@dx-Assignee.com',
    Sprint: 'kents_DX_Sprint',
    Priority: '(562) 555-9282'
}]; */
