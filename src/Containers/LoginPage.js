import { Form, Input, Button, message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { login } from '../axios';
import styled from 'styled-components';

const LoginPage = ({setValid, setIsLogin, setToken, userId, setUserId}) => {
    // let history = useHistory();
    
    const[password, setPassword] = useState("");

    
    const handleLogin = async () => {
        if(userId !== "" && password!==""){
            const response = await login({user_id: userId, password: password});
            console.log(response);
            if(response == false){
                message.error("the password is wrong.");
                return;
            }
            setToken(response);
            setIsLogin(true);
            setValid(true);
        }

    }

    
    return (
        <div className="default_background">
            <h1 className="login_title">HABITRA</h1>
            <div className="login_page">
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{remember: true,}}
                >
                    <Form.Item
                        name="userId"
                        rules={[
                        {
                            required: true,
                            message: '請輸入使用者帳號!',
                        },
                        ]}
                    >
                        <Input style={{ width: "30vw" }} size="large"  prefix={<UserOutlined className="site-form-item-icon" />} value = {userId} placeholder="UserId" onChange={(e) => setUserId(e.target.value)}/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                        {
                            required: true,
                            message: '請輸入密碼!',
                        },
                        ]}
                    >
                        <Input
                            style={{ width: "30vw" }}

                            prefix={<LockOutlined className="site-form-item-icon" />}
                            size="large" 
                            type="password"
                            placeholder="Password"
                            value = {password}
                            onChange = {(e) => setPassword(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button block type="primary" htmlType="submit" className="wide-form-button" onClick={handleLogin}>
                            Login
                        </Button>
                    </Form.Item>
                    Don't have an Account?  <Link to="/signUp">Sign Up</Link>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage