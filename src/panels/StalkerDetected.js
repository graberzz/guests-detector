import React from 'react';
import {Panel, Button, ScreenSpinner } from '@vkontakte/vkui';
import './StalkerDetected.css'


const StalkerDetected = ({ id, go, stalker, triedToClose, onClose }) => (
    <Panel id={id}>
        {
            !stalker ? <ScreenSpinner /> :
            <div className="StalkerDetected" style={{ backgroundImage: `url(${stalker.photo_max_orig})` }}>
                <div className="StalkerDetected__content">
                    <h1 className="StalkerDetected__heading">АГА, { stalker.sex === 2 ? 'ПОПАЛСЯ' : 'ПОПАЛАСЬ' }, { stalker.first_name.toUpperCase() }!</h1>
                    <p className="StalkerDetected__paragraph">Сталкерим значит?.. Возьмем тебя на карандаш... А теперь ступай...</p>
                    <Button size="xl" disabled={triedToClose} style={{ marginBottom: 10 }} onClick={onClose}>{ triedToClose ? 'Кнопка не работает, ищи выход справа сверху...' : 'Смиренно уйти...'}</Button>                
                    <Button size="xl" onClick={go} data-to="home">Я тоже хочу брать на карандаш!</Button>
                </div>
            </div>
        }
    </Panel>
)


export default StalkerDetected
