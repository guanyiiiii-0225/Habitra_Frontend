import { Avatar, Switch, Typography, Divider, Form, Input, TimePicker, Select, Checkbox, Row, Col, Button  } from 'antd';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { addTask, addNewAdmin, addNewMember, getAllIcon } from '../axios';

const AddTaskPage = ({token, userId}) => {

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

        const [taskIcon, setTaskIcon] = useState("https://joeschmoe.io/api/v1/random");
        const [taskIconList, setTaskIconList] = useState(iconList);
        
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

            const response = await addTask({title:title, description:description, threshold:threshold, working_day:workDay, punish:punish, need_daily_desc:need_daily_desc, icon:icon, start_hour:start.split(" ")[4].substr(0,5), end_hour:end.split(" ")[4].substr(0,5), token: token});
            const response_2 = await addNewMember({task_id: response, user_id: userId, token: token});
            const response_3 = await addNewAdmin({task_id: response, user_id: userId, token: token});
        }
        

    return(
        <>
            <Title level={3}>新增任務</Title>
            <Divider orientation="left">基本資訊</Divider>
            <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{remember: true, layout: 'vertical'}}

                >
                    {/* 用戶姓名 */}
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
            </Form> 
            <Divider orientation="left">任務規範</Divider>
            <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{remember: true, layout: 'vertical'}}

            >
                {/* 打卡區間 */}
                <Form.Item
                    name="taskName"
                    label="打卡區間"
                    rules={[
                    {
                        required: true,
                        message: '請輸入打卡時間區間!',
                    },
                    ]}
                >
                    <TimePicker.RangePicker format={"HH:mm"} value={[start_hour, end_hour]} onChange={(time) => handleTimePick(time)} />
                </Form.Item>
                {/* 完成方式 */}
                <Form.Item
                    name="taskName"
                    label="完成方式"
                    rules={[
                        {
                            required: true,
                            message: '請輸入打卡時間區間!',
                        },
                    ]}
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
                    <Checkbox.Group style={{ width: '100%' }} onChange={(e) => setWorking_day(e)} >
                        <Row>
                        <Col span={8}>
                            <Checkbox value="1">Monday</Checkbox>
                        </Col>
                        <Col span={8}>
                            <Checkbox value="2">Tuesday</Checkbox>
                        </Col>
                        <Col span={8}>
                            <Checkbox value="3">Wednesday</Checkbox>
                        </Col>
                        <Col span={8}>
                            <Checkbox value="4">Thursday</Checkbox>
                        </Col>
                        <Col span={8}>
                            <Checkbox value="5">Friday</Checkbox>
                        </Col>
                        <Col span={8}>
                            <Checkbox value="6">Saturday</Checkbox>
                        </Col>
                        <Col span={8}>
                            <Checkbox value="7">Sunday</Checkbox>
                        </Col>
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                {/* 懲罰機制 */}
                <Form.Item
                    name="punush"
                    label="未完成罰金"
                    rules={[
                        {
                            required: true,
                            message: '請選擇是否懲罰!',
                        },
                    ]}
                >
                    <Switch checkedChildren="開啟" unCheckedChildren="關閉" defaultChecked onChange={handlePunush}/>
                    <Input.Group compact>
                        {/* switch */}
                        {/* input box */}
                        <div style={{visibility:punish !== 0 ? 'visible' : 'hidden'}}>
                            <Input style={{ width: 100 }} value = {punish} placeholder="請輸入數字" onChange={(e) => setPunish(e.target.value)} />
                            <p>元</p>
                        </div>
                    </Input.Group>
                </Form.Item>
                {/* 需上傳文字 + info */}
                <Form.Item
                    name="punush"
                    label="是否需上傳文字"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Switch checkedChildren="開啟" unCheckedChildren="關閉" defaultChecked onChange={setNeed_daily_desc}/>
                </Form.Item>
                <Form.Item>
                        <Button type="primary" htmlType="submit" className="wide-form-button" onClick={handleLogin}>
                            submit
                        </Button>
                    </Form.Item>
            </Form> 

        </>
    )

}

export default AddTaskPage;