/**
 * Created by Matteo on 07/06/2017.
 */

const state = {
    leavePage: false,
    pageReady: false,
    ticker: 0
}

const mutations = {
    setLeavePage: (state, payload) => {
        state.leavePage = payload
    },
    setPageReady: (state, payload) => {
        state.pageReady = payload
    },
    ticker: (state) => {
        state.ticker += 1
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

const getters = {
    getTicker: state => {
        return state.ticker
    }
}

export  default {
    state,
    mutations,
    actions,
    getters
}