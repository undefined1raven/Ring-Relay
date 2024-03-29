
import Label from '../components/Label.js'
import Button from '../components/Button.js'
import { useEffect, useState, memo } from 'react'
import NotAuthedMsgDeco from '../components/NotAuthedMsgDeco.js'
import MsgTXDeco from '../components/MsgTXDeco.js'
import MsgRXDeco from '../components/MsgRXDeco.js'
import AuthedMsgDeco from '../components/AuthedMsgDeco.js'
import MsgLikedDeco from '../components/MsgLikedDeco.js'
import CommonSigMismatchDeco from '../components/CommonSigMismatchDeco.js'
import MsgGhost from '../components/MsgGhost.js'
import ColorPreview from '../components/ColorPreview.js'
import MsgTypeColorDeco from '../components/MsgTypeColorDeco.js'
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { Marker } from 'react-map-gl';
import StaticMapMarker from '../components/StaticMapMarker.js'
import ImageProcessingSendBtnDeco from './ImageProcessingSendBtnDeco.js'

const Message = memo(function Message(props) {
    const [decrypted, setDecrypted] = useState(props.decrypted);
    const [liked, setLiked] = useState(props.msgObj.liked);
    const [deleted, setDeleted] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [ghost, setGhost] = useState(false);
    const [location, setLocation] = useState({ ini: false, long: 0, lat: 0, zoom: 5 });
    const [showMap, setShowMap] = useState(false);
    const [isMapInteractive, setIsMapInteractive] = useState(false);
    const [dynamicMarginBottom, setDynamicMarginBottom] = useState({ ini: false, margin: '' });

    useEffect(() => {
        document.addEventListener('click', (e) => {
            if (e.target.innerText != 'Delete') {
                setShowMenu(false)
            }
        })
        if (props.msgObj.ghost != undefined) {
            setGhost(props.msgObj.ghost)
        }
        if (props.msgObj.contentType == 'location') {
            try {
                let lob = JSON.parse(props.msgObj.content);
                setLocation({ ...lob, ini: true });
            } catch (e) { }
        }
    }, [])

    useEffect(() => {
        if (location.ini == true) {
            setShowMap(true)
        }
    }, [location])


    useEffect(() => {
        setLiked(props.msgObj.liked)
    }, [props.msgObj])

    function useSingleAndDoubleClick(actionSimpleClick, actionDoubleClick, delay = 250) {//thx stackoverflow
        const [click, setClick] = useState(0);

        useEffect(() => {
            const timer = setTimeout(() => {
                // simple click
                if (click === 1) actionSimpleClick();
                setClick(0);
            }, delay);

            // the duration between this click and the previous one
            // is less than the value of delay = double-click
            if (click === 2 && !showMenu) actionDoubleClick();

            return () => clearTimeout(timer);

        }, [click]);

        return () => setClick(prev => prev + 1);
    }

    const onDoubleClick = () => {
        setLiked(!liked)
        props.likeMessageUpdate({ state: !liked, MID: props.msgObj.MID });
    }

    const onContextMenu = (e) => {
        e.preventDefault();
        if (!deleted) {
            setShowMenu(true)
        }
    }

    const msgContentController = () => {
        if (showMenu) {
            return '|';
        } else {
            if (deleted) {
                return '[Deleted]';
            } else if (decrypted) {
                if (props.msgObj.contentType == undefined) {
                    return props.msgObj.content;
                } else if (props.msgObj.contentType == 'text') {
                    return props.msgObj.content;
                } else if (props.msgObj.contentType == 'color') {
                    return '<>';
                } else if (props.msgObj.contentType == 'location') {
                    return '[Location]'
                } else if (props.msgObj.contentType == 'image' && props.msgObj.content == '[Decrypting Image]') {
                    return '[Decrypting Image]'
                }
            } else if (props.msgObj.contentType != 'image') {
                return '[Failed to decrypt]';
            } else {
                return '[Failed to decrypt image]';
            }
        }
    }

    const onCopy = () => {
        navigator.clipboard.writeText(props.msgObj.content).then(r => { })
    }

    const onDelete = () => {
        if (props.msgObj.type == 'tx') {
            setDeleted(true)
            setShowMenu(false)
            props.deleteMessage(props.msgObj.MID);
        }
    }

    const MsgTimeLabelColorController = () => {
        if (props.msgObj.contentType == 'image') {
            return { bkg: '#000000AA', color: '#FFF' };
        } else {
            if (ghost) {
                return { bkg: '#0500FF50', color: '#FFF' };
            } else {
                return { bkg: '#55007350', color: '#8300B0' };
            }
        }
    }

    const MsgTypeDecoColorController = () => {
        if (props.msgObj.contentType == 'image') {
            return { bkg: '#000000', color: '#FFF' };
        } else {
            if (ghost) {
                return { bkg: '#0500FF', color: '#FFF' };
            } else {
                return { bkg: '#550073', color: '#8300B0' };
            }
        }
    }

    const onImageLoadError = (e) => {
        setDecrypted(false);
    }

    const onMsgClick = useSingleAndDoubleClick(() => { }, onDoubleClick)
    const msgDateUnix = new Date(parseInt(props.msgObj.tx));
    const menuController = () => {
        if (showMenu) {
            return (
                <>
                    <Button onClick={onDelete} color={props.msgObj.type == 'tx' ? "#FF002E" : '#999'} className="msgDeleteButton" bkg={props.msgObj.type == 'tx' ? "#FF002E" : ''} label="Delete"></Button>
                    <Button onClick={onCopy} color={ghost ? "#FFF" : "#7100FF"} style={{ border: `solid 1px ${ghost ? "#0500FF" : '#7100FF'}` }} className="msgCopyButton" bkg={ghost ? "#0500FF" : "#7100FF"} label="Copy"></Button>
                    {/* <VerticalLine height="2.3vh" color="#6100DC40" left="50%" top="7vh" /> */}
                </>
            )
        } else {
            return (
                <>
                    {props.msgObj.contentType == 'image' && props.msgObj.content == '[Decrypting Image]' ? <ImageProcessingSendBtnDeco style={{ top: '20%', left: '48%' }} /> : ''}
                    {props.msgObj.contentType == 'image' && props.msgObj.content != '[Decrypting Image]' ? <img id={`IMG-${props.msgObj.MID}`} style={{ position: 'absolute', top: '0%', left: '0%', height: 'auto', width: '100%', marginBottom: '5%' }} onError={onImageLoadError} src={`data:image/webp;base64, ${props.msgObj.content}`}></img> : ''}
                    {props.msgObj.contentType == 'color' ?
                        <div style={{ top: '0%', left: '0%', backgroundColor: '#00000000' }} className="colorMsgTypePreviewContainer">
                            <MsgTypeColorDeco style={{ left: '3%' }}></MsgTypeColorDeco>
                            <ColorPreview color={props.msgObj.content} style={{ left: '15%' }}></ColorPreview>
                            <Label style={{ left: '46%' }} fontSize="2.2vh" color={props.msgObj.content} text={props.msgObj.content}></Label></div>
                        : ''}
                    {props.msgObj.contentType == 'location' && showMap ? <Map
                        mapLib={maplibregl}
                        initialViewState={{
                            longitude: location.long,
                            latitude: location.lat,
                            zoom: location.zoom
                        }}

                        style={{ position: 'absolute', width: "100%", height: "100%", top: 0, left: 0 }}
                        mapStyle="https://api.maptiler.com/maps/fcae873d-7ff0-480b-8d6d-41963084ad90/style.json?key=R1cyh6lj1mTfNEycg2N1"

                    ><Marker children={<StaticMapMarker />} draggable={false} longitude={location.long} latitude={location.lat}></Marker></Map> : ""}
                    {!isMapInteractive && props.msgObj.contentType == 'location' && showMap ? <div className='mapInteractionDisallower' style={{ position: 'absolute', width: '100%', height: '100%', top: '0%', left: '0%' }}></div> : ''}
                    {props.msgObj.contentType == 'location' && showMap ? <Button onClick={() => setIsMapInteractive(prev => !prev)} className="messageMapGoInteractiveButton" fontSize="1.7vh" width="60%" color="#999" label={`Tap here to go ${isMapInteractive ? 'static' : 'interactive'}`} style={{ backgroundColor: `${ghost ? "#00109EAA" : "#2E0067AA"}`, border: `solid 1px ${ghost ? "#0500FF" : "#7100FF"}` }}></Button> : ''}
                    <Label className="msgTime" bkg={MsgTimeLabelColorController().bkg} color={MsgTimeLabelColorController().color} text={`${msgDateUnix.getHours().toString().padStart(2, '0')}:${msgDateUnix.getMinutes().toString().padStart(2, '0')}`} fontSize="2.5vw"></Label>
                    {props.msgObj.auth ? <AuthedMsgDeco bkgOpacity={props.msgObj.contentType == 'image' ? '0.8' : '0.3'} signed={props.msgObj.signed} isImage={props.msgObj.contentType == 'image'} ghost={ghost} /> : <NotAuthedMsgDeco />}
                    {props.msgObj.type == 'rx' ? <MsgRXDeco color={MsgTypeDecoColorController().color} bkg={MsgTypeDecoColorController().bkg} opacity={props.msgObj.contentType == 'image' ? '0.8' : '0.3'} /> : <MsgTXDeco bkg={MsgTypeDecoColorController().bkg} color={MsgTypeDecoColorController().color} opacity={props.msgObj.contentType == 'image' ? '0.8' : '0.3'} />}
                    {ghost ? <MsgGhost /> : ''}
                    {(props.msgObj.seen && props.msgObj.type == 'tx') ? <Label fontSize="2.5vw" className="msgSeen" color={ghost ? '#0500FF' : "#8300B0"} bkg={ghost ? '#0500FF20' : "#55007340"} text="Seen" /> : ''}
                    {(liked && !deleted) ? <MsgLikedDeco /> : ''}
                    <div className='chashContainer' style={{ display: 'none' }}>
                        <CommonSigMismatchDeco className="chashIndi"></CommonSigMismatchDeco>
                        <Label fontSize="2.5vw" className="chashLabel" color="#FF002E" text="inad2" />
                    </div>
                    <div className='signatureContainer'>
                        {/* {(props.msgObj.signed == true || props.msgObj.signed == 'self' || props.msgObj.signed == 'local') ? <SignatureVerificatioSuccessDeco color={SignatureSuccessDecoColorHash[props.msgObj.signed]} className="sigIndi" /> : <SignatureVerificationFailedDeco className="sigIndi" />} */}
                    </div>
                    <Label bkg={`${ghost ? '#0500FF50' : `${sigLabelHash[props.msgObj.signed]?.color}30`}`} fontSize="2.5vw" className="sigLabel" color={ghost ? "#FFF" : sigLabelHash[props.msgObj.signed]?.color} text={sigLabelHash[props.msgObj.signed]?.label} />
                    <Label className="msgDate" bkg={ghost ? '#0500FF50' : "#6100DC20"} color={ghost ? '#FFF' : "#8300B0"} text={`${msgDateUnix.getDate().toString().padStart(2, '0')}.${(parseInt(msgDateUnix.getMonth()) + 1).toString().padStart(2, '0')} [${msgDateUnix.getFullYear().toString().substring(2, 4)}]`} fontSize="2.5vw"></Label>
                    {/* <VerticalLine height="2.3vh" color="#6100DC40" left="50%" top="7vh" /> */}
                </>
            )
        }
    }

    const messageContentColorController = () => {
        if (decrypted) {
            if (props.msgObj.contentType == undefined || props.msgObj.contentType == 'text') {
                if (ghost) {
                    return props.msgObj.type == 'rx' ? '#FFF' : '#4B47FF';
                } else {
                    return props.msgObj.type == 'rx' ? '#FFF' : '#C09AFF';
                }
            } else if (props.msgObj.contentType == 'image' && props.msgObj.content == '[Decrypting Image]') {
                return '#4C2FFF';
            } else {
                return '#00000000';
            }
        } else {
            return '#CA0024';
        }
    }

    const messageBkgController = () => {
        if (decrypted) {
            if (ghost) {
                return '#0500FF20';
            } else {
                return '#6100DC20';
            }
        } else {
            return '#88001830';
        }
    }

    const messageBorderColorController = () => {
        if (props.msgObj.contentType != 'image') {

            if (decrypted) {
                if (ghost) {
                    return '#0500FF';
                } else {
                    return '#7000FF';
                }
            } else {
                return '#E20028';
            }
        } else {
            return '';
        }
    }

    const sigLabelHash = {
        local: { label: 'Local ▣', color: '#7000FF' }, 'self': { label: '[Own SIG]', color: '#00FFD1' }, 'no_self': { label: '[OSIG_F]', color: '#f39e00' }, true: { label: '[Signed]', color: '#00FFD1' }, false: { label: 'SIG Fail', color: '#FF002E' }
    };

    useEffect(() => {
        let dynamicMarginBottom = document.getElementById(`IMG-${props.msgObj.MID}`)?.clientHeight - ((0.5 / 100) * document.documentElement.clientHeight);
        if (dynamicMarginBottom != NaN && dynamicMarginBottom != undefined && dynamicMarginBottom > 0) {
            setDynamicMarginBottom({ ini: true, margin: `${dynamicMarginBottom}px` });
        }
    }, [])

    return (
        <div>
            <Label onContextMenu={onContextMenu} onClick={(e) => onMsgClick(e)} className={`msgContainer ${props.className}`} color={messageContentColorController()} text={msgContentController()} fontSize="4.5vw" bkg={messageBkgController()} style={{ borderLeft: `solid 1px ${messageBorderColorController()}`, paddingTop: `${props.msgObj.contentType == 'location' ? '30%' : 'auto'}`, marginBottom: `${props.msgObj.contentType == 'image' ? dynamicMarginBottom.margin : '5%'}` }} child={
                decrypted ?
                    <div>
                        {menuController()}
                    </div> : ''}
            ></Label>
        </div >
    )
});

export default Message;