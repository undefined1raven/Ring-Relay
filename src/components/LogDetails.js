import Label from './Label';
import Button from '../components/Button.js'
import BackDeco from '../components/BackDeco.js'
import { useEffect, useState } from 'react';


function LogDetails(props) {

    const dateFormatter = () => {
        let date = new Date(props.logObj.tx);
        let splittedDate = date.toString().split(' ');
        return { date: splittedDate[0] + ' ' + splittedDate[1] + ' ' + splittedDate[2] + ' ' + splittedDate[3], time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}` }
    }

    const sessionDetailsController = () => {
        if (props.logObj?.details?.session != undefined) {
            if (props.logObj.details?.session) {
                return { status: true, label: 'Authorized', color: '#00FFD1' }
            } else {
                return { status: false, label: 'Revoked', color: '#FF002E' }
            }
        } else {
            return { status: false, label: 'Unknown', color: '#9B9B9B' }
        }
    }

    const exportDetailsController = () => {
        if (props.logObj?.details?.PKShareType != undefined) {
            var actionTypeLabel = props.logObj?.details?.PKShareType.type == 'import' ? 'Import' : 'Export'
            if (props.logObj.details?.PKShareType.method == 'scan') {
                return { label: 'QR Code Scan', type: actionTypeLabel }
            } else {
                if (actionTypeLabel == 'Import') {
                    return { label: 'File Upload', type: actionTypeLabel }
                } else {
                    return { label: 'File Download', type: actionTypeLabel }
                }
            }
        } else {
            return { label: 'Unknown', type: actionTypeLabel }
        }
    }

    if (props.show) {
        return (
            <div className="logDetailsContainer">
                <Label className="logDetailsTitle" bkg="#7000FF20" fontSize="2vh" color="#FFF" text={`${props.logObj.type}.${props.logObj.subtype}`}></Label>
                <Button color="#7000FF" bkg="#7000FF" child={<BackDeco style={{ width: "29%" }} color="#7000FF" />} className="logDetailsBackBtn" onClick={props.onBack}></Button>
                <Label fontSize="1.9vh" color="#BABABA" bkg="#6300E020" className="logDetailTypeLabel" style={{ top: '43.59375%', height: '6.09375%' }} text="Time and date"></Label>
                <Label fontSize="1.9vh" color="#FFF" bkg="#6300E020" className="logDetailActual" style={{ top: '43.59375%', height: '3.79375%', paddingBottom: '5%' }} text={dateFormatter().date}></Label>
                <Label fontSize="1.9vh" color="#FFF" className="logDetailActual" style={{ top: '45.99375%', height: '3.79375%' }} text={dateFormatter().time}></Label>
                <Label fontSize="1.9vh" color="#FFF" className="logDetailActual" bkg="#7000FF20" style={{ top: 'calc(43.59375% + (1 * 7%))', height: '6.09375%' }} text={props.logObj.details.device[0].toString().toUpperCase() + props.logObj.details.device.toString().substring(1, props.logObj.details.device.toString().length)}></Label>
                <Label fontSize="1.9vh" color="#FFF" className="logDetailActual" bkg="#7000FF20" style={{ top: 'calc(43.59375% + (2 * 7%))', height: '6.09375%' }} text={props.logObj.details.browser}></Label>
                <Label fontSize="1.9vh" color="#FFF" className="logDetailActual" bkg="#7000FF20" style={{ top: 'calc(43.59375% + (3 * 7%))', height: '6.09375%' }} text={props.logObj.details.os}></Label>
                <Label fontSize="1.9vh" color="#FFF" className="logDetailActual" bkg="#7000FF20" style={{ top: 'calc(43.59375% + (4 * 7%))', height: '6.09375%' }} text={props.logObj.ip}></Label>
                <Label fontSize="1.9vh" color="#FFF" className="logDetailActual" bkg="#7000FF20" style={{ top: 'calc(43.59375% + (5 * 7%))', height: '6.09375%' }} text={props.logObj.location.name}></Label>
                <Label fontSize="1.9vh" color={sessionDetailsController().color} className="logDetailActual" bkg={`${sessionDetailsController().color}20`} show={props.logObj.subtype == 'Log In'} style={{ top: 'calc(43.59375% + (6 * 7%))', height: '6.09375%' }} text={sessionDetailsController().label}></Label>
                <Label fontSize="1.9vh" color="#FFF" className="logDetailActual" bkg="#7000FF20" show={props.logObj.subtype == 'Keys Import' || props.logObj.subtype == 'Keys Export'} style={{ top: 'calc(43.59375% + (6 * 7%))', height: '6.09375%' }} text={exportDetailsController().label}></Label>

                <Button show={props.logObj.subtype == 'Log In' && sessionDetailsController().status} width="90%" height="6.125%" style={{ left: '5%', top: '92.65625%', borderRadius: '5px' }} label="Revoke" color="#FF002E" bkg="#FF002E"></Button>

                <Label fontSize="1.9vh" color="#BABABA" bkg="#6300E020" className="logDetailTypeLabel" style={{ top: 'calc(43.59375% + (1 * 7%))', height: '6.09375%' }} text="Device"></Label>
                <Label fontSize="1.9vh" color="#BABABA" bkg="#6300E020" className="logDetailTypeLabel" style={{ top: 'calc(43.59375% + (2 * 7%))', height: '6.09375%' }} text="Browser"></Label>
                <Label fontSize="1.9vh" color="#BABABA" bkg="#6300E020" className="logDetailTypeLabel" style={{ top: 'calc(43.59375% + (3 * 7%))', height: '6.09375%' }} text="Operating System"></Label>
                <Label fontSize="1.9vh" color="#BABABA" bkg="#6300E020" className="logDetailTypeLabel" style={{ top: 'calc(43.59375% + (4 * 7%))', height: '6.09375%' }} text="IP Address"></Label>
                <Label fontSize="1.9vh" color="#BABABA" bkg="#6300E020" className="logDetailTypeLabel" style={{ top: 'calc(43.59375% + (5 * 7%))', height: '6.09375%' }} text="IP Location"></Label>
                <Label fontSize="1.9vh" color="#BABABA" bkg="#6300E020" className="logDetailTypeLabel" show={props.logObj.subtype == 'Log In'} style={{ top: 'calc(43.59375% + (6 * 7%))', height: '6.09375%' }} text="Session Status"></Label>
                <Label fontSize="1.9vh" color="#BABABA" bkg="#6300E020" className="logDetailTypeLabel" show={props.logObj.subtype == 'Keys Import' || props.logObj.subtype == 'Keys Export'} style={{ top: 'calc(43.59375% + (6 * 7%))', height: '6.09375%' }} text={`${exportDetailsController().type} Type`}></Label>

            </div>)
    } else {
        return '';
    }
}


export default LogDetails;