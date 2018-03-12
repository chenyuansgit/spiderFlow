import SpiderFlow from '../src';

let t = new SpiderFlow();


let cfg = [{
    url: 'https://i.meituan.com/account/login',
    operation: 'openPage',
    closePage: false
}, {
    operation: 'click',
    clicks: [{  //  要点击的内容
        selector: '[gaevent="imt/login/quickBuy/"]'
    }],
    closePage: false
}, {
    operation: 'input',
    inputs: [{
        selector: '#login-mobile',
        value: '188******'
    }],
    closePage: false
}, {
    operation: 'click',
    clicks: [{  //  要点击的内容
        selector: '#smsCode'
    }],
    closePage: false
}];

async function test() {
    await t.starUp({
        headless: false,
        args: ['--no-sandbox']
    });

    let pageSymbol = null;

    for (let i = 0; i < cfg.length; i++) {
        cfg[i].pageSymbol = pageSymbol;
        let data = await t.step(cfg[i]);
        if (data.pageSymbol) {
            pageSymbol = data.pageSymbol;
        }

        console.log(cfg[i].operation, data);
    }

}

test();