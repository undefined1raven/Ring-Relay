

function NewMsgsDeco(props) {
    if (props.show) {
        return (
            <svg className="newMsgsDeco" width="20%" height="45%" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3.53554" width="5" height="5" transform="rotate(-45 3 3.53554)" fill={props.color} fillOpacity="0.5" />
                <rect y="3.53554" width="5" height="5" transform="rotate(-45 0 3.53554)" fill={props.color} fillOpacity="0.5" />
                <rect x="6" y="3.53554" width="5" height="5" transform="rotate(-45 6 3.53554)" fill={props.color} fillOpacity="0.5" />
                <rect x="3" y="8.53554" width="5" height="5" transform="rotate(-45 3 8.53554)" fill={props.color} fillOpacity="0.5" />
                <rect y="8.53554" width="5" height="5" transform="rotate(-45 0 8.53554)" fill={props.color} fillOpacity="0.5" />
                <rect x="6" y="8.53554" width="5" height="5" transform="rotate(-45 6 8.53554)" fill={props.color} fillOpacity="0.5" />
            </svg>
        )

    } else {
        return '';
    }
}

export default NewMsgsDeco;