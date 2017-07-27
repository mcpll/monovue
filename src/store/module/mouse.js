/**
 * Created by Matteo on 07/06/2017.
 */

const state = {
    mouseX: 0,
    mouseY: 0
}

const mutations = {
    setMouseX: (state, payload) => {
        state.mouseX = payload
    },
    setMouseY: (state, payload) => {
        state.mouseY = payload
    }
}

const actions = {
    setMouseX: ({commit}, payload) => {
        commit('setMouseX', payload)
    },
    setMouseY: ({commit}, payload) => {
        commit('setMouseY', payload)
    }
}

const getters = {
    getX: state => {
        return state.mouseX
    },
    getY: state => {
        return state.mouseY
    }
}



export default {
    state,
    mutations,
    actions,
    getters
}