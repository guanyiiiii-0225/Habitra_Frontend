// 這...這個還沒...我考完試再來寫（大概四點多）
import { DatePicker, Space, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';
import { Column } from '@ant-design/plots';
import StatsInfoCard from '../Components/StatsInfoCard';
import { getDurationOpen, getPeriodRecord, getTaskDetail, getTask } from '../axios';
import moment from 'moment';

const PersonalStats = ({userId, token}) => { 

  
    // default settings
    const {Title} = Typography;
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

    var today = new Date();
    // to 陳沛妤: variables
    const [startDate, setStartDate] = useState(formatDate(today));
    const [endDate, setEndDate] = useState(formatDate(new Date(today.setDate(today.getDate() - today.getDay()+6))));
    
    // task list
    const [task, setTask] = useState([]);
    // total statistic list 在接的時候加總
    const [achieveCount, setAchieveCount] = useState([0,0,0,0,0,0,0]);
    // to 陳沛妤: 這邊是每周應打卡次數，你也可以取一個好聽一點的名字
    const [expectedTotalCount, setExpectedTotalCount] = useState(0);
    
    useEffect( async () => {
      const response = await getDurationOpen({user_id: userId, start_time: startDate, token: token, end_time: endDate});
      console.log(response);
      var temp = []; //多組arr
      var count = 0;
      for(var i = 0; i < response.length; i++){
          const res = await getPeriodRecord({user_id: userId, task_id: response[i].Task_ID, start_time: startDate, end_time: endDate, token: token});
          console.log(res);
          temp[i] = res[0];
          setTask([...task, response[i].Task_ID]);

          const r = await getTask({task_id: response[i].Task_ID, token: token});
          var s = 0;
          for(var k = 0; k < 7; k++){
            s += r.Working_Day[k]
          }

          const res_2 = await getTaskDetail({task_id: response[i].Task_ID, token: token});
          count += res_2.Threshold*s;
      }
      setExpectedTotalCount(count);
      var final = [0,0,0,0,0,0,0]; //一組arr
      for(var i = 0; i < temp.length; i++){
        for(var j = 0; j < 7; j++){
          final[j] += temp[i][j];
        }
      }
      setAchieveCount(final);
      
    }, [startDate]);
  
    // function
    const weekOnChange = (date) => {
        // get start and end of the week
        let firstday = new Date(date.setDate(date.getDate() - date.getDay()));
        let lastday = new Date(date.setDate(date.getDate() - date.getDay()+6));

        // transform to assigned format
        setStartDate(formatDate(firstday)); 
        setEndDate(formatDate(lastday));

        // to 陳沛妤: 在這邊先接所有task資料，再一個個加總到achieveCount裡面QQ
    }

    // Component
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
              alias: '打卡完成次數',
            },
          },
        };
        return <Column {...config}  />;
      };
      function disabledDate(current) {
        // Can not select days before today and today
        return current && current > moment().endOf('day');
      }
    return(
        <div style={{marginRight: "5%"}}>
            <Title level={3}> 戰績檢視</Title>
            <StatsInfoCard achieveTotalCount={achieveCount.reduce((a, b) => a + b, 0)} expectedTotalCount={expectedTotalCount} />
            <Title level={3}> 一周統整</Title>
            <DatePicker defaultValue = {moment}onChange={(e) => weekOnChange(e._d)} picker="week" allowClear={false} disabledDate={disabledDate}/>
            <br/>
            <br/>
            <DemoColumn />
        </div>
        
    )
}

export default PersonalStats;



// GET /record/period/{user_id}/{task_id}/{start_time}/{end_time}  取得特定使用者某時間區間的特定任務的統計資訊
// param: user_id, task_id, start_time, end_time
// return: [frequency], [daily_desc]





