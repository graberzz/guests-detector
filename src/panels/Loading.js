import React from 'react'
import { Panel, ScreenSpinner } from '@vkontakte/vkui'

const Loading = ({ id }) => (
    <Panel id={id}>
        <ScreenSpinner />
    </Panel>
)

export default Loading