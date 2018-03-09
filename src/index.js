import puppeteer from 'puppeteer';

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

class SpiderFlow {
    constructor(debug) {
        this.isDebug = debug === '' ? 1 : 0;

        // 要传递的数据
        this.data = {};
        // 浏览器对象
        this.browser = null;
        // 页面
        this.pages = {};
    }

    // 页面中是否存在元素
    async existElement(page, selector) {
        const element = await page.$(selector);
        return element;
    }
    // 销毁浏览器
    resetBrowser() {
        console.log('browser disconnected');
        this.browser = null;
        this.pages = {};
    };

    // 启动
    async starUp(cfg) {
        this.browser = await puppeteer.launch(cfg);

        this.browser.on('disconnected', this.resetBrowser);
        console.log('browser launched');
        return this.browser;

    }

    // 打开页面
    async openPage(config, callback) {
        let {
            url = '', // 要打开的链接
            pageSymbol = Symbol('page'), // 要使用的页面
            sleepTime = 200, // 毫秒
            cookies = [],     // cookie
            closePage = false  // 操作完成后是否关闭页面
        } = config;

        let browser = this.browser;
        let page = null;
        // 打开页面
        if (url) {
            page = await browser.newPage();
            await page.goto(url);
            this.pages[pageSymbol] = page;
        } else if (this.pages[pageSymbol]) {
            page = this.pages[pageSymbol];
        } else {
            throw new Error('页面不存在');
        }
        await sleep(sleepTime);

        // 设置cookie
        if (cookies.length > 0) {
            await page.setCookie(...cookies);
        }

        // 获取cookie
        const getCookies = await page._client.send('Network.getAllCookies') || {};
        this.data.cookies = getCookies.cookies || [];
        this.data.pageSymbol = pageSymbol;

        // 执行回调函数
        await callback(this);

        // 关闭页面
        if (closePage) {
            await page.close();
            this.pages[pageSymbol] = null;
        }
    }

    // 输入
    async input(config, callback) {
        let {
            pageSymbol = Symbol('page'), // 要使用的页面
            sleepTime = 200, // 毫秒
            cookies = [],     // cookie
            inputs = [],      // 要输入的内容
            closePage = false  // 操作完成后是否关闭页面
        } = config;

        // 获取页面
        let page = this.pages[pageSymbol];
        if (!page) {
            throw new Error('页面不存在');
        }
        await sleep(sleepTime);

        // 设置input的值
        for (let i = 0; i< inputs.length; i++) {
            const {
                selector,
                value
            } = inputs[i];
            // 查看元素是否存在
            const element = this.existElement(page, selector);
            if(!element) {
                throw new Error('元素不存在');
            }
            // 输入值
            await page.type(selector, value, { delay: 100 });
        }

        // 执行回调函数
        await callback(this);

        // 关闭页面
        if (closePage) {
            await page.close();
            this.pages[pageSymbol] = null;
        }
    }

    // 执行
    async step(config, callback) {
        let {
            operation // 要进行的操作 ['openPage', 'input', 'click']
        } = config;

        if (!operation) {
            throw new Error('操作不存在');
        }
        await this[operation](config, callback);
        //return new Promise(resolve => resolve(this));
        return this.data;
    }

    // 结束
    stop() {
        this.resetBrowser();

    }
}

module.exports = SpiderFlow;