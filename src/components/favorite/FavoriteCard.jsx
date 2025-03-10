import { Card } from 'antd'
import Meta from 'antd/es/card/Meta'
import React from 'react'

const FavoriteCard = (props) => {
    return (
        <div style={{ width: '18%', marginTop: '10px' }}>
            <Card
                style={{ height: 400 }}
                cover={
                    <img src={props.img} style={{ height: 300, objectFit: 'contain', margin: 'auto' }} />
                }
            >

                <Meta
                    title={props.title}
                    description={props.author}
                />
            </Card>
        </div>
    )
}

export default FavoriteCard