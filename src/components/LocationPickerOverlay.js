import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { NavigationControl } from 'react-map-gl';
import LocationIndi from '../components/LocationIndi.js'
import Button from '../components/Button.js'
import Label from '../components/Label.js'
import { useEffect, useState } from 'react';

function LocationPickerOverlay(props) {
    const [mapVisible, setMapVisible] = useState(true)
    const [loadingLabelVisible, setLoadingLabelVisible] = useState(true)


    useEffect(() => {
        setMapVisible(false);
    }, [])

    useEffect(() => {
        if (mapVisible == false) {
            setTimeout(() => {
                setMapVisible(true)
            }, 80);
        }
    }, [mapVisible])


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
                        longitude: 16.62662018,
                        latitude: 49.2125578,
                        zoom: 14
                    }}
                    style={{ position: 'absolute', width: "100%", height: "100%", borderLeft: 'solid 1px #7000FF' }}
                    mapStyle="https://api.maptiler.com/maps/fcae873d-7ff0-480b-8d6d-41963084ad90/style.json?key=R1cyh6lj1mTfNEycg2N1"
                >
                    {/* <NavigationControl position="top-left" /> */}
                </Map>
                    : ''}
                {!loadingLabelVisible ? <LocationIndi></LocationIndi> : ''}
                {!loadingLabelVisible ? <Button bkg="#7100FF" fontSize="2vh" width="60%" height="6%" className="locationPickerUseDeviceLocationButton" color="#7100FF" label="Use Device Location"></Button> : ''}
                <Label show={loadingLabelVisible} fontSize="2vh" color="#001AFF" style={{ borderRadius: '5px', width: '50%', height: '5%' }} bkg="#001AFF30" className="mapLoadingLabel" text="[Loading Map]"></Label>
            </div>
        )
    } else {
        return ''
    }
}

export default LocationPickerOverlay;