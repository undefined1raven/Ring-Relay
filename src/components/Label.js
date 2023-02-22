

function Label(props){
    return(
        <div id={props.id} className={'label ' + props.className} style={{color: props.color, fontSize: props.fontSize, backgroundColor: props.bkg}}>{props.text}</div>
    )
}

export default Label;