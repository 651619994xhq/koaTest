function func1(){

}
function func2(){


}
function func3(){

}
//没有发生异常 正确返回结果，执行 不需要结果
// 发生了异常

//函数设计
//判断出异常 return false null
//throw new Error
//机制，监听任何异常，

//全局异常处理 异常 Promise Async 回调
//异步编程下的


class Test{
    constructor(){
        this.a=123;

    }

    efg(){
        console.log('efg')
    }

    abc(){
       console.log('abc');
    }
    static bcd(){
        console.log(this.abc());

    }


}

// console.log('1==>',Test.abc());
// console.log('2==>',Test.abc());
let test =new Test();
console.log('2==>',test.a);
// console.log('3==>',test.abc());
console.log('3==>',Test.bcd());



const obj={
    name:'xhq',
    age:18,
    toJSON: function () {
        return {
            name:'test2'
        }
    }
}

console.log(JSON.stringify(obj))


