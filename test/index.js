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


    let result = await t.step({
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

    console.log("result:", result);
}

test();