

function Label(props) {
    if (props.child == undefined) {
        return (
            <div onClick={props.onClick} id={props.id} className={'label ' + props.className} style={{ ...props.style, color: props.color, fontSize: props.fontSize, backgroundColor: props.bkg }}>{props.text}</div>
        )
    }else{
        return (
            <div onClick={props.onClick} id={props.id} className={'label ' + props.className} style={{ ...props.style, color: props.color, fontSize: props.fontSize, backgroundColor: props.bkg }}>{props.text}{props.child}</div>
        )
    }
}

export default Label;