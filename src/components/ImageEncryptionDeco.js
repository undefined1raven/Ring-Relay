
import { useEffect, useState } from "react";


function ImageEncryptionDeco(props) {

    const [random, setRandom] = useState(Math.random());

    useEffect(() => {
        let int = setInterval(() => {
            setRandom(Math.random());
        }, 300);
        return () => { clearInterval(int) }
    }, [])


    const getOpacity = () => {
        let ran = Math.random()
        if (ran < .1) {
            return .1;
        } else {
            return ran
        }
    }

    return <svg style={{ position: 'absolute', ...props.style }} width="25vh" height="10vh" viewBox="0 0 195 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="2" rx="1" fill="#4C2FFF" fillOpacity={getOpacity()} />
        <rect y="7" width="20" height="2" rx="1" fill="#4C2FFF" fillOpacity={getOpacity()} />
        <rect x="25" width="20" height="2" rx="1" fill="#4C2FFF" fillOpacity={getOpacity()} />
        <rect x="25" y="7" width="20" height="2" rx="1" fill="#4C2FFF" fillOpacity={getOpacity()} />
        <rect x="50" width="20" height="2" rx="1" fill="#4C2FFF" fillOpacity={getOpacity()}/>
        <rect x="50" y="7" width="20" height="2" rx="1" fill="#4C2FFF" fillOpacity={getOpacity()} />
        <rect x="75" width="20" height="2" rx="1" fill="#4C2FFF" fillOpacity={getOpacity()}/>
        <rect x="75" y="7" width="20" height="2" rx="1" fill="#4C2FFF" fillOpacity={getOpacity()} />
        <rect x="100" width="20" height="2" rx="1" fill="#4C2FFF" fillOpacity={getOpacity()}/>
        <rect x="100" y="7" width="20" height="2" rx="1" fill="#4C2FFF" fillOpacity={getOpacity()} />
        <rect x="125" width="20" height="2" rx="1" fill="#4C2FFF" fillOpacity={getOpacity()}/>
        <rect x="125" y="7" width="20" height="2" rx="1" fill="#4C2FFF" fillOpacity={getOpacity()} />
        <rect x="150" width="20" height="2" rx="1" fill="#4C2FFF" fillOpacity={getOpacity()}/>
        <rect x="150" y="7" width="20" height="2" rx="1" fill="#4C2FFF" fillOpacity={getOpacity()} />
        <rect x="175" width="20" height="2" rx="1" fill="#4C2FFF" fillOpacity={getOpacity()}/>
        <rect x="175" y="7" width="20" height="2" rx="1" fill="#4C2FFF" fillOpacity={getOpacity()} />
    </svg>
}


export default ImageEncryptionDeco;