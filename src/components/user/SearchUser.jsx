import React from "react";
import { Button, Form, Input } from "antd";

const KEYWORD_RULES = [
    {
        required: true,
        message: "Enter your keyword to search",
        whitespace: true,
    },
];

export function SearchUser(props) {
    const [searchForm] = Form.useForm();

    const searchUsers =
        props.searchUsers ?? ((values) => console.log(values));

    const resetForm = () => {
        searchUsers({ keyword: "" });
    };

    return (
        <div className="search-user">
            <Form layout="inline" form={searchForm} onFinish={searchUsers}>
                <Form.Item name="keyword" rules={KEYWORD_RULES}>
                    <Input size="large" placeholder="Enter keyword to search user" />
                </Form.Item>

                <Button type="primary" size="large" htmlType="submit">
                    Search
                </Button>

                <Button type="danger" size="large" htmlType="reset" onClick={resetForm}>
                    Clear
                </Button>
            </Form>
        </div>
    );
}