/**
 * Created by Matteo on 21/07/2017.
 */
import ToneAnalyzerV3 from '../../node_modules/watson-developer-cloud/tone-analyzer/v3';
import _ from 'lodash';

export default class ToneApi {
    static getAnalisis (text) {
        const ToneAnalyzer = new ToneAnalyzerV3({
            username: 'c4f70d78-6b0c-4624-bf7e-33f46d45e04e',
            password: 'EFzrl7Z5r8pv',
            version_date: '2016-05-19'
        })
        ToneAnalyzer.tone({text: text},
            function (err, tone) {
                if (err)
                { console.log(err) }
                else
                    {
                        let tone_res = tone.document_tone.tone_categories[0].tones;
                        let result = _.sortBy(tone_res, 'score').reverse();
                        console.log(result);
                        return result
                    }
            })
    }
}