import SpiderFlow from '../src';



async function test() {
    let t = new SpiderFlow();


    let cfg = [{
        url: 'http://www.dianping.com/',
        operation: 'openPage',
        closePage: true,
        getCookies: true,
        cookies: []
    }];

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

    let result1 = await t.run(cfg);
    console.log("result1:", result1)
    await t.stop();

}

setInterval(async function(){
    await test();
}, 3000);


// 加入以下代码，ctrl+c 程序才能正常结束。
process.on('SIGINT', () => {
    console.log('server shutdown');
    process.exit();
});