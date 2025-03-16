import { Breadcrumb, Card, Segmented, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import unlockApi from '../../api/unlockApi.js';
import { useCookies } from 'react-cookie';
import { DeleteFilled, DeleteOutlined, DeleteTwoTone, DollarOutlined, DollarTwoTone, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

const Revenue = () => {
    const [period, setPeriod] = useState('day');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['accessToken', 'userRole', 'userId', 'refreshToken']);
    const userId = cookies.userId
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const breadcrumbItems = [{
        title: 'Dashboard',
        href: '/dashboard/main'
    },
    {
        title: 'Revenue'
    }
    ]

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await unlockApi.getUnlocksByCreator({
                creatorId: userId,
                period,
                page: pagination.current,
                limit: pagination.pageSize,
                sortBy: 'date',
                sortDirection: 'desc'
            });
            console.log('API Response:', result);

            setData(result.data);
            setPagination({
                ...pagination,
                total: result.pagination.totalItems,
            });
        } catch (error) {
            console.error('Error details:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) {
            console.error('User ID not found in cookies');
            return;
        }
        fetchData();
    }, [period, pagination.current, pagination.pageSize]);


    const handlePeriodChange = (value) => {
        setPeriod(value);
        setPagination({ ...pagination, current: 1 });
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text, record) => {
                switch (period) {
                    case 'day':
                        return text ? moment(text).format('DD/MM/YYYY') : 'N/A';
                    case 'week':
                        const startDate = record.startDate ? moment(record.startDate).format('DD/MM/YYYY') : 'N/A';
                        const endDate = record.endDate ? moment(record.endDate).format('DD/MM/YYYY') : 'N/A';
                        const weekNumber = record.week ? parseInt(record.week.split('-')[1], 10) : 'N/A';
                        return `Week ${weekNumber} (${startDate} - ${endDate})`;
                    case 'month':
                        return text ? moment(text).format('MMMM YYYY') : 'N/A';
                    default:
                        return text;
                }
            }
        },
        {
            title: 'Stories',
            dataIndex: 'storyNames',
            key: 'storyNames',
            render: (storyNames) => storyNames.join(', '),
        },
        {
            title: 'Revenue',
            dataIndex: 'total',
            key: 'total',
            render: (value) => (
                <span>
                    <DollarTwoTone twoToneColor='#ffc107' />
                    {` ${value.toLocaleString()}`}
                </span>
            ),
            sorter: (a, b) => a.total - b.total,
        },
        {
            title: 'Transactions',
            dataIndex: 'transactions',
            key: 'transactions',
            render: (transactions) => transactions.length,
        },
    ];

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <Card
                title="Revenue"
                extra={
                    <Segmented
                        options={[
                            { label: 'Day', value: 'day' },
                            { label: 'Week', value: 'week' },
                            { label: 'Month', value: 'month' },
                        ]}
                        value={period}
                        onChange={handlePeriodChange}
                    />
                }
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={(record) => record.transactions[0]._id}
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} mục`,
                    }}
                    onChange={(newPagination) => {
                        setPagination({
                            ...pagination,
                            current: newPagination.current,
                            pageSize: newPagination.pageSize,
                        });
                    }}
                />
            </Card>
        </div>
    )
}

export default Revenue
