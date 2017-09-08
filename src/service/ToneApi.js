/**
 * Created by Matteo on 21/07/2017.
 */
import ToneAnalyzerV3 from '../../node_modules/watson-developer-cloud/tone-analyzer/v3';
import _ from 'lodash';

export default class ToneApi {
    static getAnalisis (text) {
        // c4f70d78-6b0c-4624-bf7e-33f46d45e04e
        // EFzrl7Z5r8pv
        const ToneAnalyzer = new ToneAnalyzerV3({
            username: '913fe705-1704-4ab6-bee6-12bb9461ae21',
            password: 'EfQtuTcsYuwX',
            version_date: '2016-05-19'
        })

        return new Promise(function(resolve, reject) {
            ToneAnalyzer.tone({text: text},
                function (err, tone) {
                    if (err)
                    {
                        reject(Error(err));
                    }
                    else
                    {
                        resolve(tone);
                    }
                })
        })
    }
}


