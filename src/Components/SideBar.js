import { Layout, Menu, Breadcrumb, Button, Avatar, Typography, Tooltip } from 'antd';
import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import {
    TeamOutlined,
    AreaChartOutlined,
    CaretLeftOutlined,
    FileOutlined,
    InfoCircleOutlined,
    BarChartOutlined,
    UserOutlined
  } from '@ant-design/icons';



const SideBar = ({setContentWidth,collapsed, setCollapsed, place, userId, userName, userAvatar, setValid, setPage, setToken}) => {
    let navigate = useNavigate();
    // const [collapsed, setCollapsed] = useState(false)
    const { Content, Sider } = Layout;
    const { SubMenu } = Menu;

    // Typology default setting
    const { Title } = Typography;
    setContentWidth(collapsed ? "8vw" : "20vw");
    return(
        <Sider theme="light" collapsible collapsed={collapsed} onCollapse={() => {setCollapsed(!collapsed);}}       
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 2
    }}>
      <div className="logo" />
      {/* Link FE待修正 */}
      {/* 頭貼 */}
      <div style={{ display:"flex", flexDirection: 'column', justifyContent:"center", margin: '24px', alignItems:"center"  }}>
        <Avatar size={collapsed ? 30 : 120} src={userAvatar}  />
        {collapsed
        ?
        <></>
        :
        <>
              <Title level={3}>
                {userName}
              </Title>
            <Button type="text" size='small' onClick={() => {setValid(false);setToken("");navigate("/login");}}>登出</Button>
        </>
        }
      </div>
      {
        place === 'mainPage'
        ?
        <Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">

        <Menu.Item key="1" icon={<TeamOutlined />} onClick={() => setPage(1)}>
            團隊任務
        </Menu.Item>
        <Menu.Item key="2" icon={<AreaChartOutlined />} onClick={() => setPage(2)}>
            統計資料
        </Menu.Item>
        <Menu.Item key="0" icon={<UserOutlined />} onClick={() => setPage(5)}>
            個人資料
        </Menu.Item>
      </Menu>
        :
        <>
          <Tooltip title="回到首頁" placement="right">
            {
              collapsed
              ?
              <></>
              :
              <Button style={{marginLeft: "10%", marginBottom: "5%"}}type="circle" icon={<CaretLeftOutlined />} size='small' onClick={() => {navigate('/')}}></Button> 

            }
          </Tooltip>
          <Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="1" icon={<FileOutlined />} onClick={() => setPage(1)}>
                任務主頁
            </Menu.Item>
            <Menu.Item key="2" icon={<InfoCircleOutlined />} onClick={() => setPage(2)}>
                詳細資訊
            </Menu.Item>
            <Menu.Item key="3" icon={<TeamOutlined />} onClick={() => setPage(3)}>
                成員清單
            </Menu.Item>
            <Menu.Item key="4" icon={<BarChartOutlined />} onClick={() => setPage(4)}>
                統計資訊
            </Menu.Item>
        </Menu>
        </>
      }

    </Sider>
    )

}

export default SideBar;