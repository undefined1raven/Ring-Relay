import { useEffect, useState } from 'react';
import ChatCard from '../components/ChatCard.js'
import Label from '../components/Label.js'
import GenericLoadingDeco from '../components/GenericLoadingDeco.js'
import AuthedMsgDeco from '../components/AuthedMsgDeco.js'
import NotAuthedMsgDeco from '../components/NotAuthedMsgDeco.js'
import Button from '../components/Button.js'


function Chats(props) {
    const [startPosition, setStartPosition] = useState(0)

    let demo = [{ name: 'MCRN 3rd Jupi Fleet', msg: 0, status: 'Offline', since: '45 min ago' },
    { name: 'MCRN Home Fleet', msg: 3, status: 'Online', since: '' }];

    const getChatList = () => {
        return props.refs.arr.map(x => <li onClick={() => { props.onChatSelected(x.uid) }} key={x.name + Math.random()} className='chatCardListContainer'><ChatCard obj={{ ...x }}></ChatCard></li>)
    }

    const keyStatusLabelController = () => {
        if (props.keyStatus.ini) {
            if (props.keyStatus.found) {
                if (props.keyStatus.valid) {
                    return { label: 'Valid Private Keys', color: '#00FFD1' };
                } else {
                    return { label: 'Invalid Private Keys', color: '#FF002E' };
                }
            } else {
                return { label: 'Private Keys Not Found', color: '#FF002E' };
            }
        } else {
            return { label: '[Checking Private Keys]', color: '#0057FF' };
        }
    }

    const keyStatusDecoController = () => {
        if (keyStatusLabelController().color != '#0057FF' && !props.refs.ini) {
            if (keyStatusLabelController().color == '#00FFD1') {
                return <AuthedMsgDeco bkgOpacity="0" id="privateKeyStatusAuthedDeco"></AuthedMsgDeco>
            } else {
                return <NotAuthedMsgDeco bkgOpacity="0" id="privateKeyStatusAuthedDeco"></NotAuthedMsgDeco>
            }
        }
    }

    const onRefresh = () => {
        if (!props.refreshing) {
            props.onRefresh();
        }
    }

    useEffect(() => {
        getChatList();
    }, [props.refs.ini])

    if (props.show) {
        return (
            <div>
                <ul id="chatsContainer">
                    {getChatList()}
                    {(props.refs.ini && props.refs.arr.length > 0) ? <li style={{ marginLeft: '20%' }}><Button onClick={onRefresh} style={{ borderRadius: '5px', transition: 'all linear 0.1s', transition: 'color ease-in 0.25s', border: `${props.refreshing ? 'none' : 'solid 1px #5600C1'}` }} bkg={props.refreshing ? '#001AFF' : "#5600C1"} width="60%" height="6%" label={props.refreshing ? '[Refreshing]' : "Refresh"} color={props.refreshing ? '#001AFF' : "#5600C1"}></Button></li> : ''}
                </ul>
                <Label className="chatsFetchingLabel" id="chatsFetchingLabel" bkg="#6100DC30" color="#E09FFF" fontSize="2.3vh" show={!props.refs.ini} text="[Fetching Data]"></Label>
                <Label id="privateKeyStatusLabel" bkg={`${keyStatusLabelController().color}30`} color={keyStatusLabelController().color} show={!props.refs.ini} fontSize="2.1vh" text={keyStatusLabelController().label}></Label>
                <Label fontSize="2.5vh" show={props.refs.arr.length == 0 && props.refs.ini} id="noConvosLabel" bkg="#001AFF30" color="#001AFF" text="[No Conversations]"></Label>
                <Button onClick={props.switchToNewContactSection} fontSize="2.2vh" show={props.refs.arr.length == 0 && props.refs.ini} id="noConvosButton" bkg="#001AFF30" color="#001AFF" label="Add New Contact"></Button>
                {keyStatusDecoController()}
                <GenericLoadingDeco id="chatsFetchingDeco" show={!props.refs.ini} pathCN="chatsFetchingDecoElm"></GenericLoadingDeco>
            </div>
        )
    } else {
        return ''
    }
}

export default Chats;