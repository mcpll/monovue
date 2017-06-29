/**
 * Created by Matteo on 07/06/2017.
 */

import Vue from 'vue';
import Vuex from 'vuex';
import page  from './module/page'
import app from './module/app'


Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        page,
        app
    }
})