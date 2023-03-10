import React from 'react'
import {Map, MapMarker} from 'react-kakao-maps-sdk'

const LocalMap = ({local}) => {
    const {x, y, place_name} = local;
    return (
        <Map center={{ lat: y, lng: x }} style={{ width: "100%", height: "360px" }}>
            <MapMarker position={{ lat: y, lng: x }}>
                <div>{place_name}</div>
            </MapMarker>
        </Map>
    )
}

export default LocalMap