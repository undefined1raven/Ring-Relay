import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { NavigationControl } from 'react-map-gl';
import LocationIndi from '../components/LocationIndi.js'

function LocationPickerOverlay(props) {
    if (props.show) {
        const update = (e) => props.updateLocationInput(e);
        return (
            <div className="locPickerOverlayContainer">
                <Map
                    onZoom={(e) => update(e)}
                    onMove={(e) => update(e)}
                    onLoad={(e) => update(e)}
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
                <LocationIndi></LocationIndi>
            </div>
        )
    } else {
        return ''
    }
}

export default LocationPickerOverlay;