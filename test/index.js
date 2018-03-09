import SpiderFlow from '../src';

let t = new SpiderFlow();


async function test() {
    await t.starUp({
        headless: false,
        args: ['--no-sandbox']
    });

    /* let result = await t.step({
         operation: 'openPage',
         url: 'http://www.baidu.com',
         closePage: false
     }, function (pageSymbol) {
         console.log("res1:", pageSymbol);
     });

     console.log("result:", result.step);
     let result2 = await result.step({
         operation: 'openPage',
         url: 'http://www.baidu.com',
         closePage: false
     }, function (pageSymbol) {
         console.log("res2:", pageSymbol);
     })*/

    // 打开页面
    let result1 = await t.step({
        operation: 'openPage',
        url: 'http://www.baidu.com',
        closePage: false
    }, async function (ctx) {
        console.log("res1:", ctx.data);
        let page = ctx.pages[ctx.data.pageSymbol]
        // 获取页面元素
        const body = await page.evaluate(() => {
            console.log("broser output");
            return $('body')[0].innerHTML;
        });
        //console.log('body:', body);
        // 保存cookie
        //const cookies = await page._client.send('Network.getAllCookies');
        //console.log('cookies:', cookies);
    });

    console.log("result1:", result1);

    // 输入文本框
    let result2 = await t.step({
        operation: 'input',
        pageSymbol: result1.pageSymbol,
        inputs: [{
            selector: '#kw',
            value: 'test'
        }],
        closePage: false
    }, async function (ctx) {


    });
    console.log("result2:", result2);

    // 点击按钮
    let result3 = await t.step({
        operation: 'click',
        pageSymbol: result1.pageSymbol,
        clicks: [{
            selector: '#su'
        }],
        closePage: false
    }, async function (ctx) {

    });
    console.log("result3:", result3);

    // 滑动
    // 点击按钮
    let result4 = await t.step({
        operation: 'slide',
        pageSymbol: result1.pageSymbol,
        selector: '',
        points: [
            {
                timespan: 0,
                toX: 116.93399810791016,
                toY: 345.2229919433594
            },
            {
                timespan: 91,
                toX: 139.94500732421875,
                toY: 345.2229919433594
            },
            {
                timespan: 99,
                toX: 151.02000427246094,
                toY: 345.2229919433594
            },
            {
                timespan: 101,
                toX: 154.6840057373047,
                toY: 345.2229919433594
            },
            {
                timespan: 99,
                toX: 165.66400146484375,
                toY: 345.2229919433594
            },
            {
                timespan: 101,
                toX: 197.07400512695312,
                toY: 346.5270080566406
            },
            {
                timespan: 99,
                toX: 211.6909942626953,
                toY: 347.24200439453125
            },
            {
                timespan: 101,
                toX: 223.57000732421875,
                toY: 348.218994140625
            },
            {
                timespan: 100,
                toX: 230.156005859375,
                toY: 348.7969970703125
            },
            {
                timespan: 99,
                toX: 235.6909942626953,
                toY: 349.3479919433594
            },
            {
                timespan: 100,
                toX: 239.718994140625,
                toY: 349.8710021972656
            },
            {
                timespan: 100,
                toX: 245,
                toY: 350
            },
            {
                timespan: 101,
                toX: 248.97300720214844,
                toY: 350.67999267578125
            },
            {
                timespan: 100,
                toX: 251.53500366210938,
                toY: 350.9410095214844
            },
            {
                timespan: 147,
                toX: 253.7729949951172,
                toY: 351.4100036621094
            }
        ],
        closePage: false
    }, async function (ctx) {


    });

    console.log("result4:", result4);
}

test();