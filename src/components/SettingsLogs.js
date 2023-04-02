import Label from './Label';
import Button from '../components/Button.js'
import HorizontalLine from '../components/HorizontalLine.js'
import { useEffect, useState } from 'react';
import LogCard from './LogCard';
import { deviceType, browserName, osName, osVersion, browserVersion } from 'react-device-detect';
import LogDetails from './LogDetails';
import LogCollectionSettings from './LogCollectionSettings';
import LogFilter from './LogsFilter';
import axios from 'axios';
import DomainGetter from '../fn/DomainGetter';
import LogsFilter from './LogsFilter';

function SettingsLogs(props) {

    const [showLogDetails, setShowLogDetails] = useState({ show: false, logObj: {} });
    const [showLogCollectionSettings, setShowLogCollectionSettings] = useState(false);
    const [showLogFilter, setShowLogFilter] = useState(false);
    const [logFilters, setLogFilters] = useState({ login: true, usernameChanged: true, passwordReset: true, keysExport: true, keysImport: true, keysRegen: true, info: true, warning: true, important: true, critical: true, last24h: true, lastWeek: false, lastMonth: false });

    const [logsArray, setLogsArray] = useState({
        ini: false, array: []
    });
    const [logsArrayList, setLogsArrayList] = useState([]);

    const isFilteredByType = () => {
        var l = logFilters
        return !(l.login && l.usernameChanged && l.passwordReset && l.keysExport && l.keysImport && l.keysRegen && l.info && l.important && l.warning && l.critical);
    }

    const areTimeFiltersDefault = () => {
        return (logFilters.last24h && logFilters.lastWeek == false && logFilters.lastMonth == false)
    }

    const removeTypeFilters = () => {
        let nFilters = logFilters;
        for (let ix = 0; ix < Object.keys(nFilters).length - 1; ix++) {
            let key = Object.keys(nFilters)[ix]
            if (key != 'last24h' && key != 'lastWeek' && key != 'lastMonth') {
                nFilters[key] = true;
            }
        }
        setLogFilters(nFilters);
        filterLogs();
    }

    const resetTimeFilters = () => {
        let nFilters = logFilters;
        nFilters['last24h'] = true;
        nFilters['lastWeek'] = false;
        nFilters['lastMonth'] = false;
        setLogFilters(nFilters);
        filterLogs();
    }

    const filterLogs = () => {
        setLogsArrayList(logsArray.array.filter(log =>
            ((log.subtype == 'Log In' && logFilters.login) ||
                (log.subtype == 'Username Changed' && logFilters.usernameChanged) ||
                (log.subtype == 'Password Changed' && logFilters.passwordReset) ||
                (log.subtype == 'Keys Export' && logFilters.keysExport) ||
                (log.subtype == 'Keys Import' && logFilters.keysImport) ||
                (log.subtype == 'Keys Regen' && logFilters.keysRegen)) &&
            ((Date.now() - parseInt(log.tx) < 86400000 && logFilters.last24h) ||
                (Date.now() - parseInt(log.tx) < 604800000 && logFilters.lastWeek) ||
                (Date.now() - parseInt(log.tx) < 2629800000 && logFilters.lastMonth)) &&
            ((log.severity == 'info' && logFilters.info) ||
                (log.severity == 'warning' && logFilters.warning) ||
                (log.severity == 'important' && logFilters.important) ||
                (log.severity == 'critical' && logFilters.critical))).map(log => <li onClick={() => setShowLogDetails({ show: true, logObj: { ...log } })} key={log.type + Math.random()} className='logCardLi'><LogCard logObj={{ ...log }}></LogCard></li>))
    }

    useEffect(() => {
        filterLogs();
    }, [logsArray])

    const fetchLogs = () => {
        axios.post(`${DomainGetter('devx')}api/dbop?getLogs`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), count: 150 }).then(resx => {
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
    }

    useEffect(() => {
        fetchLogs();
    }, [])

    useEffect(() => {
        if(props.show == true){
            fetchLogs();
        }
    }, [props.show])

    const flipFilter = (key) => {
        let nFilters = logFilters;
        nFilters[key] = !nFilters[key];
        setLogFilters({ ...nFilters });
    }

    useEffect(() => {
        filterLogs();
    }, [logFilters])

    if (props.show) {
        return (<div>
            <HorizontalLine className="logsLn" color="#7000FF" width="90%" top="31.09375%"></HorizontalLine>
            <Label style={{ top: '18.28125%' }} className="logsFiltersLabel" fontSize="2vh" text="Type" color="#FFF" bkg="#7000FF20"></Label>
            <Label style={{ top: '25%' }} className="logsFiltersLabel" fontSize="2vh" text="Time" color="#FFF" bkg="#7000FF20"></Label>
            <Button onClick={() => removeTypeFilters()} label="All" fontSize="2vh" color="#7000FF" style={{ left: '29.444444444%', top: '18.28125%', color: `${isFilteredByType() ? '#9B9B9B' : '#FFF'}` }} bkg="#7000FF" width="20.833333333%" className="logsFilterButton"></Button>
            <Button onClick={resetTimeFilters} label="Last 24h" fontSize="2vh" color="#7000FF" style={{ left: '29.444444444%', top: '25%', color: `${areTimeFiltersDefault() ? "#FFF" : "#9B9B9B"}` }} bkg="#7000FF" width="20.833333333%" className="logsFilterButton"></Button>
            <Button onClick={() => setShowLogFilter(true)} label="Filter" fontSize="2vh" color="#7000FF" style={{ left: '54.722222222%', top: '18.28125%', color: `${isFilteredByType() ? '#FFF' : '#9B9B9B'}` }} bkg="#340076" width="20.833333333%" className="logsFilterButton"></Button>
            <Button onClick={() => setShowLogFilter(true)} label="Filter" fontSize="2vh" color="#7000FF" style={{ left: '54.722222222%', top: '25%', color: `${areTimeFiltersDefault() ? "#9B9B9B" : "#FFF"}` }} bkg="#340076" width="20.833333333%" className="logsFilterButton"></Button>
            {!showLogDetails.show ? <>
                <HorizontalLine className="logsLn" color="#7000FF" width="90%" top="89.375%"></HorizontalLine>
                <Button onClick={props.onBack} label="Back" className="logsButton" style={{ top: '91.71875%', height: '6.25%', width: '43.055555556%', left: '5%' }} color="#929292"></Button>
                <Button onClick={() => { setShowLogCollectionSettings(prev => !prev) }} label="Settings" className="logsButton" style={{ top: '91.71875%', height: '6.25%', width: '43.055555556%', left: '51.944444444%' }} color="#7100FF" bkg="#7100FF"></Button>
            </> : ''}

            {!showLogDetails.show ? <>
                <Label fontSize="1.9vh" text="Info" className="logsFiltersLabel" style={{ top: '32.34375%', height: '2.34375%', paddingRight: '0.2%', paddingLeft: '0.2%' }} color={logFilters.info ? "#9644FF" : "#999"} bkg={logFilters.info ? "#9644FF30" : "#99999920"}></Label>
                <Label fontSize="1.9vh" text="Warning" className="logsFiltersLabel" style={{ left: '28%', top: '32.34375%', height: '2.34375%', paddingRight: '0.2%', paddingLeft: '0.2%' }} color={logFilters.warning ? "#FF7A00" : "#999"} bkg={logFilters.warning ? "#FF7A0030" : "#99999920"}></Label>
                <Label fontSize="1.9vh" text="Important" className="logsFiltersLabel" style={{ left: '51%', top: '32.34375%', height: '2.34375%', paddingRight: '0.2%', paddingLeft: '0.2%' }} color={logFilters.important ? "#FF0000" : "#999"} bkg={logFilters.important ? "#FF000030" : "#99999920"}></Label>
                <Label fontSize="1.9vh" text="Critical" className="logsFiltersLabel" style={{ left: '74%', top: '32.34375%', height: '2.34375%', paddingRight: '0.2%', paddingLeft: '0.2%' }} color={logFilters.critical ? "#FF0099" : "#999"} bkg={logFilters.critical ? "#FF009930" : "#99999920"}></Label>
            </> : ''}

            {!showLogDetails.show ?
                <>
                    <ul id="logsList">
                        {logsArray.ini ? logsArrayList : ''}
                    </ul>
                    <Label fontSize="2vh" show={!logsArray.ini} className="logsFetchingLabel" color="#001AFF" style={{ top: '60%' }} bkg="#001AFF20" text="[Fetching Logs]"></Label>
                    <Label fontSize="2vh" show={logsArray.ini && logsArrayList.length == 0} className="logsFetchingLabel" style={{ top: '60%' }} color="#001AFF" bkg="#001AFF20" text="[No Logs To Display]"></Label>
                </>
                : ''}
            <LogDetails onBack={() => setShowLogDetails({ show: false, logObj: {} })} show={showLogDetails.show} logObj={showLogDetails.logObj}></LogDetails>
            <LogCollectionSettings onBack={() => setShowLogCollectionSettings(prev => !prev)} show={showLogCollectionSettings}></LogCollectionSettings>
            <LogFilter filteredCountLabel={`Showing ${logsArrayList.length} out of ${logsArray.array.length}`} onBack={() => setShowLogFilter(false)} flipFilter={flipFilter} logFilters={{ ...logFilters }} show={showLogFilter}></LogFilter>
        </div>)
    } else {
        return '';
    }
}

export default SettingsLogs;