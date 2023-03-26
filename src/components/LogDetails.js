import Label from './Label';
import Button from '../components/Button.js'
import BackDeco from '../components/BackDeco.js'


function LogDetails(props) {

    const dateFormatter = () => {
        let date = new Date(props.logObj.tx);
        let s = date.toString().split(' ');
        return { date: s[0] + ' ' + s[1] + ' ' + s[2] + ' ' + s[3], time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}` }
    }


    if (props.show) {
        return (
            <div className="logDetailsContainer">
                <Label className="logDetailsTitle" bkg="#7000FF20" fontSize="2vh" color="#FFF" text={`${props.logObj.type}.${props.logObj.subtype}`}></Label>
                <Button color="#7000FF" bkg="#7000FF" child={<BackDeco style={{ width: "29%" }} color="#7000FF" />} className="logDetailsBackBtn" onClick={props.onBack}></Button>
                <Label fontSize="1.9vh" color="#BABABA" bkg="#6300E020" className="logDetailTypeLabel" style={{ top: '43.59375%', height: '6.09375%' }} text="Time and date"></Label>
                <Label fontSize="1.9vh" color="#FFF" bkg="#6300E020" className="logDetailActual" style={{ top: '43.59375%', height: '3.79375%', paddingBottom: '5%' }} text={dateFormatter().date}></Label>
                <Label fontSize="1.9vh" color="#FFF" className="logDetailActual" style={{ top: '45.99375%', height: '3.79375%'}} text={dateFormatter().time}></Label>
                <Label fontSize="1.9vh" color="#FFF" className="logDetailActual" bkg="#7000FF20" style={{ top: 'calc(43.59375% + (1 * 7%))', height: '6.09375%'}} text={props.logObj.details.device}></Label>
                <Label fontSize="1.9vh" color="#FFF" className="logDetailActual" bkg="#7000FF20" style={{ top: 'calc(43.59375% + (2 * 7%))', height: '6.09375%'}} text={props.logObj.details.browser}></Label>
                <Label fontSize="1.9vh" color="#FFF" className="logDetailActual" bkg="#7000FF20" style={{ top: 'calc(43.59375% + (3 * 7%))', height: '6.09375%'}} text={props.logObj.details.os}></Label>
                <Label fontSize="1.9vh" color="#FFF" className="logDetailActual" bkg="#7000FF20" style={{ top: 'calc(43.59375% + (4 * 7%))', height: '6.09375%'}} text={props.logObj.location.name}></Label>
                <Label fontSize="1.9vh" color="#BABABA" bkg="#6300E020" className="logDetailTypeLabel" style={{ top: 'calc(43.59375% + (1 * 7%))', height: '6.09375%' }} text="Device"></Label>
                <Label fontSize="1.9vh" color="#BABABA" bkg="#6300E020" className="logDetailTypeLabel" style={{ top: 'calc(43.59375% + (2 * 7%))', height: '6.09375%' }} text="Browser"></Label>
                <Label fontSize="1.9vh" color="#BABABA" bkg="#6300E020" className="logDetailTypeLabel" style={{ top: 'calc(43.59375% + (3 * 7%))', height: '6.09375%' }} text="Operating System"></Label>
                <Label fontSize="1.9vh" color="#BABABA" bkg="#6300E020" className="logDetailTypeLabel" style={{ top: 'calc(43.59375% + (4 * 7%))', height: '6.09375%' }} text="IP Location"></Label>
            
            </div>)
    } else {
        return '';
    }
}


export default LogDetails;