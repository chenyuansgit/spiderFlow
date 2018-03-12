**安装环境**

PUPPETEER_DOWNLOAD_HOST=https://storage.googleapis.com.cnpmjs.org npm i puppeteer

**接口定义**
1. openPage 打开页面

返回：
```
{
    url: '', // 页面url
    pageSymbol: '', // 页面id
    cookies: [], //页面cookie
    confirms: {
       'selector1': ['value1', 'value2'] 
    }
}
 ```