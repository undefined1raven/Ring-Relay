import { useState } from "react";


function NewContactLoadingDeco(props) {
    const [oneOpacity, setOneOpacity] = useState(0.5);
    const [twoOpacity, setTwoOpacity] = useState(0.2);
    const [threeOpacity, setThreeOpacity] = useState(0.2);

    setInterval(() => {
        setOneOpacity(0.5);
        setTimeout(() => {
            setOneOpacity(0.2);
            setTwoOpacity(0.5);
            setThreeOpacity(0.2);
        }, 800);
        setTimeout(() => {
            setOneOpacity(0.2);
            setTwoOpacity(0.2);
            setThreeOpacity(0.5);
        }, 1600);
    }, 2000)

    if (props.show || props.show == undefined) {
        return (
            <svg id={props.id} width="39" height="25" viewBox="0 0 39 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="newContactLoadingDecoTile" d="M12.5 0L23.3253 6.25V18.75L12.5 25L1.67468 18.75V6.25L12.5 0Z" fill="#4200FF" fillOpacity={oneOpacity} />
                <path className="newContactLoadingDecoTile" d="M19.5 0L30.3253 6.25V18.75L19.5 25L8.67468 18.75V6.25L19.5 0Z" fill="#4200FF" fillOpacity={twoOpacity} />
                <path className="newContactLoadingDecoTile" d="M26.5 0L37.3253 6.25V18.75L26.5 25L15.6747 18.75V6.25L26.5 0Z" fill="#4200FF" fillOpacity={threeOpacity} />
            </svg>
        )
    } else {
        return ''
    }
}

export default NewContactLoadingDeco;