/**
 * Created by Matteo on 07/06/2017.
 */

import ToneApi from '../../service/ToneApi'
import _ from 'lodash';


const state = {
    leavePage: false,
    appReady: false,
    ticker: 0,
    loading: 0,
    emotionalResult : [],
    colors: {
        'first': {
            'anger': '#C72E33',
            'disgust': '#C8DF8F',
            'joy': '#E5CD1D',
            'sadness':'#8AC4E3',
            'fear': '#926CA1'
        },
        'second': {
            'anger': '#C72E33',
            'disgust': '#C8DF8F',
            'joy': '#E5CD1D',
            'sadness':'#8AC4E3',
            'fear': '#926CA1'
        }
    },
    currentColors: {
        first: '#00FF00',
        second: '#00FFFF'
    },
    heartBeat: 1100
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
    },
    setFirstColor: (state, payload) => {
      state.currentColors.first = payload;
    },
    setSecondColor: (state, payload) => {
        state.currentColors.second = payload;
    }
}

const actions = {
    setLeavePage: ({commit}, payload) => {
        commit('setLeavePage', payload)
    },
    setAppReady: ({commit},payload) => {
        commit('setAppReady',payload)
    },
    setEmotionResult: ({commit},payload) => {
        console.log(payload);
        ToneApi.getAnalisis(payload).then(function(response) {
            let tone_res = response.document_tone.tone_categories[0].tones;
            let result = _.values(_.sortBy(tone_res, 'score').reverse());
            commit('setEmotionResult', result)
        }, function(error){
            console.error("Failed!", error);
        })
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
    },
    getEmotionByPosition: (state, getter) => (id) => {
        if(state.emotionalResult.length > 0) {
            return state.emotionalResult[id].tone_id
        }
        else {
            return 'Non disponibile'
        }
    },
    getColors: (state, getter) => (id) => {
        return _.get(state.colors.first, id)
    },
    getCurrentColor: (state, getter) => (id) => {
        return state.currentColors[id]
    }
 }

export  default {
    state,
    mutations,
    actions,
    getters
}