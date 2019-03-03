import React from 'react';
import PropTypes from 'prop-types';
import {Panel, PanelHeader, HeaderButton, platform, IOS} from '@vkontakte/vkui';
import persik from '../img/persik.png';
import './Persik.css';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

const osname = platform();

const Visitors = ({ id, go, visitors }) => (
    <Panel id={id}>
        <PanelHeader
            left={<HeaderButton onClick={go} data-to="home">
                {osname === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
            </HeaderButton>}
        >
            МОИ СТАЛКЕРЫ
        </PanelHeader>
        <List>
            { visitors.map(visitor => <Cell before={<Avatar />}>visitor</Cell>)}
        </List>
    </Panel>
)

export default Persik;
