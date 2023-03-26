import { useEffect, useState } from 'react';

function LogSeverityIndi(props) {

    const [random, setRandom] = useState(Math.random());

    useEffect(() => {
        setInterval(() => {
            setRandom(Math.random());
        }, 500);
    }, [])


    const getOpacity = () => {
        let ran = Math.random()
        if (ran < .1) {
            return .1;
        } else if (ran > .9) {
            return .4
        } else {
            return ran
        }
    }

    return (<svg style={{position: 'absolute', ...props.style}} width="7vh" height="4vh" viewBox="0 0 22 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path style={{transition: 'all linear 0.1s'}} d="M0.734488 20.0901C0.45354 19.5706 0.45354 18.9445 0.734488 18.4251L5.15279 10.2558C5.45851 9.69056 6.04945 9.33834 6.69208 9.33834H15.3079C15.9506 9.33834 16.5415 9.69056 16.8472 10.2558L21.2655 18.4251C21.5465 18.9445 21.5465 19.5706 21.2655 20.0901L16.8472 28.2593C16.5415 28.8246 15.9506 29.1768 15.3079 29.1768H6.69208C6.04945 29.1768 5.45851 28.8246 5.15279 28.2593L0.734488 20.0901Z" fill={props.color} fillOpacity={getOpacity()} stroke={props.color} strokeWidth="0.5" />
        <path style={{transition: 'all linear 0.1s'}} d="M0.734488 16.3323C0.45354 15.8128 0.45354 15.1867 0.734488 14.6672L5.15279 6.49801C5.45851 5.93275 6.04945 5.58053 6.69208 5.58053H15.3079C15.9506 5.58053 16.5415 5.93275 16.8472 6.49801L21.2655 14.6672C21.5465 15.1867 21.5465 15.8128 21.2655 16.3323L16.8472 24.5015C16.5415 25.0668 15.9506 25.419 15.3079 25.419H6.69208C6.04945 25.419 5.45851 25.0668 5.15279 24.5015L0.734488 16.3323Z" fill={props.color} fillOpacity={getOpacity()} stroke={props.color} strokeWidth="0.5" />
        <path style={{transition: 'all linear 0.1s'}} d="M0.734488 12.575C0.45354 12.0555 0.45354 11.4294 0.734488 10.9099L5.15279 2.74068C5.45851 2.17543 6.04945 1.8232 6.69208 1.8232H15.3079C15.9506 1.8232 16.5415 2.17542 16.8472 2.74068L21.2655 10.9099C21.5465 11.4294 21.5465 12.0555 21.2655 12.575L16.8472 20.7442C16.5415 21.3095 15.9506 21.6617 15.3079 21.6617H6.69208C6.04945 21.6617 5.45851 21.3095 5.15279 20.7442L0.734488 12.575Z" fill={props.color} fillOpacity={getOpacity()} stroke={props.color} strokeWidth="0.5" />
    </svg>
    )
}

export default LogSeverityIndi;