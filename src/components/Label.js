

function Label(props) {
    if (props.child == undefined && (props.show || props.show == undefined)) {
        return (
            <div onContextMenu={props.onContextMenu} onClick={props.onClick} id={props.id} className={'label ' + props.className} style={{ ...props.style, color: props.color, fontSize: props.fontSize, backgroundColor: props.bkg }}>{props.text}</div>
        )
    } else if (props.show || props.show == undefined) {
        return (
            <div onContextMenu={props.onContextMenu} onClick={props.onClick} id={props.id} className={'label ' + props.className} style={{ ...props.style, color: props.color, fontSize: props.fontSize, backgroundColor: props.bkg }}>{props.text}{props.child}</div>
        )
    }
}

export default Label;