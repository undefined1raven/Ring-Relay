import Label from './Label';
import Button from '../components/Button.js'
import BackDeco from '../components/BackDeco.js'
import axios from 'axios';
import { useEffect, useState } from 'react';
import DomainGetter from '../fn/DomainGetter.js';

function LogCollectionSettings(props) {
    const [checking, setChecking] = useState(false);
    const [logsOptions, setLogsOptions] = useState({ account: true, security: false });
    const [showUpdateFailed, setShowUpdateFailed] = useState(false)
    const [isLogOptionUpdating, setIsLogOptionUpdating] = useState({ account: false, security: false });

    useEffect(() => {
        setChecking(true);
        axios.post(`${DomainGetter('prodx')}api/dbop?getLogsConfig`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(resx => {
            if (resx.data.logsConfig && resx.data.error == undefined) {
                const config = JSON.parse(resx.data.logsConfig);
                setLogsOptions({ ...config });
                setChecking(false);
            }
        }).catch(e => { });
    }, [])

    const selectorColorController = (selectorKey) => {
        if (checking) {
            return { color: '#001AFF', label: '▣ Checking' }
        } else if (isLogOptionUpdating[selectorKey]) {
            return { color: '#001AFF', label: '▣ Updating' }
        } else {
            if (logsOptions[selectorKey]) {
                return { color: '#00FFD1', label: 'Enabled' };
            } else {
                return { color: '#FF002E', label: 'Disabled' };
            }

        }
    }

    const flipState = (logTypeKey) => {
        if (!checking && !isLogOptionUpdating[logTypeKey]) {
            let isUpdating = { ...isLogOptionUpdating };
            isUpdating[logTypeKey] = !isUpdating[logTypeKey];
            setIsLogOptionUpdating({ ...isUpdating })
            let flippedLogOptions = { ...logsOptions };
            flippedLogOptions[logTypeKey] = !flippedLogOptions[logTypeKey];
            setLogsOptions({ ...flippedLogOptions })
        }
    }


    useEffect(() => {
        let newPrefs = JSON.stringify({ ...logsOptions, ini: true });
        axios.post(`${DomainGetter('prodx')}api/dbop?updateLogsConfig`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), newPrefs: newPrefs }).then(res => {
            if (res.data.error == undefined) {
                if (isLogOptionUpdating.account) {
                    setIsLogOptionUpdating({ ...isLogOptionUpdating, account: false })
                }
                if (isLogOptionUpdating.security) {
                    setIsLogOptionUpdating({ ...isLogOptionUpdating, security: false })
                }
            }
        }).catch(e => {
            setShowUpdateFailed(true);
            setTimeout(() => {
                setShowUpdateFailed(false);
            }, 2000);
        });
    }, [logsOptions])

    useEffect(() => {
        setTimeout(() => {
            if (isLogOptionUpdating.account) {
                setIsLogOptionUpdating({ ...isLogOptionUpdating, account: false })
            }
            if (isLogOptionUpdating.security) {
                setIsLogOptionUpdating({ ...isLogOptionUpdating, security: false })
            }
        }, 10000);
    }, [isLogOptionUpdating])

    if (props.show) {
        return (
            <div className="logCollectionSettingsContainer">
                <Label fontSize="2vh" className="logCollectionSettingsTitle" style={{ left: '19.722222222%', top: '1.875%', width: '71.1%', height: '6.09375%' }} color="#FFF" bkg="#7000FF20" text="Log Collection Settings"></Label>
                <Button color="#7000FF" bkg="#7000FF" child={<BackDeco style={{ width: "29%" }} color="#7000FF" />} className="logDetailsBackBtn" onClick={props.onBack} style={{ top: '1.875%', width: '12.222222222%', left: '5%' }}></Button>
                <Label style={{ top: 'calc(9.5625%)' }} className="logCollectionSettingsLabel" fontSize="2vh" color="#FFF" bkg="#7000FF20" text="Account Logs"></Label>
                <Label style={{ top: 'calc(9.5625% + (1 * 7.7%))' }} className="logCollectionSettingsLabel" fontSize="2vh" color="#FFF" bkg="#7000FF20" text="Security Logs"></Label>
                <Label style={{ top: 'calc(9.5625% + (2 * 7.7%))' }} className="logCollectionSettingsLabel" fontSize="2vh" color="#FFF" bkg="#7000FF20" text="Auto-delete Logs"></Label>
                <Button style={{ top: 'calc(9.5625% + (3 * 7.7%))', width: '90%' }} fontSize="2vh" color="#FF002E" bkg="#FF002E" className="logCollectionSettingsButton" label="Delete All"></Button>
                <Button onClick={() => flipState('account')} style={{ top: 'calc(9.5625% + (0 * 7.7%))', left: '62.222222222%' }} fontSize="2vh" color={selectorColorController('account').color} bkg={selectorColorController('account').color} className="logCollectionSettingsButton" label={selectorColorController('account').label}></Button>
                <Button onClick={() => flipState('security')} style={{ top: 'calc(9.5625% + (1 * 7.7%))', left: '62.222222222%' }} fontSize="2vh" color={selectorColorController('security').color} bkg={selectorColorController('security').color} className="logCollectionSettingsButton" label={selectorColorController('security').label}></Button>
                <Button style={{ top: 'calc(9.5625% + (2 * 7.7%))', left: '62.222222222%' }} fontSize="2vh" color="#999" bkg="#999" className="logCollectionSettingsButton" label="V"></Button>
                <Label show={showUpdateFailed} style={{ top: 'calc(9.5625% + (6 * 7.7%))', width: '80%' }} className="logCollectionSettingsLabel actionFailed" fontSize="2vh" color="#FF002E" bkg="#FF002E20" text="Failed to update config"></Label>
            </div>)
    } else {

    }
}


export default LogCollectionSettings;