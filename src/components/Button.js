import { useState } from "react";

function Button(props) {
    const [bkgOpacity, setBkgOpacity] = useState(20);
    const ME = () => { setBkgOpacity(40) }
    const ML = () => { setBkgOpacity(20) }
    if (props.child == undefined && (props.show || props.show == undefined)) {
        return (
            <div onClick={props.onClick} onMouseEnter={ME} onMouseLeave={ML} id={props.id} className={'button ' + props.className} style={{ fontSize: props.fontSize, width: props.width, height: props.height, color: props.color, backgroundColor: props.bkg + bkgOpacity.toString(), border: 'solid 1px ' + props.color }}>{props.label}</div>
        )
    } else if(props.show || props.show == undefined) {
        return (
            <div onClick={props.onClick} onMouseEnter={ME} onMouseLeave={ML} id={props.id} className={'button ' + props.className} style={{ fontSize: props.fontSize, width: props.width, height: props.height, color: props.color, backgroundColor: props.bkg + bkgOpacity.toString(), border: 'solid 1px ' + props.color }}>{props.child}</div>
        )
    }
}

export default Button;