

function HorizontalLine(props){
    return(
        <div className={props.className} style={{top: props.top, left: props.left, width: props.width, backgroundColor: props.color}} className="horizontalLine"></div>
    )
}


export default HorizontalLine;