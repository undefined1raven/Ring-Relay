

function CommonSigMismatchDeco(props) {
    return (
        <svg className={props.className} width="100%" height="100%" viewBox="0 0 50 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="50" height="21" fill="#FF002E" fillOpacity="0.2" />
            <rect x="35.5" y="11.5" width="2" height="2" transform="rotate(90 35.5 11.5)" stroke="#FF002E" />
            <rect x="40.75" y="12.25" width="0.5" height="4.5" transform="rotate(90 40.75 12.25)" stroke="#FF002E" strokeWidth="0.5" />
            <rect x="40.75" y="13.25" width="0.5" height="0.5" transform="rotate(90 40.75 13.25)" stroke="#FF002E" strokeWidth="0.5" />
            <rect x="38.75" y="13.25" width="0.5" height="0.5" transform="rotate(90 38.75 13.25)" stroke="#FF002E" strokeWidth="0.5" />
            <rect x="33.25" y="16.25" width="7.5" height="0.5" stroke="#FF002E" strokeWidth="0.5" strokeDasharray="1 1" />
            <rect x="33.25" y="18.25" width="7.5" height="0.5" stroke="#FF002E" strokeWidth="0.5" strokeDasharray="1 1" />
            <circle cx="16" cy="10" r="5.5" transform="rotate(-90 16 10)" stroke="#FF002E" strokeDasharray="2 2" />
            <circle cx="11" cy="10" r="5.5" transform="rotate(-90 11 10)" stroke="#FF002E" strokeDasharray="2 2" />
        </svg>
    )
}

export default CommonSigMismatchDeco;