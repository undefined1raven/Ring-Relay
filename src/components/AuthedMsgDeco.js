

function AuthedMsgDeco(props) {
    return (
        <svg id={props.id} className="notAuthedMsgDeco" width="2.3vh" height="2.3vh" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="15" height="13" fill={props.ghost ? '#0500FF' : '#00FFD1'} fillOpacity={props.bkgOpacity == undefined ? 0.3 : props.bkgOpacity} />
            <rect x="5.25" y="5.25" width="4.5" height="4.5" fill={props.ghost ? '#FFF' : '#00FFD1'} fillOpacity="0.2" stroke={props.ghost ? '#FFF' : '#00FFD1'} strokeWidth="0.5" />
            <path d="M10 4.5C10 4.1717 9.93534 3.84661 9.8097 3.54329C9.68406 3.23998 9.49991 2.96438 9.26777 2.73223C9.03562 2.50009 8.76002 2.31594 8.45671 2.1903C8.15339 2.06466 7.8283 2 7.5 2C7.1717 2 6.84661 2.06466 6.54329 2.1903C6.23998 2.31594 5.96438 2.50009 5.73223 2.73223C5.50009 2.96438 5.31594 3.23998 5.1903 3.54329C5.06466 3.84661 5 4.1717 5 4.5H5.52557C5.52557 4.24072 5.57664 3.98397 5.67587 3.74442C5.77509 3.50487 5.92053 3.28721 6.10387 3.10387C6.28721 2.92053 6.50487 2.77509 6.74442 2.67587C6.98397 2.57664 7.24071 2.52557 7.5 2.52557C7.75929 2.52557 8.01603 2.57664 8.25558 2.67587C8.49513 2.77509 8.71279 2.92053 8.89613 3.10387C9.07947 3.28721 9.22491 3.50487 9.32413 3.74442C9.42336 3.98397 9.47443 4.24071 9.47443 4.5H10Z" fill={props.ghost ? '#FFF' : '#00FFD1'} />
            <rect x="7" y="7" width="1" height="1" fill={props.ghost ? '#FFF' : '#00FFD1'} />
        </svg>

    )

}

export default AuthedMsgDeco;