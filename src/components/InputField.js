import VerticalLine from '../components/VerticalLine.js'


function InputField(props){
    return(
        <div id={props.id} className="inputFieldContainer">
            <VerticalLine color={props.color} top="0%" left="0%" height="100%"></VerticalLine>
            <input autoComplete={props.autoComplete} id={props.fieldID} onFocus={props.onFocus} value={props.value} onChange={props.onChange} style={{backgroundColor: props.color + '20', borderLeft: 'solid 1px ' + props.color}} required={true} className='inputField' name={props.name} placeholder={props.placeholder} spellCheck={false} type={props.type}></input>
        </div>
    )
}

export default InputField;