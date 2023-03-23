
import MsgTypeColorDeco from '../components/MsgTypeColorDeco.js'
import ColorPreview from '../components/ColorPreview.js'
import Label from '../components/Label.js'
import Button from '../components/Button.js'

function ColorMsgTypePreview(props) {

    const pickColor = () => {
        document.getElementById('colorPicker').focus();
        document.getElementById('colorPicker').click();
    }

    if (props.show) {
        return (
            <div onClick={pickColor} style={{ backgroundColor: props.bkg }} className="colorMsgTypePreviewContainer">
                <MsgTypeColorDeco style={{ left: '3%' }}></MsgTypeColorDeco>
                <ColorPreview color={props.color} style={{ left: '15%' }}></ColorPreview>
                <Label style={{ left: '46%' }} fontSize="2.2vh" color={props.color} text={props.color}></Label>
                <Button onClick={props.onCancel} fontSize="3.4vh" color="#929292" bkg="#929292" width="4.8vh" height="4.8vh" style={{ left: '83%', borderRadius: '5px', backgroundColor: '#00000000' }} label="×"></Button>
                <input value="#8100D0" onChange={props.onColorInputChange} id="colorPicker" type='color' style={{ display: 'none' }}></input>
            </div>)
    } else {
        return ''
    }
}

export default ColorMsgTypePreview;