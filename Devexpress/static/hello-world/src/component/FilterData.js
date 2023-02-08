import { useEffect, useState } from "react";
import IssueLinkSelectBox from "./component/IssueLinkSelectBox";
import TextBox from 'devextreme-react/text-box';
import SelectBox from 'devextreme-react/select-box';
import { Button } from 'devextreme-react/button';
import { getIssueData, getAllProject, getIssueLinkType } from "./data/ManageData";



const FilterData = (props) => {
    let [projects, setProjects] = useState([]);
    let [issueLinkType, setIssueLinkType] = useState("");
    let [issueKey, setIssueKey] = useState("");
    const [searchButton, setsearchButton] = useState({
        loadIndicatorVisible: false,
        buttonText: 'Search',
    });

    useEffect(() => {
        if (props.options) {
            setProjects(props.options.projects);
            setIssueLinkType(props.options.issueLinkType);
        }
    }, [props]);

    const onChangeIssueKey = (value) => {
        setIssueKey(value);
    };

    const handleClickSearch = async () => {
        setsearchButton({
            loadIndicatorVisible: true,
            buttonText: 'Searching',
        });
        console.log(projectSelected)
        let response = await getIssueData(projectSelected, issueLinkSelected, "");
        setsearchButton({
            loadIndicatorVisible: false,
            buttonText: 'Search',
        });
        setDataSource(response.result);
    };

    const onProjectSelectedChanged = (e) => {
        setProjectSelected(e.value.name);
    };

    const onChangeLinkIssueType = (value) => {
        console.log(value)
        setIssueLinkSelected(value);
    };
    return (
        <div class="search-panel">
            <div class="select">
                <SelectBox
                    displayExpr="name"
                    searchEnabled={true}
                    searchMode={"contains"}
                    searchExpr={"name"}
                    searchTimeout={200}
                    minSearchLength={0}
                    showDataBeforeSearch={false}
                    dataSource={projectsDataSource}
                    labelMode={"floating"}
                    label='Select project'
                    onValueChanged={onProjectSelectedChanged}
                />
            </div>
            <div class="select">
                <IssueLinkSelectBox
                    value={issueLinkSelected}
                    onChangeLinkIssueType={onChangeLinkIssueType}
                />
            </div>
            <div className="select">
                <TextBox
                    showClearButton={true}
                    label="Issue key"
                    labelMode={"floating"} />
            </div>
            <div class="button">
                <Button type="success" onClick={handleClickSearch} >
                    <LoadIndicator className="button-indicator" height={20} width={20} visible={searchButton.loadIndicatorVisible} />
                    <span className="dx-button-text">{searchButton.buttonText}</span>
                </Button>
            </div>
        </div>
    )
};
export default FilterData;