

import styled from 'styled-components';
import { Layout, Typography, Button } from 'antd';
import { Icon } from '@iconify/react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useState } from 'react';



const TaskDescCard = ({done, desc, expectedFrequency, frequency}) => {
    // <Icon icon="twemoji:sad-but-relieved-face" color="black" height="50" />

    console.log(done);
    console.log("desc = ", desc);
    const CardOutline = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    height: 30%;
    width: 90%;
    margin-top: 2%;
    border: 20px white solid;

    
    background: #FFFFFF;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 17px;
 `  

    const finish = frequency / expectedFrequency >= 1 ? true : false;
    const temp = ["今天好快樂", "早上超冷，差點起不來QAQ"];
    const [infoKey, setInfoKey] = useState(0);
    const handleMinus = () => {
        if(infoKey === 0){
            setInfoKey(desc.length - 1);
        }
        else{
            const tt = infoKey - 1
            setInfoKey(tt);    
        }
    }
    const handlePlus = () => {
        if(infoKey === desc.length - 1){
            setInfoKey(0);
        }
        else{
            const tt = infoKey + 1
            setInfoKey(tt);    
        }
    }

    const { Text, Title } = Typography;
    return(
        <div style={{display: "flex", flexDirection:"row", alignItems: "center", justifyContent: "space-between"}}>
        
        <Button shape="circle" disabled={finish ? false : true} icon={<LeftOutlined />} onClick={handleMinus} />

        <CardOutline>
            {
                finish
                ?
                desc === null || desc === [""]
                ?
                <>
                    <Icon icon="twemoji:beaming-face-with-smiling-eyes" color="black" height="50" />
                    <Text>已完成任務！</Text>
                </>
                :
                <>
                    <Text>{desc[infoKey]}</Text>
                </>
                :
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Icon icon="twemoji:sad-but-relieved-face" color="black" height="50" />
                <br/>
                <Title level={5}>未完成打卡QAQ</Title>
                </div>

            }
        </CardOutline>
        
        <Button shape="circle" disabled={finish ? false : true} icon={<RightOutlined />}  onClick={handlePlus}/>


        </div>        
    )
}

export default TaskDescCard;

