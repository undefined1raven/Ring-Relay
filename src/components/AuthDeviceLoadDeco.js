import { useEffect, useState } from "react";

function AuthDeviceLoadDeco(props) {

    const [random, setRandom] = useState(Math.random());

    setInterval(() => {
        setRandom(Math.random());
    }, 500);

    useEffect(() => { }, [random])

    const getColor = () => {
        if (Math.random() > .5) {
            return '#6100DC'
        } else {
            return '#0500FF'
        }
    }

    return (
        <svg className={props.className} style={{ top: `${props.top ? props.top : '39%'}` }} width={props.width ? props.width : "40vh"} height={props.height ? props.height : "13.2vh"} viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M37.5 11.4407L69.976 59.1102L5.02405 59.1102L37.5 11.4407Z" fill="url(#paint0_linear_43_569)" fillOpacity="0.5" />
            <path d="M37.5 5.81116L69.976 53.4806L5.02405 53.4806L37.5 5.81116Z" fill="url(#paint1_linear_43_569)" fillOpacity="0.5" />
            <path d="M37.5 0L69.976 47.6695L5.02405 47.6695L37.5 0Z" fill="url(#paint2_linear_43_569)" fillOpacity="0.5" />
            <defs>
                <linearGradient id="paint0_linear_43_569" x1="37.5" y1="58.8559" x2="37.5" y2="12.9661" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6100DC" />
                    <stop offset="1" stopColor={getColor()} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paint1_linear_43_569" x1="37.5" y1="53.2264" x2="37.5" y2="7.33658" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6100DC" />
                    <stop offset="1" stopColor={getColor()} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paint2_linear_43_569" x1="37.5" y1="47.4153" x2="37.5" y2="1.52543" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6100DC" />
                    <stop offset="1" stopColor={getColor()} stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    )
}

export default AuthDeviceLoadDeco;