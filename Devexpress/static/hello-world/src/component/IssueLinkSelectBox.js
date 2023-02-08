import { requestJira } from "@forge/bridge";
import { useEffect, useState } from "react";
import SelectBox from 'devextreme-react/select-box';
import { getIssueLinkType } from "../data/ManageData";

const IssueLinkSelectBox = (props) => {
    let [data, setData] = useState([]);
    useEffect(() => {
        (async () => {
            let linktypes = await getIssueLinkType();
            console.log(linktypes)
            setData(
                linktypes.map((ele) => {
                    ele.text = `${ele.inward}\\${ele.outward}`;
                    return ele;
                })
            );
        })();
    }, []);

    const onIssueLinkSelectedChanged = (e) => {
        console.log(e.value.name)
        setData(e.value.name);
    };
    return (
        <SelectBox
            displayExpr="name"
            dataSource={data}
            labelMode={"floating"}
            label='Select Issue Link Type'
            onValueChanged={onIssueLinkSelectedChanged}
        />
    );
};
export default IssueLinkSelectBox;