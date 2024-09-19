import {useState} from "react";
// app flow 全局 state
export default function AppFlowState()  {
    const [appFlowDataChangeState, setAppFlowDataChangeState] = useState(false);
    return {
        appFlowDataChangeState,
        setAppFlowDataChangeState,
    };
};
