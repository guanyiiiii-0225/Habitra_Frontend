import { Tooltip,Modal, Avatar, message, Switch, Typography, Divider, Form, Input, TimePicker, Select, Checkbox, Row, Col, Button, Space   } from 'antd';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { addTask, addNewAdmin, addNewMember, getAllIcon } from '../axios';
import { useNavigate } from "react-router-dom";


const AddTaskPage = ({token, userId}) => {

    //default settings
    const navigate = useNavigate();
    // const { Option } = Select;
//     POST /task   新增任務
        var iconList = []; 
        useEffect( async () => {
            const response = await getAllIcon();
            response.map(e => {
                iconList.push(e.Uid);
            })
        }, []); 

        // Typology default setting
        const { Title } = Typography;

        
        const [taskIconList, setTaskIconList] = useState(iconList);
        const [taskIcon, setTaskIcon] = useState("https://cdn-icons-png.flaticon.com/512/620/620851.png");
        const [taskListOpen, setTaskListOpen] = useState(false);

        
        // POST param @middleware
        const [title, setTitle] = useState("");
        const [description, setDescription] = useState(""); 
        // 打卡次數
        const [threshold, setThreshold] = useState(1);
        const [thresholdOn, setThresholdOn] = useState(false);
        // 需要計算的日期[INT]
        const [working_day, setWorking_day] = useState([]);
        const [workDay, setWorkDay] = useState([1,1,1,1,1,1,1]); //因原本前端的格式和串接有點不一樣，重新設的變數
        // 懲罰一天的扣錢數量
        const [punish, setPunish] = useState(0);
        // 是否需要上傳文字
        const [need_daily_desc, setNeed_daily_desc] = useState(false);
        // 任務icon
        const [icon, setIcon] = useState("");
        // 打卡區間
        const [start_hour, setStart_hour] = useState(moment.utc().local().hour(0).minute(0));
        const [end_hour, setEnd_hour] = useState(moment.utc().local().hour(23).minute(59));


        const { TextArea } = Input;



        const handleTimePick = (time) => {
            if(time === null){
                console.log("NULL");
                setStart_hour(moment.utc().local().hour(0).minute(0));
                setEnd_hour(moment.utc().local().hour(23).minute(59));
                
            }
            else{
                console.log("has value\n");
                setStart_hour(time[0]);
                setEnd_hour(time[1]);

            }
        }

        const handlePunush = (checked) => {
            if(checked){
                setPunish(50);
            }
            else{
                setPunish(0);
            }
        }

        const { Option } = Select;

        function handleChange(value) {
            console.log(value['value']);
            if(value['value'] === 'oneTime'){
                console.log("value = 1");
                setThreshold(1);
                setThresholdOn(false);
            }
            else{
                console.log("value = multiple");
                setThreshold(2);
                setThresholdOn(true);
            }
          }

        const finishConstraint = (
        <Select
            labelInValue
            defaultValue={{ value: 'oneTime' }}
            style={{ width: 200 }}
            onChange={handleChange}
        >
            <Option value="oneTime">只需打卡一次</Option>
            <Option value="multipleTimes">需打卡以下次數</Option>
        </Select>
        )

        const handleLogin = async () => {
            var temp = [1,1,1,1,1,1,1];
            for(var i = 0; i < working_day.length; i++){
                temp[working_day[i]-1] = 0;
            }
            var start = start_hour._d.toString();
            var end = end_hour._d.toString();
            
            setWorkDay(temp);

            if(title !== ""){
                const response = await addTask({title:title, description:description, threshold:threshold, working_day:workDay, punish:punish, need_daily_desc:need_daily_desc, icon:icon, icon: taskIcon, start_hour:start.split(" ")[4].substr(0,5), end_hour:end.split(" ")[4].substr(0,5), token: token});
                const response_2 = await addNewMember({task_id: response, user_id: userId, token: token});
                const response_3 = await addNewAdmin({task_id: response, user_id: userId, token: token});
                // console.log("response = ", response.message);
                message.success("成功新增任務!");
                navigate("/");
            }
        }
        

    return(
        <div className='addtask_background'>
        <div style={ {marginLeft: '30px', marginTop: '30px', marginRight: '100px', marginBottom: "1%"}}>
            <Title level={2} style={{textAlign: "center"}}>新增任務</Title>
            <br/>
            <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{remember: true, layout: 'vertical'}}
                    style={{display: "flex", flexDirection: "column"}}
            >
                <Form.Item 
                        style={{cursor: 'pointer'}}
                        name="avatar"
                        label="任務圖標"
                    >
                    <Tooltip title="選取任務icon" placement="right">
                        <Avatar shape="square" size={100} src={taskIcon} onClick={() => setTaskListOpen(true)}  />
                     </Tooltip>
                </Form.Item>

                {/* 打卡區間 */}
                <Form.Item
                        name="taskName"
                        label="任務名稱"
                        rules={[
                        {
                            required: true,
                            message: '請輸入任務名稱!',
                        },
                        ]}
                    >
                        <Input  value = {title} placeholder="任務名稱" onChange={(e) => setTitle(e.target.value)}/>
                </Form.Item>
                    <Form.Item
                        name="taskDescription"
                        label="任務敘述"
                    >
                        <TextArea  value = {description} placeholder="任務敘述" onChange={(e) => setDescription(e.target.value)}/>
                    </Form.Item>
                <Form.Item
                    name="finishRange"
                    label="打卡區間"
                >
                    <TimePicker.RangePicker  allowClear={false} defaultValue={[start_hour, end_hour]} format={"HH:mm"} value={[start_hour, end_hour]} onChange={(time) => handleTimePick(time)} />
                </Form.Item>
                {/* 完成方式 */}
                <Form.Item
                    name="finishMethod"
                    label="完成方式"
                >
                    <Input.Group compact>
                        {finishConstraint}
                        <div style={{visibility:thresholdOn ? 'visible' : 'hidden'}}>
                            <Input value = {threshold} placeholder="請輸入數字" onChange={(e) => setThreshold(e.target.value)} />
                        </div>
                    </Input.Group>
                </Form.Item>
                {/* 休息日: 給星期（一個禮拜休息星期幾）, list */}
                <Form.Item
                        name="relaxDate"
                        label="休息日"
                    >
                        <Select style={{ width: 500 }} mode='multiple' style={{ width: 120 }} onChange={(value) => setWorking_day(value)} >
                            <Option value="1">Mon</Option>
                            <Option value="2">Tue</Option>
                            <Option value="3">Wed</Option>
                            <Option value="4">Thur</Option>
                            <Option value="5">Fri</Option>
                            <Option value="6">Sat</Option>
                            <Option value="7">Sun</Option>
                        </Select>
                    </Form.Item>
                {/* 懲罰機制 */}
                <Space style={{ display: 'flex', flexDirection: "row", alignItems: "flex-start" }} align="baseline">
                <Form.Item
                    name="punish"
                    label="未完成罰金"
                    style={{display: "flex", flexDirection: "row"}}
                >
                    <Switch checkedChildren="開啟" unCheckedChildren="關閉" defaultChecked={false} onChange={handlePunush}/>
                </Form.Item>
                    <Input.Group compact>
                        <div style={{visibility:punish !== 0 ? 'visible' : 'hidden'}}>
                            <Input style={{ width: 100 }} value = {punish} placeholder="請輸入數字" onChange={(e) => setPunish(e.target.value)} />
                            {/* <p>元</p> */}
                        </div>
                        <p style={{visibility:punish !== 0 ? 'visible' : 'hidden'}}>&ensp; NTD</p>
                    </Input.Group>
                </Space>
                {/* 需上傳文字 + info */}
                <Form.Item
                    name="textRequirement"
                    label="是否需上傳文字"
                >
                    <Switch checkedChildren="開啟" unCheckedChildren="關閉" defaultChecked={false} onChange={setNeed_daily_desc}/>
                </Form.Item>
                <Form.Item style={{display: "flex", alignItems: "flex-end", marginLeft: "70%"}}>
                        <Button className="wide-form-button" onClick={() => navigate("/")} style={{marginRight: "5%"}}>
                            返回
                        </Button>
                        <Button type="primary" htmlType="submit" className="wide-form-button" onClick={handleLogin}>
                            送出
                        </Button>
                </Form.Item>

            </Form> 
            <Modal title="請選取你想要的圖標" visible={taskListOpen} onCancel={() =>{setTaskListOpen(false);}} footer={[]}
            >
                {/* <Collapse defaultActiveKey={['1']} onChange={callback} accordion> */}
                {/* </Collapse> */}
                <Space size={16} wrap>
                    {taskIconList.map(url => (<Avatar style={{cursor: 'pointer'}} shape="square" size={64} src={url} onClick={(e) => {setTaskIcon(e.target.src);setTaskListOpen(false);}}/>))}
                </Space>
            </Modal>

        </div>
        </div>
    )

}

export default AddTaskPage;