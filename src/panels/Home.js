import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Cell, Group, Avatar, PanelHeader, List, Button, Checkbox } from '@vkontakte/vkui';
import Icon24Copy from '@vkontakte/icons/dist/24/copy';

const Home = ({ id, go, fetchedUser, copied, shortLink = null, onLinkCopy, stalkers, checkboxDisabled, toAdmin, isAdmin, notify, onNotifyChange }) => (
	<Panel id={id}>
		<PanelHeader>МОИ СТАЛКЕРЫ</PanelHeader>
		{ isAdmin && <Button size="xl" level="secondary" style={{ marginTop: 10 }} onClick={toAdmin}>Админ-панель</Button> }
		{fetchedUser &&
		<Group title="Вставь эту ссылку куда-нибудь себе на страницу">
			<Cell
				before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
				description={copied ? 'Скопировано!' : null}
				asideContent={<Icon24Copy />}
				onClick={onLinkCopy}
			>
				{ shortLink || `https://vk.com/app6884076#${fetchedUser.id}` }
			</Cell>
			<Checkbox checked={notify} disabled={checkboxDisabled} onChange={onNotifyChange}>Получать уведомления о новых посещениях</Checkbox>
		</Group>}

		<Group title="Твои сталкеры">
		<List>
			{stalkers
			  .sort((s1, s2) => s2.ts - s1.ts)
              .map((stalker, i) => (
				<a key={i} style={{ textDecoration: 'none' }} target="_blank" href={`https://vk.com/id${stalker.id}`}>
					<Cell
					before={<Avatar src={stalker.photo_200} size={40} />}
					description={new Date(stalker.ts).toLocaleString()}
					>
					{stalker.first_name + ' ' + stalker.last_name}
					</Cell>
				</a>
              ))}
          </List>
		</Group>
	</Panel>
);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
