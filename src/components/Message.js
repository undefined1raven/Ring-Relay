
import MinLogo from '../components/MinLogo.js'
import InputField from '../components/InputField.js'
import Label from '../components/Label.js'
import VerticalLine from '../components/VerticalLine.js'
import Button from '../components/Button.js'
import BackDeco from '../components/BackDeco.js'
import { useEffect, useState } from 'react'
import NotAuthedMsgDeco from '../components/NotAuthedMsgDeco.js'
import MsgTXDeco from '../components/MsgTXDeco.js'
import MsgRXDeco from '../components/MsgRXDeco.js'
import AuthedMsgDeco from '../components/AuthedMsgDeco.js'

function Message(props) {
    return (
        <div>
            <Label className="msgContainer" color={props.msgObj.type == 'rx' ? '#FFF' : '#863DFF'} text={props.msgObj.content} fontSize="4.5vw" bkg="#6100DC20" child={
                <div>
                    <Label className="msgTime" bkg="#55007340" color="#8300B0" text={`${new Date(props.msgObj.tx).getHours().toString().padStart(2, '0')}:${new Date(props.msgObj.tx).getMinutes().toString().padStart(2, '0')}`} fontSize="2.5vw"></Label>
                    {props.msgObj.secure ?  <AuthedMsgDeco/> : <NotAuthedMsgDeco/>}
                    {props.msgObj.type == 'rx' ?  <MsgRXDeco/> : <MsgTXDeco/>}
                </div>
            }></Label>
        </div>
    )
}

export default Message;