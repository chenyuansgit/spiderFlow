import SpiderFlow from '../src';

let t = new SpiderFlow();


let cfg = [{
    url: 'https://i.meituan.com/account/login',
    operation: 'openPage',
    closePage: false,
    getCookies: false
}, {
    operation: 'click',
    clicks: [{  //  要点击的内容
        selector: '[gaevent="imt/login/quickBuy/"]'
    }],
    confirms: {
        '[type="submit"]': ['登录']
    },
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


    /* for (let i = 0; i < cfg.length; i++) {
         /!*cfg[i].pageSymbol = pageSymbol;
         let data = await t.step(cfg[i]);
         if (data.pageSymbol) {
             pageSymbol = data.pageSymbol;
         }
 *!/
         console.log(cfg[i].operation);
         pre = pre.use(cfg[i]);
     }*/

    let result = await t.run(cfg);
    console.log("result:", result)

}

test();