

function MsgTXDeco(props) {
    return (
        <svg className="msgTypeDeco" width="2.3vh" height="2.3vh" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="15" height="13" fill={props.bkg} fillOpacity={props.opacity} />
            <rect x="8.26782" y="10.2678" width="1" height="8" transform="rotate(-180 8.26782 10.2678)" fill={props.color} />
            <path d="M11.2679 5.56064L10.5608 6.26775L7.26782 2.76778L8.26785 2.26775L11.2679 5.56064Z" fill={props.color} />
            <path d="M4.7323 6.26778L4.02519 5.56067L7.26782 2.26778L8.26783 2.73224L4.7323 6.26778Z" fill={props.color} />
        </svg>

    )
}

export default MsgTXDeco;