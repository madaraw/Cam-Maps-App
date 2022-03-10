let tempMarkersOnline = []
let tempMarkersOffline = []

export const state = () => ({
    markersOnlineVisibility: true,
    markersOfflineVisibility: true,
    markersOnline: [],
    markersOffline: [],
    markerCluster: null,
    markerClusterActive: true,
    map: null,
})

export const mutations = {
    SET_MARKERS_ONLINE(state, markersOnline) {
        state.markersOnline = markersOnline
        // markersOnline.forEach(marker => {
        //     const tempMarker = new google.maps.Marker({
        //         position: marker.getPosition(),
        //         map: marker.getMap(),
        //         title: marker.getTitle(),
        //         icon: marker.getIcon(),
        //     })
        //     tempMarkersOnline.push(tempMarker)
        // })
    },
    SET_MARKERS_OFFLINE(state, markersOffline) {
        state.markersOffline = markersOffline
        // markersOffline.forEach(marker => {
        //     const tempMarker = new google.maps.Marker({
        //         position: marker.getPosition(),
        //         map: marker.getMap(),
        //         title: marker.getTitle(),
        //         icon: marker.getIcon(),
        //     })
        //     tempMarkersOffline.push(tempMarker)
        // })
    },
    SET_MARKER_CLUSTER(state, markerCluster) {
        state.markerCluster = markerCluster
    },
    SET_MAP(state, map) {
        state.map = map
    },
    TOGGLE_MARKERS_ONLINE_VISIBILITY(state) {
        state.markersOnlineVisibility = !state.markersOnlineVisibility
        state.markersOnline.forEach(marker => {
            marker.setVisible(state.markersOnlineVisibility)
        })
        if (state.markerClusterActive) {
            if (state.markersOnlineVisibility)
                state.markerCluster.addMarkers(state.markersOnline)
            else
                state.markerCluster.removeMarkers(state.markersOnline)
        }
    },
    TOGGLE_MARKERS_OFFLINE_VISIBILITY(state) {
        state.markersOfflineVisibility = !state.markersOfflineVisibility
        state.markersOffline.forEach(marker => {
            marker.setVisible(state.markersOfflineVisibility)
        })
        if (state.markerClusterActive) {
            if (state.markersOfflineVisibility)
                state.markerCluster.addMarkers(state.markersOffline)
            else
                state.markerCluster.removeMarkers(state.markersOffline)
        }
    },
    TOGGLE_MARKER_CLUSTER_ACTIVE(state) {
        state.markerClusterActive = !state.markerClusterActive
        if (state.markerClusterActive) {
            if (state.markersOnlineVisibility)
                state.markerCluster.addMarkers(state.markersOnline)
            if (state.markersOfflineVisibility)
                state.markerCluster.addMarkers(state.markersOffline)
        }
        else {
            state.markerCluster.clearMarkers()
            state.markersOnline.forEach(marker => {
                marker.setOptions({ map: state.map, visible: state.markersOnlineVisibility })
            })
            state.markersOffline.forEach(marker => {
                marker.setOptions({ map: state.map, visible: state.markersOfflineVisibility })
            })
        }
    }
}

export const getters = {
    GET_MARKERS_ONLINE(state) {
        return state.markersOnline
    },
    GET_MARKERS_OFFLINE(state) {
        return state.markersOffline
    },
    GET_MARKER_CLUSTER(state) {
        return state.markerCluster
    },
    GET_MAP(state) {
        return state.map
    },
    GET_MARKERS_ONLINE_VISIBILITY(state) {
        return state.markersOnlineVisibility
    },
    GET_MARKERS_OFFLINE_VISIBILITY(state) {
        return state.markersOfflineVisibility
    },
    GET_MARKER_CLUSTER_ACTIVE(state) {
        return state.markerClusterActive
    }
}