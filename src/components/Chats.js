import ChatCard from '../components/ChatCard.js'


function Chats(props) {

    let demo = [{ name: 'MCRN 3rd Jupi Fleet', msg: 0, status: 'Offline', since: '45 min ago' },
    { name: 'MCRN Home Fleet', msg: 3, status: 'Online', since: '' }];

    const getChatList = () => {
        return demo.map(x => <li onClick={() => { props.onChatSelected(x.name) }} key={x.name + Math.random()} className='chatCardListContainer'><ChatCard obj={{ ...x }}></ChatCard></li>)
    }
    if (props.show) {

        return (
            <ul id="chatsContainer">
                {getChatList()}
            </ul>
        )
    } else {
        return ''
    }
}

export default Chats;