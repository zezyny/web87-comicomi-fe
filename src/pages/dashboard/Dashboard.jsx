import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Layout, Card, Table, Pagination, Breadcrumb } from 'antd';
import transactionApi from '../../api/transactionApi.js';

const { Content } = Layout;

const Dashboard = () => {
    const [unlockChartData, setUnlockChartData] = useState([]);
    const [withdrawChartData, setWithdrawChartData] = useState([]);
    const [depositChartData, setDepositChartData] = useState([]);

    const breadcrumbItems = [{
        title: 'Dashboard',
        href: '/dashboard/main'
    }
    ]

    const getPast12Months = () => {
        const today = new Date();
        const past12Months = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            past12Months.push({ date: `${month}/${year}`, totalAmount: 0 });
        }
        return past12Months;
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const unlockData = await transactionApi.getTransactions({ transactionType: 'unlock' });
                const withdrawData = await transactionApi.getTransactions({ transactionType: 'withdraw' });
                const depositData = await transactionApi.getTransactions({ transactionType: 'deposit' });

                const defaultData = getPast12Months();

                const mergeData = (apiData) => {
                    const merged = defaultData.map(item => {
                        const apiItem = apiData.find(apiItem => apiItem._id === item.date);
                        return apiItem ? { date: apiItem._id, totalAmount: apiItem.totalAmount } : item;
                    });
                    return merged;
                };

                setUnlockChartData(mergeData(unlockData));
                setWithdrawChartData(mergeData(withdrawData));
                setDepositChartData(mergeData(depositData));
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <Layout>
                <Content style={{ padding: '20px' }}>
                    <Card title="Unlock">
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={unlockChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Line type="monotone" dataKey="totalAmount" stroke="#ff7300" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card title="Withdraw" style={{ marginTop: 20 }}>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={withdrawChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Line type="monotone" dataKey="totalAmount" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card title="Deposit" style={{ marginTop: 20 }}>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={depositChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Content>
            </Layout>
        </div>
    )
}

export default Dashboard