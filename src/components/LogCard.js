import Label from './Label';
import Button from '../components/Button.js'
import LogSeverityIndi from '../components/LogSeverityIndi.js'

function LogCard(props) {

    const colorController = () => {
        if (props.logObj.severity == 'info') {
            return { primary: '#9644FF', secondary: '#6326B1', bkg: '#651EC020' };
        } else if (props.logObj.severity == 'warning') {
            return { primary: '#FF7A00', secondary: '#8F4500', bkg: '#BE5B0020' };
        } else if (props.logObj.severity == 'important') {
            return { primary: '#FF0000', secondary: '#A30000', bkg: '#96000020' };
        } else if (props.logObj.severity == 'critical') {
            return { primary: '#FF0099', secondary: '#A10061', bkg: '#A1006120' };
        }
    }

    const dateFormatter = () => {
        let date = new Date(props.logObj.tx);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} on ${date.getDate().toString().padStart(2, '0')}.${(parseInt(date.getMonth()) + 1).toString().padStart(2, '0')}.${date.getFullYear().toString().substring(2, 4)}`
    }

    return (
        <div className="logCardContainer" style={{ backgroundColor: colorController().bkg }}>
            <Label style={{ top: '10.256410256%', left: '11.111111111%' }} fontSize="2vh" color={colorController().primary} text={`▣ ${props.logObj.type}.${props.logObj.subtype}`}></Label>
            <Label style={{ top: '12.956410256%', left: '69.75308642%', width: '28.395061728%', textAlign: 'end', paddingRight: '2%' }} fontSize="1.8vh" color={colorController().primary} text={props.logObj.location.name}></Label>
            <Label style={{ top: '61.538461538%', left: '11.111111111%', textAlign: 'start' }} fontSize="1.8vh" color={colorController().secondary} text={dateFormatter()}></Label>
            <Label style={{ top: '61.538461538%', left: '63.45308642%', width: '35%', textAlign: 'end', paddingRight: '2%' }} fontSize="1.8vh" color={colorController().secondary} text={props.logObj.ip}></Label>
            <LogSeverityIndi style={{left: '-2.5%'}} color={colorController().primary}></LogSeverityIndi>
        </div>)
}


export default LogCard;