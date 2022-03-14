const centerPosition = { lat: 53.3498, lng: -6.2603 }

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
    },
    SET_MARKERS_OFFLINE(state, markersOffline) {
        state.markersOffline = markersOffline
    },
    SET_MARKER_CLUSTER(state, markerCluster) {
        state.markerCluster = markerCluster
    },
    SET_MAP(state, map) {
        state.map = map
    },
    TOGGLE_MARKERS_ONLINE_VISIBILITY(state) {
        // Switch the visibility 
        state.markersOnlineVisibility = !state.markersOnlineVisibility

        // Gives the markers the visibility of the variable when it's switched
        state.markersOnline.forEach(marker => {
            marker.setVisible(state.markersOnlineVisibility)
        })

        // Checks if the clustering is active
        if (state.markerClusterActive) {

            // Clusters the online markers if it's true
            if (state.markersOnlineVisibility)
                state.markerCluster.addMarkers(state.markersOnline)

            // Declusters the online markers if it's false
            else
                state.markerCluster.removeMarkers(state.markersOnline)
        }
    },
    TOGGLE_MARKERS_OFFLINE_VISIBILITY(state) {
        // Switch the visibility 
        state.markersOfflineVisibility = !state.markersOfflineVisibility

        // Gives the markers the visibility of the variable when it's switched
        state.markersOffline.forEach(marker => {
            marker.setVisible(state.markersOfflineVisibility)
        })

        // Checks if the clustering is active
        if (state.markerClusterActive) {

            // Clusters the offline markers if it's true
            if (state.markersOfflineVisibility)
                state.markerCluster.addMarkers(state.markersOffline)

            // Declusters the offline markers if it's false
            else
                state.markerCluster.removeMarkers(state.markersOffline)
        }
    },
    TOGGLE_MARKER_CLUSTER_ACTIVE(state) {
        // Switch the variable 
        state.markerClusterActive = !state.markerClusterActive

        // Check if the clustering is active
        if (state.markerClusterActive) {

            // Check if the online cameras are active
            if (state.markersOnlineVisibility)
                // Adding the online cameras to the map clusterer
                state.markerCluster.addMarkers(state.markersOnline)

            // Check if the offline cameras are active
            if (state.markersOfflineVisibility)
                // Adding the offline cameras to the map clusterer
                state.markerCluster.addMarkers(state.markersOffline)
        }

        // Check if the clustering is inactive
        else {
            // Clearing markers from the marker clusterer
            state.markerCluster.clearMarkers()
            // Resetting the cameras visibility and map for rerendering
            state.markersOnline.forEach(marker => {
                marker.setOptions({ map: state.map, visible: state.markersOnlineVisibility })
            })
            state.markersOffline.forEach(marker => {
                marker.setOptions({ map: state.map, visible: state.markersOfflineVisibility })
            })
        }
    },
    HANDLE_RECENTER(state) {
        // Setting the center to Dublin
        state.map.setCenter(centerPosition)
        // Setting the zoom on the map
        state.map.setZoom(6)
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