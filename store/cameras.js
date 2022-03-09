const frequencies = [
    { id: "gasco-ebpcv", frequency: 12 },
    { id: "centralbankbuild", frequency: 60 },
    { id: "gpocam", frequency: 12 },
    { id: "cumbe-vajln", frequency: 12 },
    { id: "reneg-utfwy", frequency: 1 },
    { id: "testv-cxnfz", frequency: 12 },
    { id: "hikvis-ext-r8-vh", frequency: 12 },
    { id: "dorset-street-ii", frequency: 30 },
    { id: "carlo-vdbyz", frequency: 1 },
    { id: "siptu-ghfeq", frequency: null },
    { id: "dorset-street-i", frequency: 30 },
    { id: "staff-ayrck", frequency: 12 },
    { id: "wilto-paqux", frequency: 12 },
    { id: "pinkh-hxsaq", frequency: 1 },
    { id: "dublinci-ptz", frequency: 12 },
    { id: "staff-nuxcy", frequency: 12 },
    { id: "gardiner2", frequency: 30 },
    { id: "carlowweather", frequency: 6 },
    { id: "1-granby-row", frequency: 30 },
    { id: "evercam-remembrance-camera", frequency: 30 },
]

export const state = () => ({
    onlineCams: [],
    offlineCams: [],
})

export const mutations = {
    SET_ONLINE_CAMS(state, onlineCams) {
        state.onlineCams = onlineCams
    },
    SET_OFFLINE_CAMS(state, offlineCams) {
        state.offlineCams = offlineCams
    }
}

export const getters = {
    GET_ONLINE_CAMS(state){
        return state.onlineCams
    },
    GET_OFFLINE_CAMS(state){
        return state.offlineCams
    }
}

export const actions = {
    async FETCH_CAMERAS({ commit }) {
        const result = await fetch("https://media.evercam.io/v2/public/cameras").then(res => res.json())
        let onlineCams = []
        let offlineCams = []
        for (let i = 0; i < result.cameras.length; i++) {
            //adding frequencies to the cameras
            for (let j = 0; j < frequencies.length; j++) {
                if (frequencies[j].id == result.cameras[i].id) {
                    result.cameras[i].frequency = frequencies[j].frequency
                    break
                }
            }
            // dividing the cameras by status
            if (result.cameras[i].status == "online")
                onlineCams.push(result.cameras[i])
            else
                offlineCams.push(result.cameras[i])
        }
        commit("SET_ONLINE_CAMS", onlineCams)
        commit("SET_OFFLINE_CAMS", offlineCams)
    }
}