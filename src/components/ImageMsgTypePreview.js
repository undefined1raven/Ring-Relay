import Label from '../components/Label.js'
import Button from '../components/Button.js'
import MsgTypeImageDeco from '../components/MsgTypeImgDeco.js'



function ImageMsgTypePreview(props) {
    if (props.show) {
        return (
            <div className="locationMsgTypePreviewContainer" style={{ backgroundColor: props.bkg }}>
                <Label style={{ top: '55%', left: '23%' }} fontSize="1.9vh" text={props.selectedImage.ini && props.selectedImage.fileSize ? `${props.selectedImage.fileSize}MB` : '---'} color={props.ghost ? "#0013BA" : "#6300E0"}></Label>
                <Label style={{ overflow: 'hidden', height: '30%', width: "58%", top: '15%', left: '23%' }} fontSize="2.1vh" text={props.selectedImage.ini && props.selectedImage.fileName ? `${props.selectedImage.fileName}` : 'No File Selected'} color="#FFF"></Label>
                <MsgTypeImageDeco color={props.ghost ? "#0500FF" : "#8627FF"} style={{ width: '15vh', height: '5vh', left: '-10.8%', marginTop: '2.5%' }}></MsgTypeImageDeco>
                <Button onClick={props.onCancel} fontSize="3.4vh" color="#929292" bkg="#929292" width="4.8vh" height="4.8vh" style={{ left: '83%', borderRadius: '5px', backgroundColor: '#00000000' }} label="×"></Button>
            </div>
        )
    } else {
        return '';
    }
}


export default ImageMsgTypePreview;