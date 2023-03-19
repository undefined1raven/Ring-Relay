

function HorizontalLine(props){
    return(
        <div className={`horizontalLine ${props.className}`} style={{top: props.top, left: props.left, width: props.width, backgroundColor: props.color, ...props.style}} ></div>
    )
}


export default HorizontalLine;