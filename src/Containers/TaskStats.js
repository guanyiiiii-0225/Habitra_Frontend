// 可以看大家欠了多少錢的那個介面 

// 可以看有哪些介面的那個介面 

/*

1. 錢包
(1) Modal: List(頭貼. 名字. 欠的錢. 清空案件, 關閉案件)
2. 長條圖
 */
import { Column } from '@ant-design/plots';
import { useState, useEffect } from "react";
import {Modal, Typography, Statistic, List, Avatar, Button, message, DatePicker,Row,  Col} from 'antd';
import styled from "styled-components";
import { Icon } from '@iconify/react';
import { getRecordPunish, getUserInfo, getParticipationDetail, getTaskDetail, getRecordDetail, clearMoney, getRecordCount } from '../axios';
import moment from 'moment';

// 記得 {userId}
const TaskStats = ({taskId, token, userId}) => {

    //default settings
    const [openModal, setOpenModal] = useState(false);
    const {Title, Text} = Typography;
    const CardOutline = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    height: 100px;
    width: 500px;
    margin: 2%;
    border: 20px white solid;

    
    background: #FFFFFF;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 17px;
    `

    // function
    const sum = (items, prop) => {
        return items.reduce( function(a, b){
            return a + b[prop];
        }, 0);
    };
    const formatDate = (date)=>{
        var str1 = date.getMonth() + 1;
        var str2 = date.getDate();
        if(parseInt(date.getMonth() + 1) < 10){
            str1 = '0'+ (date.getMonth() + 1);
        }
        if(parseInt(date.getDate()) < 10){
            str2 = '0'+date.getDate();
        }
        let formatted_date = date.getFullYear() + "-" + str1 + "-" +str2;
        return formatted_date;
    }
    
    const [oweMemberInfo, setOweMemberInfo] = useState([])

    //陳沛妤: 這邊是每個任務的人指定日期的完成資訊，指定日期是selectedDate
    const [taskThreshold, setTaskThreshold] = useState(0)
    const [finishTaskMemberInfo, setFinishTaskMemberInfo] = useState([])
    const [unfinishTaskMemberInfo, setUnfinishTaskMemberInfo] = useState([])

    //總欠款: 接memberInfo的時候要加總
    const [totalArrear, setTotalArrear] = useState(sum(oweMemberInfo, "Punish_sum"));
    const [isMgr, setIsMgr] = useState(true);
    const [startDate, setStartDate]=  useState("");
    const [endDate, setEndDate]=  useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [achieveCount, setAchieveCount] = useState([0,0,0,0,0,0,0]);
    const [refresh, setRefresh] = useState(false);

    useEffect( async () => {
      const response = await getRecordPunish({task_id: taskId, token: token});
      console.log(response);
      var tem = []
      for(var i = 0; i < response.length; i++){
        var t = new Object();
        t.User_ID = response[i].User_ID;
        const r = await getUserInfo({user_id: response[i].User_ID})
        t.User_Name = r.Name;
        t.Avatar = r.Avatar;
        t.Punish_sum = response[i].Punish_Sum;
        tem[i] = t;
      }
      setOweMemberInfo(tem);
      setTotalArrear(sum(tem, "Punish_sum"));

      const res = await getParticipationDetail({user_id: userId, task_id: taskId});
      setIsMgr(res.Is_Admin);

      const res_2 = await getTaskDetail({task_id: taskId, token: token});
      setTaskThreshold(res_2.Threshold);

    }, [refresh]);

    useEffect( async () => {
      const res_3 = await getRecordDetail({task_id: taskId, token: token, time: selectedDate});
      console.log(res_3);
      var fin = [];
      var unfin = [];
      for(var i = 0; i < res_3.length; i++){
        if(res_3[i].boolean){
          var t = new Object();
          t.User_ID = res_3[i].User_ID;
          const r = await getUserInfo({user_id: res_3[i].User_ID})
          t.User_Name = r.Name;
          t.Avatar = r.Avatar;
          t.frequency = res_3[i].Frequency;
          fin.push(t);
        } else{
          var t = new Object();
          t.User_ID = res_3[i].User_ID;
          const r = await getUserInfo({user_id: res_3[i].User_ID})
          t.User_Name = r.Name;
          t.Avatar = r.Avatar;
          t.frequency = res_3[i].Frequency;
          unfin.push(t);
        }
      }
      setFinishTaskMemberInfo(fin);
      setUnfinishTaskMemberInfo(unfin);

      const res_4 = await getRecordCount({task_id:taskId, start_time: startDate, end_time: endDate, token: token});
      setAchieveCount(res_4);
    }, [selectedDate]);

    
    const handleEmtifiedFee = async () => {
        const res = await clearMoney({task_id: taskId, token: token});
        console.log(res);
        setRefresh(!refresh);
        message.success("已成功清空，祝大家有美好的一餐~");
        setOpenModal(false);
    }
    const weekOnChange = (date) => {
        // get start and end of the week
        console.log(formatDate(date));
        setSelectedDate(formatDate(date));
        let firstday = new Date(date.setDate(date.getDate() - date.getDay()));
        let lastday = new Date(date.setDate(date.getDate() - date.getDay()+6));

        // transform to assigned format
        setStartDate(formatDate(firstday)); 
        setEndDate(formatDate(lastday));

        console.log(formatDate(firstday),",", formatDate(lastday));
        // to 陳沛妤: 在這邊先接所有task資料，再一個個加總到achieveCount裡面QQ
    }


    const DemoColumn = () => {
        const data = [
          {
            type: 'Sun',
            sales: achieveCount[0],
          },
          {
            type: 'Mon',
            sales: achieveCount[1],
          },
          {
            type: 'Tue',
            sales: achieveCount[2],
          },
          {
            type: 'Wed',
            sales: achieveCount[3],
          },
          {
            type: 'Thur',
            sales: achieveCount[4],
          },
          {
            type: 'Fri',
            sales: achieveCount[5],
          },
          {
            type: 'Sat',
            sales: achieveCount[6],
          },
        ];
        const config = {
          data,
          xField: 'type',
          yField: 'sales',
          columnWidthRatio: 0.8,
          xAxis: {
            label: {
              autoHide: true,
              autoRotate: false,
            },
          },
          meta: {
            type: {
              alias: '星期',
            },
            sales: {
              alias: '打卡完成人數',
            },
          },
        };
        return <Column {...config} />;
      };


    return(
        <>
            <CardOutline onClick={() => setOpenModal(!openModal) } style={{cursor: 'pointer'}}>
                <Statistic title="累積金額 (NTD)" value={totalArrear} precision={0} />
            </CardOutline>
            <Modal 
                title="成員款項貢獻紀錄" 
                visible={openModal} 
                onCancel={() => setOpenModal(false)}
                footer={isMgr ? [<Button type="primary" onClick={() => handleEmtifiedFee()}>清空</Button>] : []} 
            >
                <List
                    itemLayout="horizontal"
                    dataSource={oweMemberInfo}
                    renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                        avatar={<Avatar src={item.Avatar} />}
                        title={<Text >{item.User_Name}</Text>}
                        description={<Text >{item.Punish_sum}</Text>}
                        />
                    </List.Item>
                    )}
                />
                {/* <Divider ></Divider> */}
            </Modal>
            <DatePicker defaultValue={moment()} onChange={(e) => weekOnChange(e._d)} picker="week" allowClear={false}/>
            <DemoColumn />
            <Row>
                <Col span={12}>
                    <Row>
                        <Icon icon="flat-ui:trash" color="black" height="50" />
                        <Title level={3}>未完成</Title>
                    </Row>
                    <List
                    itemLayout="horizontal"
                    dataSource={unfinishTaskMemberInfo}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                            avatar={<Avatar src={item.Avatar} />}
                            title={<Text >{item.User_Name}</Text>}
                            description={<Text >{item.frequency}次</Text>}
                            />
                        </List.Item>
                    )}
                />
                </Col>
                <Col span={12}>
                    <Row>
                        <Icon icon="emojione:1st-place-medal" color="black" height="50" />
                        <Title level={3}>已完成</Title>
                    </Row>
                    <List
                    itemLayout="horizontal"
                    dataSource={finishTaskMemberInfo}
                    renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                        avatar={<Avatar src={item.Avatar} />}
                        title={<Text >{item.User_Name}</Text>}
                        description={<Text >{item.frequency}次</Text>}
                        />
                    </List.Item>
                    )}
                />
                </Col>
            </Row>
            
        </>
    )
}

export default TaskStats;