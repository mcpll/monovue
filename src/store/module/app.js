/**
 * Created by Matteo on 07/06/2017.
 */

import _ from 'lodash';
import GlobalState from '../State'

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3')

const state = {
    leavePage: false,
    appReady: false,
    prevState: '',
    globalState: GlobalState.START,
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
        first: '#5b5b5b',
        second: '#303030'
    },
    heartBeat: 1100,
    token: ''
}

const mutations = {
    setLeavePage: (state, payload) => {
        state.leavePage = payload
    },
    setAppReady: (state, payload) => {
        state.appReady = payload
    },
    setAppGlobalState:(state, payload) => {
        state.globalState = payload
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
    },
    setToken: (state, payload) => {
        state.token = payload;
    }

}

const actions = {
    setToken: ({commit}) => {
        fetch('https://www.monofonts.com/test/get-token.php').then(function(response) {
                return response.text();
            }
        ).then(function(payload){
            commit('setToken', payload)
        })
    },
    setLeavePage: ({commit}, payload) => {
        commit('setLeavePage', payload)
    },
    setAppReady: ({commit},payload) => {
        commit('setAppReady',payload)
    },
    setEmotionResult: ({commit},payload) => {
        let ToneAnalyzer = new ToneAnalyzerV3({
            token: state.token,
            version_date: '2016-05-19',
        });
        ToneAnalyzer.tone({text:payload}, function(err, result)  {
            if(err) {
                console.log(err)
            }
            else {
                console.log();
                let tone_res = result.document_tone.tone_categories[0].tones;
                let tone_result = _.values(_.sortBy(tone_res, 'score').reverse());
                commit('setEmotionResult', tone_result)
            }
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
    },
    getFirstColorScore: state => {
        if(state.emotionalResult.length > 0) {
            return state.emotionalResult[0].score
        }
        else {
            return 0.5
        }
    }
 }

export  default {
    state,
    mutations,
    actions,
    getters
}