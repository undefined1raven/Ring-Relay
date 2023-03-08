

import InputField from '../components/InputField.js'
import Label from '../components/Label.js'
import HorizontalLine from '../components/HorizontalLine.js'
import Button from '../components/Button.js'
import NewContactMatchTile from '../components/NewContactMatchTile.js'
import NewContactLoadingDeco from '../components/NewContactLoadingDeco.js'
import DomainGetter from '../fn/DomainGetter.js'
import { useEffect, useState } from 'react'
import axios from 'axios';


function NewContact(props) {
    const [searchParam, setSearchParam] = useState('');
    const [matches, setMatches] = useState([]);
    const [matchesList, setMatchesList] = useState([]);
    const [showSearchDeco, setShowSearchDeco] = useState(false);
    const [activeRequests, setActiveRequests] = useState({ ini: false, array: [] });
    const [activeRequestsList, setActiveRequestsList] = useState([]);
    const [activeRequestsListOpacity, setActiveRequestsListOpacity] = useState(1);
    const [reqSentLabel, setReqSentLabel] = useState({ opacity: 0, label: '', color: '' });
    const [noMatchesLabel, setNoMatchesLabel] = useState({ opacity: 1, label: '[Awaiting Search Params]', color: '#6100DC' });
    const [selectedRequest, setSelectedRequest] = useState({ uid: '', username: '', qid: '', opacity: 0, type: '', listLabel: 'Active Requests' });
    const [updatingRequestsLabelOpacity, setUpdatingRequestsLabelOpacity] = useState(0);

    const getActiveRequests = () => {
        axios.post(`${DomainGetter('devx')}api/dbop?getRequests`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(res => {
            setActiveRequests({ ini: true, array: res.data.activeRequests });
            setReqSentLabel({ opacity: 0, label: 'Request Sent', color: '#00FFD1' });
            setUpdatingRequestsLabelOpacity(0)
        }).catch(e => {
            setReqSentLabel({ opacity: 0, label: 'Request Already Sent', color: '#FF002E' });
            setActiveRequests({ ini: true, array: [] })
        });
    }

    const searchInputOnChange = (e) => {
        setSearchParam(e.target.value);
        if (searchParam.length > 0) {
            setNoMatchesLabel({ opacity: 0, label: '[No Matches]', color: '#FF002E' });
            setShowSearchDeco(true);
            axios.post(`${DomainGetter('devx')}api/dbop?searchUser`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), value: searchParam }).then(res => {
                if (e.target.value.length > 0) {
                    setMatches(res.data.matches);
                }
                if (res.data.matches?.length == 0) {
                    setNoMatchesLabel({ opacity: 1, label: '[No Matches]', color: '#FF002E' });
                }
            });
        }
        if (e.target.value.length == 0) {
            setTimeout(() => {
                setMatches([]);
                setNoMatchesLabel({ opacity: 1, label: '[Awaiting Search Params]', color: '#6100DC' });
            }, 200);
        }
    }


    const onRequestSelected = (req) => {
        setSelectedRequest({ listLabel: 'Request Controls', type: req.type, username: req.username, qid: `<${req.foreignUID.toString().split('-')[4]}>`, uid: req.foreignUID, opacity: 1 });
        setActiveRequestsListOpacity(0);
    }

    const newContactOnClick = (uid) => {
        setReqSentLabel({ opacity: 1, label: 'Request Sent', color: '#00FFD1' });
        setSearchParam('');
        setMatches([]);
        axios.post(`${DomainGetter('devx')}api/dbop?addNewContact`, { AT: localStorage.getItem("AT"), CIP: localStorage.getItem('CIP'), remoteUID: uid }).then(res => {
            if (res.data.error == undefined) {
                getActiveRequests();
            } else {
                setReqSentLabel({ opacity: 1, label: 'Request Already Sent', color: '#FF002E' });
                setTimeout(() => {
                    setReqSentLabel({ opacity: 0, label: 'Request Already Sent', color: '#FF002E' });
                }, 2000);
            }
        })
    }

    function requestControlsToActiveRequests() {
        setSelectedRequest({ listLabel: 'Active Requests', type: '', username: '', qid: '', opacity: 0 });
        setActiveRequestsListOpacity(1);
    }

    const selectedReqOnBack = () => {
        requestControlsToActiveRequests();
    }

    const TXReqOnCancel = () => {
        setUpdatingRequestsLabelOpacity(1);
        axios.post(`${DomainGetter('devx')}api/dbop?cancelRequest`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), foreignUID: selectedRequest.uid }).then(res => {
            if (res.data.error == undefined) {
                getActiveRequests();
            }
        });
        requestControlsToActiveRequests();
    }
    const RXReqOnUpdate = (status) => {
        setUpdatingRequestsLabelOpacity(1);
        axios.post(`${DomainGetter('devx')}api/dbop?updateRequest`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), foreignUID: selectedRequest.uid, approved: status }).then(res => {
            if (res.data.error == undefined) {
                getActiveRequests();
            }
        });
        requestControlsToActiveRequests();
    }
    useEffect(() => {
        if (!activeRequests.ini) {
            getActiveRequests();
        }
        setActiveRequestsList(activeRequests.array?.map(req => { return <li className='matchTileContainer' key={`${req.username}${Math.random()}`}><NewContactMatchTile onClick={() => onRequestSelected(req)} username={req.username} type={req.type} qid={`<${req.foreignUID.toString().split('-')[4]}>`}></NewContactMatchTile></li> }))
        setMatchesList(matches.map(elm => { return <li key={`${elm.username}${Math.random()}`} className='matchTileContainer'><NewContactMatchTile onClick={() => newContactOnClick(elm.uid)} username={elm.username} qid={`<${elm.uid.toString().split('-')[4]}>`} /></li> }));
        setShowSearchDeco(false);
    }, [matches, activeRequests])

    if (props.show) {
        return (
            <div className="newContactContainer">
                <Label style={{ opacity: `${reqSentLabel.opacity}` }} id="reqSentLabel" text={reqSentLabel.label} color={reqSentLabel.color} bkg={`${reqSentLabel.color}30`}></Label>
                <Label style={{ opacity: `${noMatchesLabel.opacity}` }} id="noSearchResultsLabel" text={noMatchesLabel.label} color={noMatchesLabel.color} bkg={`${noMatchesLabel.color}30`}></Label>
                <Label id="newContactLabel" fontSize="2.2vh" color="#9948FF" text="Search By Username"></Label>
                <Label id="requestsLabel" fontSize="2.2vh" color="#9948FF" text={selectedRequest.listLabel}></Label>
                <Label show={activeRequests.array?.length > 0 ? false : true} id="noRequestsLabel" bkg="#001AFF30" fontSize="2vh" color="#001AFF" text="[Incoming/Outgoing requests will appear here]"></Label>
                <Label show={updatingRequestsLabelOpacity} id="updatingRequestsLabel" bkg="#001AFF30" fontSize="2vh" color="#001AFF" text="[Updating Requests]"></Label>
                <InputField value={searchParam} onChange={searchInputOnChange} color="#6300E0" id="newContactSearchInput"></InputField>
                <NewContactLoadingDeco id="newContactSearchDeco" show={showSearchDeco} />
                <ul id='newContactMatchesList'>
                    {matchesList}
                </ul>
                <ul id='activeRequests'>
                    {activeRequestsListOpacity == 1 ? activeRequestsList : ''}
                </ul>
                <div id='selectedReqTitle' style={{ opacity: `${selectedRequest.opacity}` }}>
                    <Label fontSize="2.5vh" id="selectedReqUsername" color="#FFF" text={selectedRequest.username} ></Label>
                    <Label fontSize="1.9vh" id="selectedReqQID" color="#6300E0" text={selectedRequest.qid}></Label>
                </div>
                {selectedRequest.type == 'Pending.RX' ? <Button onClick={() => RXReqOnUpdate(true)} show={selectedRequest.opacity == 1} id="selectedReqRXAcceptButton" color="#00FFD1" label="Accept"></Button> : ''}
                {selectedRequest.type == 'Pending.RX' ? <Button onClick={() => RXReqOnUpdate(false)} show={selectedRequest.opacity == 1} id="selectedReqRXDenyButton" color="#FF002E" label="Deny"></Button> : ''}
                {selectedRequest.type == 'Pending.TX' ? <Button onClick={TXReqOnCancel} show={selectedRequest.opacity == 1} id="selectedReqRXDenyButton" color="#FF002E" label="Cancel"></Button> : ''}
                <Button show={selectedRequest.opacity == 1} onClick={selectedReqOnBack} id="selectedReqBackButton" color="#7C7C7C" label="Back"></Button>
            </div>
        )
    } else {
        return '';
    }
}

export default NewContact;