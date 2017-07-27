/**
 * Created by Matteo on 21/07/2017.
 */
import ToneAnalyzerV3 from '../../node_modules/watson-developer-cloud/tone-analyzer/v3'

export default class ToneApi {
    static getAnalisis () {
        const ToneAnalyzer = new ToneAnalyzerV3({
            username: 'c4f70d78-6b0c-4624-bf7e-33f46d45e04e',
            password: 'EFzrl7Z5r8pv',
            version_date: '2016-05-19'
        })
        ToneAnalyzer.tone({text: "You're just a fucking shit"},
            function (err, tone) {
                if (err) { console.log(err) } else { console.log("You're just a fucking shit"); console.log(JSON.stringify(tone, null, 2)) }
            })
    }
}