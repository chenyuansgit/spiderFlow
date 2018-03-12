**安装环境**

PUPPETEER_DOWNLOAD_HOST=https://storage.googleapis.com.cnpmjs.org npm i puppeteer

**接口定义**
1. openPage 打开页面

返回：
```
{
    url: '', // 页面url
    pageSymbol: '', // 页面id
    cookies: [], //页面cookie, 非必须
    operation, // 要进行的操作 ['openPage', 'input', 'click', 'slide']
    inputs: [{   // 要输入的内容
        selector : '',
        value: ''
    }],
    clicks: [{  //  要点击的内容
       selector: ''
    }], 
    confirms: {
       'selector1': ['value1', 'value2'] 
    }
}
 ```