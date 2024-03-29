

function MsgTXDeco(props) {
    return (
        <svg className="msgTypeDeco" width="2.3vh" height="2.3vh" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="15" height="13" fill={props.bkg} fillOpacity={props.opacity} />
            <rect x="7.14648" y="2" width="1" height="8" fill={props.color} />
            <path d="M4.14642 6.70714L4.85353 6.00003L8.14648 9.5L7.14646 10L4.14642 6.70714Z" fill={props.color} />
            <path d="M10.682 6L11.3891 6.70711L8.14648 10L7.14647 9.53553L10.682 6Z" fill={props.color} />
        </svg>
    )
}

export default MsgTXDeco;