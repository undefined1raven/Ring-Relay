

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
    const [reqSentLabelOpacity, setReqSentLabelOpacity] = useState(0);


    const getActiveRequests = () => {
        axios.post(`${DomainGetter('prodx')}api/dbop?getRequests`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(res => {
            setActiveRequests({ ini: true, array: res.data.activeRequests });
            setReqSentLabelOpacity(0);
        }).catch(e => setActiveRequests({ ini: true, array: [] }));
    }

    const searchInputOnChange = (e) => {
        setSearchParam(e.target.value);
        if (searchParam.length > 0) {
            setShowSearchDeco(true);
            axios.post(`${DomainGetter('prodx')}api/dbop?searchUser`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), value: searchParam }).then(res => {
                setMatches(res.data.matches);
            });
        } else {
            setMatches([]);
        }
    }


    const newContactOnClick = (uid) => {
        setReqSentLabelOpacity(1);
        axios.post(`${DomainGetter('prodx')}api/dbop?addNewContact`, { AT: localStorage.getItem("AT"), CIP: localStorage.getItem('CIP'), remoteUID: uid }).then(res => {
            if (res.data.error == undefined) {
                getActiveRequests();
            }
        })
    }

    useEffect(() => {
        if (!activeRequests.ini) {
            getActiveRequests();
        }
        setActiveRequestsList(activeRequests.array.map(req => { return <li className='matchTileContainer' key={`${req.username}${Math.random()}`}><NewContactMatchTile username={req.username} type={req.type} qid={`<${req.foreignUID.toString().split('-')[4]}>`}></NewContactMatchTile></li> }))
        setMatchesList(matches.map(elm => { return <li key={`${elm.username}${Math.random()}`} className='matchTileContainer'><NewContactMatchTile onClick={() => newContactOnClick(elm.uid)} username={elm.username} qid={`<${elm.uid.toString().split('-')[4]}>`} /></li> }));
        setShowSearchDeco(false);
    }, [matches, activeRequests])

    if (props.show) {
        return (
            <div className="newContactContainer">
                <Label style={{ opacity: `${reqSentLabelOpacity}` }} id="reqSentLabel" text="Request Sent" color="#00FFD1" bkg="#00FFD130"></Label>
                <Label id="newContactLabel" fontSize="2.2vh" color="#9948FF" text="Search By Username"></Label>
                <Label id="requestsLabel" fontSize="2.2vh" color="#9948FF" text="Active Requests"></Label>
                <Label show={activeRequests.array.length > 0 ? false : true} id="noRequestsLabel" bkg="#001AFF30" fontSize="2vh" color="#001AFF" text="[Incoming/Outgoing requests will appear here]"></Label>
                <InputField value={searchParam} onChange={searchInputOnChange} color="#6300E0" id="newContactSearchInput"></InputField>
                <NewContactLoadingDeco id="newContactSearchDeco" show={showSearchDeco} />
                <ul id='newContactMatchesList'>
                    {matchesList}
                </ul>
                <ul style={{ opcaity: `${activeRequests.array.length > 0 ? 1 : 0}` }} id='activeRequests'>
                    {activeRequestsList}
                </ul>
            </div>
        )
    } else {
        return '';
    }
}

export default NewContact;