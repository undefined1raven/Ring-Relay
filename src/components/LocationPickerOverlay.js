import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { NavigationControl } from 'react-map-gl';
import LocationIndi from '../components/LocationIndi.js'
import Button from '../components/Button.js'
import Label from '../components/Label.js'
import { useEffect, useState } from 'react';

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //max e | min i
}

function LocationPickerOverlay(props) {
    const [mapVisible, setMapVisible] = useState(true)
    const [loadingLabelVisible, setLoadingLabelVisible] = useState(true)
    const [location, setLocation] = useState({ lat: 46.774, long: 8.362, zoom: 3 })


    useEffect(() => {
        props.updateLocationInput({ viewState: { longitude: location.long, latitude: location.lat, zoom: 3 } })
    }, [])

    useEffect(() => {
        if (mapVisible == false) {
            setTimeout(() => {
                setMapVisible(true)
            }, 80);
        }
    }, [mapVisible])

    const getDeviceLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                if (position.coords.latitude && position.coords.longitude) {
                    setLocation({ lat: position.coords.latitude, long: position.coords.longitude, zoom: 15 });
                    setMapVisible(false);
                    props.updateLocationInput({ viewState: { longitude: position.coords.longitude, latitude: position.coords.latitude, zoom: 15 } })
                    setTimeout(() => {
                        setMapVisible(true)
                    }, 20);
                }
            }, () => { })
        }
    }


    if (props.show) {
        const update = (e) => props.updateLocationInput(e);

        return (
            <div className="locPickerOverlayContainer">
                {mapVisible ? <Map
                    onZoom={(e) => update(e)}
                    onMove={(e) => update(e)}
                    onLoad={(e) => { update(e); setLoadingLabelVisible(false) }}
                    onDragStart={(e) => update(e)}
                    onDragEnd={(e) => update(e)}
                    onBoxZoomEnd={(e) => update(e)}
                    onDrag={(e) => update(e)} mapLib={maplibregl}
                    initialViewState={{
                        longitude: location.long,
                        latitude: location.lat,
                        zoom: location.zoom
                    }}
                    style={{ position: 'absolute', width: "100%", height: "100%", borderLeft: 'solid 1px #7000FF' }}
                    mapStyle="https://api.maptiler.com/maps/fcae873d-7ff0-480b-8d6d-41963084ad90/style.json?key=R1cyh6lj1mTfNEycg2N1"
                >
                    {/* <NavigationControl position="top-left" /> */}
                </Map>
                    : ''}
                {!loadingLabelVisible ? <LocationIndi></LocationIndi> : ''}
                {!loadingLabelVisible ? <Button onClick={getDeviceLocation} bkg={props.ghost ? "#0500FF" : "#7100FF"} fontSize="2vh" width="60%" height="6%" className="locationPickerUseDeviceLocationButton" color={props.ghost ? "#0500FF" : "#7100FF"} label="Use Device Location" style={{ backgroundColor: `${props.ghost ? "rgba(15, 0, 120, 0.7)" : 'rgba(25, 0, 15, 0.7)'}`, border: `solid 1px ${props.ghost ? "#0500FF" : '#7100FF'}`, color: `${props.ghost ? '#FFF' : '#7100FF'}` }}></Button> : ''}
                <Label show={loadingLabelVisible} fontSize="2vh" color="#001AFF" style={{ borderRadius: '5px', width: '50%', height: '5%' }} bkg="#001AFF30" className="mapLoadingLabel" text="[Loading Map]"></Label>
                <Label show={!loadingLabelVisible} fontSize="1.8vh" color="#AAA" style={{ borderRadius: '5px', width: '90%', height: '5%', top: '93%', backdropFilter: 'blur(5px)' }} bkg={props.ghost ? "#0013BAAA" : "#2E0067AA"} className="mapLoadingLabel" text="The message you send will contain this view"></Label>
            </div>
        )
    } else {
        return ''
    }
}

export default LocationPickerOverlay;