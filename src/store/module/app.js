/**
 * Created by Matteo on 07/06/2017.
 */



const state = {
    leavePage: false,
    appReady: false,
    ticker: 0,
    loading: 0,
    emotionalResult : {}
}

const mutations = {
    setLeavePage: (state, payload) => {
        state.leavePage = payload
    },
    setAppReady: (state, payload) => {
        state.appReady = payload
    },
    ticker: (state) => {
        state.ticker += 1
    },
    setLoading: (state, payload) => {
        state.loading = payload
    },
    setEmotionResult: (state, payload) => {
        state.emotionalResult = payload;
    }
}

const actions = {
    setLeavePage: ({commit}, payload) => {
        commit('setLeavePage', payload)
    },
    setAppReady: ({commit},payload) => {
        commit('setAppReady',payload)
    },
    setEmotionResult: ({commit, payload}) => {
        //TODO Aggiungere codice per recupare la risposta json
        commit('setEmotionResult', payload)
    }
}

const getters = {
    getTicker: state => {
        return state.ticker
    },
    getAppReady: state => {
        return state.appReady
    },
    getLoading: state => {
        return state.loading
    }
}

export  default {
    state,
    mutations,
    actions,
    getters
}