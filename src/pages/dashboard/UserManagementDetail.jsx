import { Avatar, Breadcrumb, Descriptions, Flex, Typography } from 'antd'
import React, { Children, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import userApi from '../../api/userApi.js'
import { DollarTwoTone } from '@ant-design/icons';
import { useCookies } from 'react-cookie';
import favoriteApi from '../../api/favoriteApi.js';
import FavoriteCardList from '../../components/favorite/FavoriteCardList.jsx';


const UserManagementDetail = () => {
    const [cookies] = useCookies(['accessToken', 'userRole', 'userId', 'refreshToken'])
    const { id } = useParams()
    const [viewingUser, setViewingUser] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [viewingUserFavorite, setViewingUserFavorite] = useState([])
    const fetchViewingUserFavorite = async (id) => {
        const response = await favoriteApi.getFavoriteById(id)
        setViewingUserFavorite(response.data)
    }
    useEffect(() => {
        fetchViewingUserFavorite(id)
    }, [id])
    const fetchCurrentUser = async (id) => {
        const response = await userApi.getUser(id)
        setCurrentUser(response.data)
    }

    useEffect(() => {
        fetchCurrentUser(cookies.userId);

    }, [cookies.userId]);
    const fetchViewingUser = async (id) => {
        const response = await userApi.getUser(id)
        setViewingUser(response.data)
    }
    useEffect(() => {
        fetchViewingUser(id);
    }, [id]);
    console.log(viewingUserFavorite);

    const breadcrumbItems = [{
        title: 'Dashboard',
        href: '/dashboard/main'
    },
    {
        title: 'User Management',
        href: '/dashboard/users'
    },
    {
        title: viewingUser?.userName
    }
    ]

    const descItems = [
        {
            key: 'name',
            label: 'Username',
            children: viewingUser?.userName
        },
        {
            key: 'email',
            label: 'Email',
            children: viewingUser?.email
        },
        {
            key: 'role',
            label: 'Role',
            children: viewingUser?.role
        },
        {
            key: 'wallet',
            label: 'Wallet',
            children: <div><DollarTwoTone twoToneColor='#ffc107' /> {viewingUser?.wallet}</div>
        },
        {
            key: 'createdAt',
            label: 'Joined Date',
            children: viewingUser?.createdAt
        },
    ]
    if (!currentUser) {
        return <div>Loading...</div>
    }
    if (currentUser.role.toLowerCase() !== 'admin') {
        return (
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={
                    <Button type="primary" onClick={() => navigate('/dashboard/main')}>
                        Back to Dashboard
                    </Button>
                }
            />
        );
    }
    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <Typography.Title level={3}>{viewingUser?.userName}'s Profile</Typography.Title>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', marginTop: '20px', marginBottom: '20px' }}>
                <Flex>
                    <Avatar src={viewingUser?.avatar} />
                    <Descriptions items={descItems}>

                    </Descriptions>
                </Flex>
            </div>
            <Typography.Title level={3}>{viewingUser?.userName}'s Favorite List</Typography.Title>
            <FavoriteCardList {...viewingUserFavorite} />
        </div>
    )
}

export default UserManagementDetail