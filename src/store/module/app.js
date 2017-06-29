/**
 * Created by Matteo on 07/06/2017.
 */

const state = {
    leavePage: false,
    pageReady: false,
}

const mutations = {
    setLeavePage: (state, payload) => {
        state.leavePage = payload
    },
    setPageReady: (state, payload) => {
        state.pageReady = payload
    }
}

const actions = {
    setLeavePage: ({commit}, payload) => {
        commit('setLeavePage', payload)
    },
    setPageReady: ({commit},payload) => {
        commit('setPageReady',payload)
    }
}

export  default {
    state,
    mutations,
    actions
}