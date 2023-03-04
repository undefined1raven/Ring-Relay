import { useEffect, useState } from 'react';
import ChatCard from '../components/ChatCard.js'
import Label from '../components/Label.js'
import GenericLoadingDeco from '../components/GenericLoadingDeco.js'
import axios from 'axios';


function Chats(props) {
    const [refs, setRefs] = useState({ ini: false, arr: [] });
    let demo = [{ name: 'MCRN 3rd Jupi Fleet', msg: 0, status: 'Offline', since: '45 min ago' },
    { name: 'MCRN Home Fleet', msg: 3, status: 'Online', since: '' }];

    const getChatList = () => {
        return refs.arr.map(x => <li onClick={() => { props.onChatSelected(x.name) }} key={x.name + Math.random()} className='chatCardListContainer'><ChatCard obj={{ ...x }}></ChatCard></li>)
    }

    useEffect(() => {
        if (!refs.ini) {
            axios.post(`https://ring-relay-api-prod.vercel.app/api/dbop?getRefs=0`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(res => {
                setRefs({ ini: true, arr: res.data.refs });
            })
        }
        getChatList();
    }, [refs])

    if (props.show) {

        return (
            <div>
                <ul id="chatsContainer">
                    {getChatList()}
                </ul>
                <Label className="chatsFetchingLabel" id="chatsFetchingLabel" bkg="#6100DC30" color="#E09FFF" fontSize="2.3vh" show={!refs.ini} text="Fetching"></Label>
                <GenericLoadingDeco id="chatsFetchingDeco" show={!refs.ini} pathCN="chatsFetchingDecoElm"></GenericLoadingDeco>
            </div>
        )
    } else {
        return ''
    }
}

export default Chats;