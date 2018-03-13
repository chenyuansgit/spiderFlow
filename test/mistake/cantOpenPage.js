import SpiderFlow from '../../src';

let t = new SpiderFlow();


let cfg = [{
    url: 'http://chenyuan.com.cn',
    operation: 'openPage',
    closePage: false,
    confirms: {
       // '[type="submit"]': ['登录']
    }
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

    await t.stop();

}

test();