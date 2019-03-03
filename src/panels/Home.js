import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Cell, Group, Avatar, PanelHeader, List } from '@vkontakte/vkui';
import Icon24Copy from '@vkontakte/icons/dist/24/copy';

const Home = ({ id, go, fetchedUser, copied, onLinkCopy, stalkers }) => (
	<Panel id={id}>
		<PanelHeader>Главная</PanelHeader>
		{fetchedUser &&
		<Group title="Вставь эту ссылку куда-нибудь себе на страницу">
			<Cell
				before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
				description={copied ? 'Скопировано!' : null}
				asideContent={<Icon24Copy />}
				onClick={onLinkCopy}
			>
				{ `https://vk.com/app6884076#${fetchedUser.id}` }
			</Cell>
		</Group>}

		<Group title="Твои сталкеры">
		<List>
            {stalkers
              .map((stalker, i) => (
                <Cell
                  key={i}
                  before={<Avatar src={stalker.photo_200} size={40} />}
                  description={new Date(stalker.ts).toLocaleString()}
                >
                  {stalker.first_name + ' ' + stalker.last_name}
                </Cell>
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
