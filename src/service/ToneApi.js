/**
 * Created by Matteo on 21/07/2017.
 */

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3')
var AuthorizationV1 = require('watson-developer-cloud/authorization/v1')

import _ from 'lodash';
// '../../node_modules/watson-developer-cloud/tone-analyzer/v3';

export default class ToneApi {

    constructor() {
        /*this.Authorization = new AuthorizationV1({
            username: '913fe705-1704-4ab6-bee6-12bb9461ae21',
            password: 'EfQtuTcsYuwX',
            url: ToneAnalyzerV3.URL,
            headers: {
                "Access-Control-Allow-Origin" : "*",
            }
        });*/



    };

    // getToken() {
    //     this.Authorization.getToken(function (err, token) {
    //         if (!token) {
    //             console.log('error:', err);
    //         } else {
    //             console.log(token)
    //         }
    //     })
    // };

    getAnalisis (textinput) {
        // c4f70d78-6b0c-4624-bf7e-33f46d45e04e
        // EFzrl7Z5r8pv

        fetch('https://www.monofonts.com/test/get-token.php').then(function(response) {
            return response.text();
            }
        ).then(function(token) {
            let ToneAnalyzer = new ToneAnalyzerV3({
                token: token,
                version_date: '2016-05-19',
            });
            ToneAnalyzer.tone({text:textinput}, function(err, result)  {
                if(err) {
                    console.log(err)
                }
                else {
                   console.log(result)
                }
            });
        });

        // this.toneAnalyzer.tone({text: textinput},
        //     function (err, tone) {
        //         if (err)
        //         {
        //             console.log(err);
        //         }
        //         else
        //         {
        //             console.log(tone);
        //         }
        //     })

    }
}


