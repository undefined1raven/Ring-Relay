import { useEffect, useState } from "react";

function AuthDeviceDownloadDeco(props) {

    const [random, setRandom] = useState(Math.random());

    setInterval(() => {
        setRandom(Math.random());
    }, 1500);

    useEffect(() => {}, [random])

    const getColor = () => {
        if (Math.random() > .5) {
            return '#6100DC'
        } else {
            return '#0500FF'
        }
    }

    return (
        <svg className={props.className} style={{ top: `${props.top ? props.top : '29%'}` }} width="40vh" height="13.2vh" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M37.5 63.5593L5.02405 15.8898L69.976 15.8898L37.5 63.5593Z" fill="url(#paint0_linear_43_277)" fillOpacity="0.5" />
            <path d="M37.5 69.1889L5.02405 21.5194L69.976 21.5194L37.5 69.1889Z" fill="url(#paint1_linear_43_277)" fillOpacity="0.5" />
            <path d="M37.5 75L5.02405 27.3305L69.976 27.3305L37.5 75Z" fill="url(#paint2_linear_43_277)" fillOpacity="0.5" />
            <defs>
                <linearGradient id="paint0_linear_43_277" x1="37.5" y1="16.1441" x2="37.5" y2="62.0339" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6100DC" />
                    <stop offset="1" stopColor={getColor()} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paint1_linear_43_277" x1="37.5" y1="21.7736" x2="37.5" y2="67.6634" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6100DC" />
                    <stop offset="1" stopColor={getColor()} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paint2_linear_43_277" x1="37.5" y1="27.5847" x2="37.5" y2="73.4746" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6100DC" />
                    <stop offset="1" stopColor={getColor()} stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>

    )
}

export default AuthDeviceDownloadDeco;