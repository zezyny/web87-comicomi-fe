import React, { useEffect, useState } from 'react'

import userApi from '../../api/userApi.js'
import { useNavigate, useSearchParams } from 'react-router-dom'


const UserManagement = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const keyword = searchParams.get('keyword') ?? ''
    const page = searchParams.get("page") ?? 1;
    const pageSize = searchParams.get("pageSize") ?? 10;

    const [userData, setUserData] = useState({
        users: [],
        total: 0
    })

    const navigate = useNavigate()

    const changePage = (page, pageSize) => {
        setSearchParams({
            keyword,
            page,
            pageSize
        })
    }

    const fetchUsers = async () => {
        const response = await userApi.getUsers({
            keyword,
            page,
            pageSize,
            orderBy: "createdAt",
            orderDirection: "desc",
        })
        const newUserData = {
            users: response.data.users.map((user) => ({
                ...user,
            })),
            total: response.data.total
        }
        setUserData(newUserData)
    }

    useEffect(() => {
        fetchUsers()
    }, [keyword, page, pageSize])
    console.log(userData);


    return (
        <div>
            789
        </div>
    )
}

export default UserManagement