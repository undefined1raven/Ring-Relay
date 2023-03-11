import { useEffect, useState } from "react"



function AuthDeviceScanDeco(props) {


    const [random, setRandom] = useState(Math.random());

    setInterval(() => {
        setRandom(Math.random());
    }, 1000);

    useEffect(() => {}, [random])

    const getColor = () => {
        if (Math.random() > .5) {
            return '#6100DC'
        } else {
            return '#0500FF'
        }
    }
    return (
        <svg className={props.className} width="45vh" height="8.2vh" viewBox="0 0 173 67" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M33.5 0L62.5118 16.75V50.25L33.5 67L4.48815 50.25V16.75L33.5 0Z" fill="url(#paint0_linear_43_294)" />
            <path d="M45.5 0L74.5118 16.75V50.25L45.5 67L16.4881 50.25V16.75L45.5 0Z" fill="url(#paint1_linear_43_294)" />
            <path d="M57.5 0L86.5118 16.75V50.25L57.5 67L28.4881 50.25V16.75L57.5 0Z" fill="url(#paint2_linear_43_294)" />
            <path d="M139.5 0L110.488 16.75V50.25L139.5 67L168.512 50.25V16.75L139.5 0Z" fill="url(#paint3_linear_43_294)" />
            <path d="M127.5 0L98.4882 16.75V50.25L127.5 67L156.512 50.25V16.75L127.5 0Z" fill="url(#paint4_linear_43_294)" />
            <path d="M115.5 0L86.4882 16.75V50.25L115.5 67L144.512 50.25V16.75L115.5 0Z" fill="url(#paint5_linear_43_294)" />
            <defs>
                <linearGradient id="paint0_linear_43_294" x1="21" y1="7.5" x2="51" y2="65.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6100DC" />
                    <stop offset="1" stopColor="#333" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paint1_linear_43_294" x1="33" y1="7.5" x2="63" y2="65.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6100DC" />
                    <stop offset="1" stopColor={getColor()} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paint2_linear_43_294" x1="45" y1="7.5" x2="75" y2="65.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6100DC" />
                    <stop offset="1" stopColor={getColor()} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paint3_linear_43_294" x1="152" y1="7.5" x2="122" y2="65.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6100DC" />
                    <stop offset="1" stopColor={getColor()} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paint4_linear_43_294" x1="140" y1="7.5" x2="110" y2="65.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6100DC" />
                    <stop offset="1" stopColor={getColor()} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paint5_linear_43_294" x1="128" y1="7.5" x2="98" y2="65.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6100DC" />
                    <stop offset="1" stopColor={getColor()} stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>

    )
}


export default AuthDeviceScanDeco;