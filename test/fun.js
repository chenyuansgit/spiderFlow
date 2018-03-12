
class Server {
    constructor() {
        this.debug = true;

        this.confirm  = async function(obj) {
            console.log("confirm:", obj);
        }
    }

    fun(arg) {
        return new Promise((resolve) => resolve(arg));
    }

   /* async confirm(obj){
        console.log("confirm:", obj);
    }*/
    async step(arg) {
        let res = await this.fun(arg);
        console.log('res:', res);
        console.log("this:", this);
        return this;
    }
}





let s = new Server();

async function test() {
    let result =  s.step(1).confirm({1:3});
    console.log("result:", result);
}

test();

/*Server.step(1).step(2);

Server.step(1);*/

/*

let server = new Server();
let result = await server.step(cfg1).step(cfg2);

* */