

function VerticalLine(props){
    return(
        <div style={{top: props.top, left: props.left, height: props.height, backgroundColor: props.color}} className="verticalLine"></div>
    )
}


export default VerticalLine;