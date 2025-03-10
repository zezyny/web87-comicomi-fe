import { Flex, Pagination } from 'antd'
import React from 'react'
import FavoriteCard from './FavoriteCard'

const FavoriteCardList = (props) => {
    const favorites = props.favorites
    const pagination = props.pagination
    return (
        <div>
            <Flex
                justify='flex-start'
                wrap
                gap='2.5%'
            >
                {favorites?.map((item) => (
                    <FavoriteCard key={item.id} {...item} />
                ))}
            </Flex>
            <Pagination
                align='center'
                total={pagination?.totalItems}
                current={pagination?.currentPage}
                style={{
                    marginTop: '20px'
                }}
            />
        </div>
    )
}

export default FavoriteCardList