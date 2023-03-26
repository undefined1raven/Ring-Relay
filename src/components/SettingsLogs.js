import Label from './Label';
import Button from '../components/Button.js'
import HorizontalLine from '../components/HorizontalLine.js'
import { useEffect, useState } from 'react';
import LogCard from './LogCard';


function SettingsLogs(props) {

    const [logsArray, setLogsArray] = useState({ ini: true, array: [
        { severity: 'warning', type: 'Account', subtype: 'Log In', tx: Date.now(), ip: '5.00.188.058', location: 'Aiur City' },
        { severity: 'critical', type: 'Security', subtype: 'Private Key Export', tx: Date.now(), ip: '190.15.32.51', location: 'Aiur City' },
        { severity: 'critical', type: 'Security', subtype: 'Private Key Export', tx: Date.now(), ip: '190.15.32.51', location: 'Aiur City' },
        { severity: 'important', type: 'Security', subtype: 'Password Changed', tx: Date.now(), ip: '190.15.32.51', location: 'Aiur City' },
        { severity: 'info', type: 'Account', subtype: 'Username Changed', tx: Date.now(), ip: '190.15.32.51', location: 'Aiur City' },
        { severity: 'important', type: 'Security', subtype: 'Password Reset', tx: Date.now(), ip: '190.15.32.51', location: 'Aiur City' },
        { severity: 'critical', type: 'Security', subtype: 'Private Key Import', tx: Date.now(), ip: '190.15.32.51', location: 'Aiur City' },
        { severity: 'warning', type: 'Account', subtype: 'Log In', tx: Date.now(), ip: '190.15.32.51', location: 'Aiur City' },
        { severity: 'warning', type: 'Account', subtype: 'Log In', tx: Date.now(), ip: '190.15.32.51', location: 'Aiur City' },
        { severity: 'warning', type: 'Account', subtype: 'Log In', tx: Date.now(), ip: '190.15.32.51', location: 'Aiur City' },
        { severity: 'warning', type: 'Account', subtype: 'Log In', tx: Date.now(), ip: '190.15.32.51', location: 'Aiur City' },
        { severity: 'warning', type: 'Account', subtype: 'Log In', tx: Date.now(), ip: '190.15.32.51', location: 'Aiur City' },
    ] });
    const [logsArrayList, setLogsArrayList] = useState([]);

    useEffect(() => {
        setLogsArrayList(logsArray.array.map(log => <li className='logCardLi'><LogCard logObj={{...log}}></LogCard></li>))
    }, [logsArray])

    if (props.show) {
        return (<div>
            <HorizontalLine className="logsLn" color="#7000FF" width="90%" top="89.375%"></HorizontalLine>
            <HorizontalLine className="logsLn" color="#7000FF" width="90%" top="31.09375%"></HorizontalLine>
            <Label style={{ top: '18.28125%' }} className="logsFiltersLabel" fontSize="2vh" text="Type" color="#FFF" bkg="#7000FF20"></Label>
            <Label style={{ top: '25%' }} className="logsFiltersLabel" fontSize="2vh" text="Time" color="#FFF" bkg="#7000FF20"></Label>
            <Button label="All" fontSize="2vh" color="#7000FF" style={{ left: '29.444444444%', top: '18.28125%', color: '#FFF' }} bkg="#7000FF" width="20.833333333%" className="logsFilterButton"></Button>
            <Button label="Last 24h" fontSize="2vh" color="#7000FF" style={{ left: '29.444444444%', top: '25%', color: '#FFF' }} bkg="#7000FF" width="20.833333333%" className="logsFilterButton"></Button>
            <Button label="Filter" fontSize="2vh" color="#7000FF" style={{ left: '54.722222222%', top: '18.28125%', color: '#9B9B9B' }} bkg="#340076" width="20.833333333%" className="logsFilterButton"></Button>
            <Button label="Filter" fontSize="2vh" color="#7000FF" style={{ left: '54.722222222%', top: '25%', color: '#9B9B9B' }} bkg="#340076" width="20.833333333%" className="logsFilterButton"></Button>

            <Button onClick={props.onBack} label="Back" className="logsButton" style={{ top: '91.71875%', height: '6.25%', width: '43.055555556%', left: '5%' }} color="#929292"></Button>
            <Button label="Settings" className="logsButton" style={{ top: '91.71875%', height: '6.25%', width: '43.055555556%', left: '51.944444444%' }} color="#7100FF" bkg="#7100FF"></Button>

            <Label fontSize="1.9vh" text="Info" className="logsFiltersLabel" style={{ top: '32.34375%', height: '2.34375%', paddingRight: '0.2%', paddingLeft: '0.2%' }} color="#9644FF" bkg="#9644FF30"></Label>
            <Label fontSize="1.9vh" text="Warning" className="logsFiltersLabel" style={{ left: '28%', top: '32.34375%', height: '2.34375%', paddingRight: '0.2%', paddingLeft: '0.2%' }} color="#FF7A00" bkg="#FF7A0030"></Label>
            <Label fontSize="1.9vh" text="Important" className="logsFiltersLabel" style={{ left: '51%', top: '32.34375%', height: '2.34375%', paddingRight: '0.2%', paddingLeft: '0.2%' }} color="#FF0000" bkg="#FF000030"></Label>
            <Label fontSize="1.9vh" text="Critical" className="logsFiltersLabel" style={{ left: '74%', top: '32.34375%', height: '2.34375%', paddingRight: '0.2%', paddingLeft: '0.2%' }} color="#FF0099" bkg="#FF009930"></Label>

            <ul id="logsList">
                {logsArrayList}
            </ul>
        </div>)
    } else {
        return '';
    }
}

export default SettingsLogs;