import Label from './Label';
import Button from '../components/Button.js'
import HorizontalLine from '../components/HorizontalLine.js'
import { useEffect, useState } from 'react';
import LogCard from './LogCard';
import { deviceType, browserName, osName, osVersion, browserVersion } from 'react-device-detect';
import LogDetails from './LogDetails';
import axios from 'axios';
import DomainGetter from '../fn/DomainGetter';

function SettingsLogs(props) {

    const [showLogDetails, setShowLogDetails] = useState({ show: false, logObj: {} });

    const [logsArray, setLogsArray] = useState({
        ini: false, array: []
    });
    const [logsArrayList, setLogsArrayList] = useState([]);

    useEffect(() => {
        setLogsArrayList(logsArray.array.map(log => <li onClick={() => setShowLogDetails({ show: true, logObj: { ...log } })} key={log.type + Math.random()} className='logCardLi'><LogCard logObj={{ ...log }}></LogCard></li>))
    }, [logsArray])

    useEffect(() => {
        axios.post(`${DomainGetter('prodx')}api/dbop?getLogs`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), count: 30 }).then(resx => {
            if (resx.data.error == undefined) {
                if (resx.data.logs) {
                    let parsedLogArray = [];
                    for (let ix = 0; ix < resx.data.logs.length; ix++) {
                        parsedLogArray.push({ ...resx.data.logs[ix], tx: parseInt(resx.data.logs[ix].tx), location: JSON.parse(resx.data.logs[ix].location), details: JSON.parse(resx.data.logs[ix].details) });
                    }
                    setLogsArray({ ini: true, array: parsedLogArray });
                }
            }
        });
    }, [])

    if (props.show) {
        return (<div>
            <HorizontalLine className="logsLn" color="#7000FF" width="90%" top="31.09375%"></HorizontalLine>
            <Label style={{ top: '18.28125%' }} className="logsFiltersLabel" fontSize="2vh" text="Type" color="#FFF" bkg="#7000FF20"></Label>
            <Label style={{ top: '25%' }} className="logsFiltersLabel" fontSize="2vh" text="Time" color="#FFF" bkg="#7000FF20"></Label>
            <Button label="All" fontSize="2vh" color="#7000FF" style={{ left: '29.444444444%', top: '18.28125%', color: '#FFF' }} bkg="#7000FF" width="20.833333333%" className="logsFilterButton"></Button>
            <Button label="Last 24h" fontSize="2vh" color="#7000FF" style={{ left: '29.444444444%', top: '25%', color: '#FFF' }} bkg="#7000FF" width="20.833333333%" className="logsFilterButton"></Button>
            <Button label="Filter" fontSize="2vh" color="#7000FF" style={{ left: '54.722222222%', top: '18.28125%', color: '#9B9B9B' }} bkg="#340076" width="20.833333333%" className="logsFilterButton"></Button>
            <Button label="Filter" fontSize="2vh" color="#7000FF" style={{ left: '54.722222222%', top: '25%', color: '#9B9B9B' }} bkg="#340076" width="20.833333333%" className="logsFilterButton"></Button>
            {!showLogDetails.show ? <>
                <HorizontalLine className="logsLn" color="#7000FF" width="90%" top="89.375%"></HorizontalLine>
                <Button onClick={props.onBack} label="Back" className="logsButton" style={{ top: '91.71875%', height: '6.25%', width: '43.055555556%', left: '5%' }} color="#929292"></Button>
                <Button label="Settings" className="logsButton" style={{ top: '91.71875%', height: '6.25%', width: '43.055555556%', left: '51.944444444%' }} color="#7100FF" bkg="#7100FF"></Button>
            </> : ''}

            {!showLogDetails.show ? <>
                <Label fontSize="1.9vh" text="Info" className="logsFiltersLabel" style={{ top: '32.34375%', height: '2.34375%', paddingRight: '0.2%', paddingLeft: '0.2%' }} color="#9644FF" bkg="#9644FF30"></Label>
                <Label fontSize="1.9vh" text="Warning" className="logsFiltersLabel" style={{ left: '28%', top: '32.34375%', height: '2.34375%', paddingRight: '0.2%', paddingLeft: '0.2%' }} color="#FF7A00" bkg="#FF7A0030"></Label>
                <Label fontSize="1.9vh" text="Important" className="logsFiltersLabel" style={{ left: '51%', top: '32.34375%', height: '2.34375%', paddingRight: '0.2%', paddingLeft: '0.2%' }} color="#FF0000" bkg="#FF000030"></Label>
                <Label fontSize="1.9vh" text="Critical" className="logsFiltersLabel" style={{ left: '74%', top: '32.34375%', height: '2.34375%', paddingRight: '0.2%', paddingLeft: '0.2%' }} color="#FF0099" bkg="#FF009930"></Label>
            </> : ''}

            {!showLogDetails.show ?
                <>
                    <ul id="logsList">
                        {logsArray.ini ? logsArrayList : ''}
                    </ul>
                    <Label fontSize="2vh" show={!logsArray.ini} className="logsFetchingLabel" color="#001AFF" style={{top: '60%'}} bkg="#001AFF20" text="[Fetching Logs]"></Label>
                    <Label fontSize="2vh" show={logsArray.ini && logsArrayList.length == 0} className="logsFetchingLabel" style={{top: '60%'}} color="#001AFF" bkg="#001AFF20" text="[No Logs To Display]"></Label>
                </>
                : ''}
            <LogDetails onBack={() => setShowLogDetails({ show: false, logObj: {} })} show={showLogDetails.show} logObj={showLogDetails.logObj}></LogDetails>
        </div>)
    } else {
        return '';
    }
}

export default SettingsLogs;