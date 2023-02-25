

function Label(props){
    return(
        <div id={props.id} className={'label ' + props.className} style={{...props.style, color: props.color, fontSize: props.fontSize, backgroundColor: props.bkg}}>{props.text}</div>
    )
}

export default Label;