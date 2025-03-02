import React, { useState } from 'react'
import logo2 from '../../assets/logo2.png'
import logo1 from '../../assets/logo1.png'
import { Layout, Menu, Button, theme, Image, Breadcrumb, Dropdown, Flex, Typography } from "antd";
import {
    DashboardOutlined,
    UserOutlined,
    BookOutlined,
    DollarOutlined,
    CommentOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    ProfileOutlined,
    LogoutOutlined,
    CaretDownOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
const { Sider, Header, Content } = Layout;

const DashboardLayout = () => {
    let navigate = useNavigate()
    const location = useLocation()

    //fake user
    const user = {
        _id: '129038ádu',
        userName: 'Mr. Fantastic',
        email: 'admin@comicomi.vn',
        password: 'admin',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        salt: 'abc',
        role: 'Administrator',
        wallet: 9999
    }

    const pathSnippets = location.pathname.split("/").filter((i) => i)
    const breadcrumbItems = pathSnippets.map((snippet, index) => ({
        title: snippet.charAt(0).toUpperCase() + snippet.slice(1),
        key: index,
    }))

    const [collapsed, setCollapsed] = useState(false);
    const menuItems = [
        { key: "/dashboard/main", label: "Dashboard", icon: <DashboardOutlined /> },
        { key: "/dashboard/users", label: "Users", icon: <UserOutlined />, },
        { key: "/dashboard/stories", label: "Stories", icon: <BookOutlined /> },
        { key: "/dashboard/revenue", label: "Revenue", icon: <DollarOutlined /> },
        {
            key: "/dashboard/community",
            label: "Community",
            icon: <CommentOutlined />,
        },
    ];
    const items = [
        {
            key: 'menuLabel',
            label: 'My Account',
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: 'profile',
            label: 'Profile',
            icon: <ProfileOutlined />
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />
        }
    ]
    return (
        <Layout>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{ height: '100vh', position: 'sticky' }}
                theme='light'
            >
                <img src={collapsed ? logo2 : logo1} style={{ width: '100%', padding: '20px', marginBottom: '70px', transition: 'opacity 1s ease-in-out' }} />
                <Menu items={menuItems} mode='inline' onClick={({ key }) => navigate(key)} />
            </Sider>
            <Layout>
                <Header
                    style={{ backgroundColor: '#445489', paddingRight: '20px', paddingLeft: 0 }}
                >
                    <Flex justify='space-between' align='center'>
                        <Flex align='center'>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                    color: '#fff',
                                    borderRadius: '50%'
                                }}
                            />
                            <Breadcrumb items={[...breadcrumbItems]} />
                        </Flex>
                        <Dropdown menu={{ items, }} >
                            <Flex align='center' gap={10}>
                                <img src={user.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                <Flex vertical >
                                    <Typography.Text strong style={{ color: '#fff' }}>{user.userName}</Typography.Text>
                                    <Typography.Text style={{ color: '#fff' }}>{user.role}</Typography.Text>
                                </Flex>

                                <Typography.Text style={{ color: '#fff' }}><CaretDownOutlined /></Typography.Text>
                            </Flex>
                        </Dropdown>
                    </Flex>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflowX:"hidden",
                        overflowY:"auto"
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}

export default DashboardLayout