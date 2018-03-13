import puppeteer from 'puppeteer';
import moment from 'moment';
import mkdirp from 'mkdirp';
import util from 'util';
import path from 'path';

const sleep = time => new Promise(resolve => setTimeout(resolve, time));
const mkdirPromise = util.promisify(mkdirp);

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

    // 错误处理
    async handleError(page, error) {
        if (page) {
            const dirPath = path.join(__dirname, '../', `/static/errimg/${moment().format('YYYYMMDD')}`);
            console.log
            await mkdirPromise(dirPath);
            await page.screenshot({path: `${dirPath}/${moment().format('hh-mm-ss') + error.message}.png`});
        }
    }

    // 页面中是否存在元素
    async existElement(page, selector) {
        let element = await page.$(selector);
        if (element && element.length >= 0) {
            element = element[0];
        }
        return element;
    }

    // 销毁浏览器
    async resetBrowser() {
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
    async openPage(page, config) {
        let {
            url = '', // 要打开的链接
            pageSymbol = Symbol('page'), // 要使用的页面
            getCookies = false  // 是否获取cookie
        } = config;

        await page.goto(url);

        // 获取cookie
        if (getCookies) {
            const getCookies = await page._client.send('Network.getAllCookies') || {};
            this.data.cookies = getCookies.cookies || [];
        }
        this.data.pageSymbol = pageSymbol;
    }

    // 输入
    async input(page, config) {
        let {
            sleepTime = 200, // 毫秒
            inputs = []      // 要输入的内容

        } = config;

        // 设置input的值
        for (let i = 0; i < inputs.length; i++) {
            const {
                selector,
                value
            } = inputs[i];
            // 查看元素是否存在
            const element = await this.existElement(page, selector);
            if (!element) {
                throw new Error('元素不存在');
            }
            // 输入值
            await page.type(selector, value, {delay: 100});
            await sleep(sleepTime);
        }
    }

    // 点击
    async click(page, config) {
        let {
            sleepTime = 200, // 毫秒
            clicks = []     // 要输入的内容
        } = config;

        // 设置input的值
        for (let i = 0; i < clicks.length; i++) {
            const {
                selector
            } = clicks[i];
            // 查看元素是否存在
            const element = await this.existElement(page, selector);
            if (!element) {
                throw new Error('元素不存在');
            }
            // 点击元素
            await page.click(selector);
            await sleep(sleepTime);
        }
    }

    // 拖动
    async slide(page, config) {
        let {
            //selector = '', // 要拖拽的元素
            points = []     // 拖拽轨迹
        } = config;

        /*// 查看元素是否存在
        const element = this.existElement(page, selector);
        if (!element) {
            throw new Error('元素不存在');
        }*/

        // 拖拽元素
        //const e = await page.$(selector);
        //const box = await e.boundingBox();
        await page.touchscreen.swipePoints(points[0].toX, points[0].toY, points);
    }

    // 确认操作结果
    async confirm(page, conditions) {
        // 获取selector的值
        for (let selector in conditions) {
            const expectValues = conditions[selector] || [];
            // 查看元素是否存在
            const element = await this.existElement(page, selector);
            if (!element) {
                throw new Error('元素不存在');
            }
            // 查看元素的值是否是期望值
            /*const value = await page.evaluate((selector) => {
                const node = document.querySelector(selector);
                console.log("node:", node);
                if(node) {
                    return node.innerHTML || (node[0] && node[0].innerHTML);
                }
                return '';
            }, selector);*/

            const value = await page.evaluate(element => element.innerHTML, element);

            //console.log("value:", value);

            if (expectValues.indexOf(value) === -1) {
                console.log("结果确认失败:", selector, expectValues, value);
                return false;
            }
        }

        return true;
    }

    // 执行
    async step(config, callback) {
        let {
            url,
            pageSymbol = Symbol('page'), // 要使用的页面
            sleepTime = 200, // 毫秒
            cookies = [],     // cookie
            operation, // 要进行的操作 ['openPage', 'input', 'click']
            confirms, // 结果确认
            closePage = true  // 操作完成后是否关闭页面
        } = config;

        if (!this[operation]) {
            throw new Error('操作函数不存在');
        }

        // 获取page
        let browser = this.browser;
        let page = null;

        try {
            // 打开页面
            if (url) {
                page = await browser.newPage();
                this.pages[pageSymbol] = page;
            } else if (this.pages[pageSymbol]) {
                page = this.pages[pageSymbol];
            } else {
                throw new Error('操作页面不存在');
            }
            await sleep(sleepTime);

            // 为page设置cookie
            if (cookies.length > 0) {
                await page.setCookie(...cookies);
            }
            // 为page添加函数
            page.touchscreen.swipePoints = async function (x, y, points) {
                await this._client.send('Input.dispatchTouchEvent', {
                    type: 'touchStart',
                    touchPoints: [{x: Math.round(x), y: Math.round(y)}],
                    modifiers: this._keyboard._modifiers
                });

                for (let i = 0; i < points.length; i++) {
                    await this._client.send('Input.dispatchTouchEvent', {
                        type: 'touchMove',
                        touchPoints: [{x: points[i].toX, y: points[i].toY}],
                        modifiers: this._keyboard._modifiers
                    });
                    await sleep(points[i].timespan);
                }
                await sleep(50);

                await this._client.send('Input.dispatchTouchEvent', {
                    type: 'touchEnd',
                    touchPoints: [],
                    modifiers: this._keyboard._modifiers
                });
            }.bind(page.touchscreen);

            // 执行要进行的操作
            await this[operation](page, config, callback);

            // 执行回调函数
            await sleep(sleepTime);
            callback && await callback(this);

            // 结果确认
            await sleep(sleepTime);
            if (confirms) {
                let confirmResult = await this.confirm(page, confirms);
                if (!confirmResult) {
                    throw new Error('结果和预期不符');
                }
            }
            // 关闭页面
            if (closePage) {
                await page.close();
                this.pages[pageSymbol] = null;
            }
            return this.data;
        } catch (e) {
            this.handleError(page, e);
            throw new Error(e.message);
        }
    }

    // 结束
    async stop() {
        if(this.browser){
            await this.browser.close();
        }
    }
}

module.exports = SpiderFlow;