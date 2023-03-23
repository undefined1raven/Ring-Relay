import { useEffect, useState } from "react";


function LocationIndi(props) {

    const [random, setRandom] = useState(Math.random());

    setInterval(() => {
        setRandom(Math.random());
    }, 500);

    useEffect(() => { }, [random])

    const getOpacity = () => {
        let ran = Math.random();
        if (ran > .1) {
            return ran
        }
    }

    return (
        <svg width="4vh" height="4vh" style={{ zIndex: 500000 }} viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="12" width="3" height="3" fill="white" fillOpacity={getOpacity()} />
            <circle cx="13.5" cy="13.5" r="7" stroke="white" />
            <rect x="8.5498" y="9.25735" width="1" height="13.6932" transform="rotate(-45 8.5498 9.25735)" fill="white" fillOpacity={getOpacity()} />
            <rect x="13" width="1" height="7" fill="white" fillOpacity={getOpacity()} />
            <rect x="13" y="20" width="1" height="7" fill="white" fillOpacity={getOpacity()} />
            <rect y="14" width="1" height="7" transform="rotate(-90 0 14)" fill="white" fillOpacity={getOpacity()} />
            <rect x="20" y="14" width="1" height="7" transform="rotate(-90 20 14)" fill="white" fillOpacity={getOpacity()} />
            <rect x="17.7422" y="8.55026" width="1" height="13.6614" transform="rotate(45 17.7422 8.55026)" fill="white" fillOpacity={getOpacity()} />
        </svg>
    )
}

export default LocationIndi;