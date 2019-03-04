import React from 'react'

import { Panel, List, Cell } from '@vkontakte/vkui'
import * as api from '../api'
import Loading from './Loading'

export class Admin extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            victims: {},
            fetching: false
        }
    }
    
    componentDidMount() {
        this.fetchVictims()
    }

    fetchVictims() {
        this.setState({ fetching: true }, async () => {
            const victims = await api.getAllStalkersByVictim()

            this.setState({ victims, fetching: false })
        })
    }

    render() {
        const { fetching, victims } = this.state
        const { id, isAdmin } = this.props

        if (fetching || !isAdmin) {
            return <Loading id={id} />
        }

        const victimIds = Object.keys(victims)

        return (
            <Panel id={id}>
                <List>
                    {
                        victimIds.map(id => <Cell key={id}>{ id } : { victims[id].map(({ id }) => id).join(' ') }</Cell>)
                    }
                </List>
            </Panel>
        )
    }
}

export default Admin
