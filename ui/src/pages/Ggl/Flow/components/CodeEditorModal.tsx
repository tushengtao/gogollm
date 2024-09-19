import React, {useState, useEffect} from 'react';
import {Modal, Button, message, Divider, Select} from 'antd';
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';
import CodeMirror from "@uiw/react-codemirror";
import {python} from "@codemirror/lang-python";
import {json, jsonParseLinter} from "@codemirror/lang-json";
import {linter, lintGutter} from "@codemirror/lint";
import CodeEditIcon from "@/components/Icon/CodeEditIcon";
import {inlineCopilot} from "codemirror-copilot";
import {LLM_MODELS} from "@/pages/Ggl/constants";
import services from "@/services/ggl/app";
const {code_autocomplete, code_node_run_test} = services.AppRequest;

export const CodeEditorModal: React.FC<{
    value: any;
    onChange: any;
    language?: 'python' | 'json';
    modalWidth?: string;
}> = ({value, onChange, language = 'python', modalWidth = '75%'}) => {
    const [fontSize, setFontSize] = useState(18);
    const [maxHeight, setMaxHeight] = useState('650px');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [codeAutocomplete, setCodeAutocomplete] = useState(false);
    const [unlockingIntelligentCode, setUnlockingIntelligentCode] = useState(false);
    const [codeModel, setCodeModel] = useState('glm-4-flash');
    const [codeRunTestResult, setCodeRunTestResult] = useState('');
    const [currentCodeValue, setCurrentCodeValue] = useState('');


    useEffect(() => {
        const handleResize = () => {
            const percentage = 0.7;
            const windowHeight = window.innerHeight;
            const calculatedHeight = `${windowHeight * percentage}px`;
            setMaxHeight(calculatedHeight);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        const handleKeyDown = (event: any) => {
            if (event.altKey && event.key === 'Enter') {
                if (unlockingIntelligentCode) {
                    setCodeAutocomplete(true);
                    message.info("请继续按下回车键", 3)
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [unlockingIntelligentCode]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const handleRunTest = async () => {
        try {
            const res = await code_node_run_test(currentCodeValue);
            if (res.success) {
                setCodeRunTestResult(JSON.stringify(res.data));
            }else {
                message.error('运行出错:' + res.msg);
            }
        } catch (error) {
            console.error('运行出错:', error);
        }

    };
    const extensions = language === 'json' ? [
        json(),
        linter(jsonParseLinter()),
        lintGutter()
    ] : [python(), inlineCopilot(async (prefix, suffix) => {
        if (unlockingIntelligentCode && codeAutocomplete) {
            message.info('请等待，正在编码中，勿催......', 10);
            setCodeAutocomplete(false);
            const res = await code_autocomplete(prefix, suffix, codeModel);
            if (res.success){
                const {prediction} = await res.data;
                message.success('已完成编码，请按Tab键', 5);
                return prediction;
            }else {
                message.error('运行出错:' + res.msg);
            }
        } else {
            return '';
        }
    })];

    return (
        <>
            <Button
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                type="dashed"
                onClick={showModal}
                icon={<CodeEditIcon/>}
            >
                编辑
            </Button>
            <Modal
                title="代码编辑器"
                width={modalWidth}
                footer={[]}
                open={isModalVisible}
                maskClosable={false}
                onCancel={handleCancel}
                okButtonProps={{style: {display: 'none'}}}
            >
                <span style={{marginRight: '10px', marginBottom: '10px'}}>
                    字体大小：
                </span>
                <Button
                    style={{marginBottom: '10px', marginRight: '10px'}}
                    icon={<MinusOutlined/>}
                    size="small"
                    onClick={() => setFontSize(prevSize => prevSize - 2)}
                />
                <Button
                    style={{marginBottom: '10px'}}
                    icon={<PlusOutlined/>}
                    size="small"
                    onClick={() => setFontSize(prevSize => prevSize + 2)}
                />
                <Button
                    style={{marginBottom: '10px', marginLeft: '10px'}}
                    size="middle"
                    type={"dashed"}
                    onClick={() => {
                        setUnlockingIntelligentCode(!unlockingIntelligentCode);
                        if (!unlockingIntelligentCode) {
                            message.success('已开启智能编码功能');
                        } else {
                            message.success('已关闭智能编码功能');
                        }
                    }}
                >
                    {unlockingIntelligentCode ? '关闭智能编码功能' : '开启智能编码功能'}
                </Button>
                {unlockingIntelligentCode && (
                    <>
                        <span style={{marginLeft: '10px', marginBottom: '10px'}}>模型：</span>
                        <Select
                            showSearch
                            defaultValue="glm-4-flash"
                            style={{ width: 300 }}
                            onChange={(value)=>{
                                setCodeModel(value)
                            }}
                            onSearch={(value)=>{
                                setCodeModel(value)
                            }}
                            options={LLM_MODELS}
                        />
                        <span style={{marginLeft: '10px', marginBottom: '10px'}}> alt + enter键启动智能编码,继续回车触发</span>
                    </>
                )}
                <Button
                    style={{marginBottom: '10px', float: 'right', right: '15px'}}
                    size="middle"
                    type={'primary'}
                    onClick={handleRunTest}
                >
                    运行测试
                </Button>
                <CodeMirror
                    style={{fontSize: `${fontSize}px`}}
                    maxWidth='100%'
                    maxHeight={maxHeight}
                    value={value}
                    basicSetup={{tabSize: 4}}
                    indentWithTab={true}
                    extensions={extensions}
                    onUpdate={(viewUpdate) => {
                        setCurrentCodeValue(viewUpdate.state.doc.toString())
                    }}
                    onChange={onChange}
                    theme="dark"
                />
                {codeRunTestResult && (
                    <>
                        <Divider style={{
                            color: '#1b1a1a',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            borderColor: '#747171',
                            borderWidth: '2px'
                        }}>
                            运行测试结果
                        </Divider>
                        <CodeMirror
                            key={codeRunTestResult}
                            maxWidth='100%'
                            value={codeRunTestResult}
                            theme="dark"
                        />
                    </>
                )}
            </Modal>
        </>
    );
};

export default CodeEditorModal;
