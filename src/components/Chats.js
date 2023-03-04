import { useEffect, useState } from 'react';
import ChatCard from '../components/ChatCard.js'
import Label from '../components/Label.js'
import GenericLoadingDeco from '../components/GenericLoadingDeco.js'


function Chats(props) {
    let demo = [{ name: 'MCRN 3rd Jupi Fleet', msg: 0, status: 'Offline', since: '45 min ago' },
    { name: 'MCRN Home Fleet', msg: 3, status: 'Online', since: '' }];

    const getChatList = () => {
        return props.refs.arr.map(x => <li onClick={() => { props.onChatSelected(x.uid) }} key={x.name + Math.random()} className='chatCardListContainer'><ChatCard obj={{ ...x }}></ChatCard></li>)
    }

    useEffect(() => {
        getChatList();
    }, [props.refs.ini])

    if (props.show) {

        return (
            <div>
                <ul id="chatsContainer">
                    {getChatList()}
                </ul>
                <Label className="chatsFetchingLabel" id="chatsFetchingLabel" bkg="#6100DC30" color="#E09FFF" fontSize="2.3vh" show={!props.refs.ini} text="Fetching"></Label>
                <GenericLoadingDeco id="chatsFetchingDeco" show={!props.refs.ini} pathCN="chatsFetchingDecoElm"></GenericLoadingDeco>
            </div>
        )
    } else {
        return ''
    }
}

export default Chats;