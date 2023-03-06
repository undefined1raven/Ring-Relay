

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
        console.log(uid)
    }

    useEffect(() => {
        setMatchesList(matches.map(elm => { return <li key={`${elm.username}${Math.random()}`} className='matchTileContainer'><NewContactMatchTile onClick={() => newContactOnClick(elm.uid)} username={elm.username} qid={`<${elm.uid.toString().split('-')[4]}>`} /></li> }));
        setShowSearchDeco(false);
    }, [matches])

    if (props.show) {
        return (
            <div className="newContactContainer">
                <Label id="newContactLabel" fontSize="2.2vh" color="#9948FF" text="Search By Username"></Label>
                <InputField value={searchParam} onChange={searchInputOnChange} color="#6300E0" id="newContactSearchInput"></InputField>
                <NewContactLoadingDeco id="newContactSearchDeco" show={showSearchDeco}/>
                <ul id='newContactMatchesList'>
                    {matchesList}
                </ul>
            </div>
        )
    } else {
        return '';
    }
}

export default NewContact;