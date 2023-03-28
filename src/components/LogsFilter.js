import Label from './Label';
import Button from '../components/Button.js'
import HorizontalLine from '../components/HorizontalLine.js'
import BackDeco from '../components/BackDeco.js'

function LogsFilter(props) {

    const colorController = (filterKey) => {
        if (props.logFilters[filterKey]) {
            return { color: '#FFFFFF', bkg: '#7000FF' };
        } else {
            return { color: '#969696', bkg: '#340077' };
        }
    }

    const flipFilter = (filterKey) => {
        return () => props.flipFilter(filterKey);
    }

    if (props.show) {
        return (
            <div className="logFilterContainer">
                <Label fontSize="2vh" text="Filter Logs" id="filterLogsTitle" color="#FFF" bkg="#7000FF20"></Label>
                <Button color="#7000FF" child={<BackDeco style={{ width: "29%" }} color="#7000FF" />} className="logDetailsBackBtn" style={{ top: '1.71875%' }} onClick={props.onBack}></Button>
                <Label fontSize="2vh" text="Account" className="filterLogsTypeTitle" color="#FFF" style={{ top: '9.6875%' }} bkg="#7000FF20"></Label>
                <Label fontSize="2vh" text="Security" className="filterLogsTypeTitle" color="#FFF" style={{ top: '34.84375%' }} bkg="#7000FF20"></Label>
                <Button onClick={flipFilter('login')} fontSize="1.9vh" className="filterLogsMainButton" label="Log In" color={colorController('login').color} bkg={colorController('login').bkg} style={{ top: 'calc(16.5625%)', border: `solid 1px ${colorController('login').bkg}` }}></Button>
                <Button onClick={flipFilter('usernameChanged')} fontSize="1.9vh" className="filterLogsMainButton" label="Username Changed" color={colorController('usernameChanged').color} bkg={colorController('usernameChanged').bkg} style={{ top: 'calc(23.4375%)', border: `solid 1px ${colorController('usernameChanged').bkg}` }}></Button>
                <HorizontalLine top="31.40625%" width="79.055555556%" color="#7000FF" />
                <HorizontalLine top="71.09375%" width="79.055555556%" color="#7000FF" />
                <HorizontalLine top="82.34375%" width="79.055555556%" color="#7000FF" />
                <Button onClick={flipFilter('passwordReset')} fontSize="1.9vh" className="filterLogsMainButton" label="Password Changed" color={colorController('passwordReset').color} bkg={colorController('passwordReset').bkg} style={{ top: '41.875%', border: `solid 1px ${colorController('passwordReset').bkg}` }}></Button>
                <Button onClick={flipFilter('keysExport')} fontSize="1.9vh" className="filterLogsMainButton" label="Private Keys Export" color={colorController('keysExport').color} bkg={colorController('keysExport').bkg} style={{ top: '49.0625%', border: `solid 1px ${colorController('keysExport').bkg}` }}></Button>
                <Button onClick={flipFilter('keysImport')} fontSize="1.9vh" className="filterLogsMainButton" label="Private Keys Import" color={colorController('keysImport').color} bkg={colorController('keysImport').bkg} style={{ top: '56.09375%', border: `solid 1px ${colorController('keysImport').bkg}` }}></Button>
                <Button onClick={flipFilter('keysRegen')} fontSize="1.9vh" className="filterLogsMainButton" label="Key Pairs Regen" color={colorController('keysRegen').color} bkg={colorController('keysRegen').bkg} style={{ top: '63.125%', border: `solid 1px ${colorController('keysRegen').bkg}` }}></Button>
                <Button onClick={flipFilter('last24h')} fontSize="1.9vh" className="filterLogsMainButton" label="Last 24h" color={colorController('last24h').color} bkg={colorController('last24h').bkg} style={{ left: '11.111111111%', width: '21.944444444%', top: '74.375%', border: `solid 1px ${colorController('last24h').bkg}` }}></Button>
                <Button onClick={flipFilter('lastWeek')} fontSize="1.9vh" className="filterLogsMainButton" label="Last Week" color={colorController('lastWeek').color} bkg={colorController('lastWeek').bkg} style={{ left: '36.944444444%', width: '21.944444444%', top: '74.375%', border: `solid 1px ${colorController('lastWeek').bkg}` }}></Button>
                <Button onClick={flipFilter('lastMonth')} fontSize="1.9vh" className="filterLogsMainButton" label="Last Month" color={colorController('lastMonth').color} bkg={colorController('lastMonth').bkg} style={{ left: '62.777777778%', width: '26.388888889%', top: '74.375%', border: `solid 1px ${colorController('lastMonth').bkg}` }}></Button>
                <Button onClick={flipFilter('info')} fontSize="1.9vh" className="filterLogsMainButton" label="Info" color={props.logFilters.info ? '#9644FF' : '#999999'} bkg={props.logFilters.info ? '#9644FF' : '#999999'} style={{ left: '11.111111111%', width: '37.777777778%', top: '85.625%', border: `solid 1px ${props.logFilters.info ? '#9644FF' : '#999999'}` }}></Button>
                <Button onClick={flipFilter('warning')} fontSize="1.9vh" className="filterLogsMainButton" label="Warning" color={props.logFilters.warning ? '#FF7A00' : '#999999'} bkg={props.logFilters.warning ? '#FF7A00' : '#999999'} style={{ left: '51.388888889%', width: '37.777777778%', top: '85.625%', border: `solid 1px ${props.logFilters.warning ? '#FF7A00' : '#999999'}` }}></Button>
                <Button onClick={flipFilter('important')} fontSize="1.9vh" className="filterLogsMainButton" label="Important" color={props.logFilters.important ? '#FF0000' : '#999999'} bkg={props.logFilters.important ? '#FF0000' : '#999999'} style={{ left: '11.111111111%', width: '37.777777778%', top: '92.65625%', border: `solid 1px ${props.logFilters.important ? '#FF0000' : '#999999'}` }}></Button>
                <Button onClick={flipFilter('critical')} fontSize="1.9vh" className="filterLogsMainButton" label="Critical" color={props.logFilters.critical ? '#FF0099' : '#999999'} bkg={props.logFilters.critical ? '#FF0099' : '#999999'} style={{ left: '51.388888889%', width: '37.777777778%', top: '92.65625%', border: `solid 1px ${props.logFilters.critical ? '#FF0099' : '#999999'}` }}></Button>
                <Label text={props.filteredCountLabel} color="#808080" style={{top: '5.4375%'}} fontSize="1.6vh"></Label>
            </div>)
    } else {
        return ''
    }
}

export default LogsFilter;