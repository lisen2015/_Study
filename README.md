# Javascript / Study
> for 循环嵌套 timeout、 异步加载+作用域链

`首先这样的结果需要从JS的执行机制说起。JS是单线程环境，也就是说代码的执行是从上到下，依次执行。这样的执行称为同步执行。因为种种不要浪费和节约的原因。JS中引进了异步的机制。在这段代码中，哪个是同步哪个是异步呢？for循环是同步代码，而setTimeout中的是异步代码。那么JS碰到这个有同步和异步的情况下会先从上到下执行同步代码，碰到异步的代码会将其插入到任务队列当中等待。而setTimeout是延时，也就是说碰到setTimeout这个异步的代码块会根据它里面的第二个参数：延时时间来将代码插入到任务队列当中，比如上面这段代码中，第二个参数延时时间是0，也就是说执行到它的时候会在0ms之后将它插入到任务队列当中。同步代码都执行完成之后，那么JS引擎就空闲了，这个时候就轮到任务队列中的异步代码依次加载了。
`
``` javascript
for (var i = 1; i < 5; i++) {
    window.setTimeout(function () {
        console.log(i); // 求 输出结果?
    },0)
    console.log('#');
}
// 输出
// #, #, #, #, 5, 5, 5, 5
```

``` javascript
for (let i = 1; i < 5; i++) {
  window.setTimeout(function () {
    console.log(i); // 求 输出结果?
  },0)
  console.log('#');
}
// 输出
// #, #, #, #, 1, 2, 3, 4
```

``` javascript
for (var i = 1; i < 5; i++) {
  (function (i) {
    window.setTimeout(function () {
      console.log(i); // 求 输出结果?
    },0)
  })(i)
  console.log('#');
}
// 输出
// #, #, #, #, 1, 2, 3, 4
```

``` javascript
for (var i = 1; i < 5; i++) {
  window.setTimeout((function (i) {
    console.log(i); // 求 输出结果?
  })(i),0)
  console.log('#');
}
// 输出
// 1, #, 1, #, 2, #, 3, #
```

---

> 理解js中的指向

`this的指向在函数定义的时候是确定不了的，只有函数执行的时候才能确定this到底指向谁，实际上this的最终指向的是那个调用它的对象.
`


#### 示例 1
``` javascript
function a(){
    var user = "我是谁";
    console.log(this.user); //undefined
    console.log(this); //Window
}
a();
```

#### 示例 2
``` javascript
var o = {
    user:"我是谁",
    fn:function(){
        console.log(this.user);  //我是谁
    }
}
o.fn();
```

#### 示例 3
``` javascript
var o = {
    a:10,
    b:{
        a:12,
        fn:function(){
            console.log(this.a); //12
        }
    }
}
o.b.fn();
```

#### 示例 4
``` javascript
var o = {
    a:10,
    b:{
        // a:12,
        fn:function(){
            console.log(this.a); //undefined
        }
    }
}
o.b.fn();
```

#### 示例 5
``` javascript
var o = {
    a:10,
    b:{
        a:12,
        fn:function(){
            console.log(this.a); //undefined
            console.log(this); //window
        }
    }
}
var j = o.b.fn;
j();
```

> 使用call、apply和bind改变函数执行时的上下文（this）

#### 示例
``` javascript
var a = {
    user:"我是谁",
    fn:function(){
        console.log(this.user); //
    }
}
var b = a.fn;
b(); //undefined
```

### `>>> call()`

#### 示例 1
``` javascript
var a = {
    user:"我是谁",
    fn:function(){
        console.log(this.user); //我是谁
    }
}
var b = a.fn;
b.call(a);
```

#### 示例 2
``` javascript
var a = {
    user:"我是谁",
    fn:function(e,ee){ // 1, 2
        console.log(this.user); //我是谁
        console.log(e+ee); //3
    }
}
var b = a.fn;
b.call(a,1,2);
```

### `>>> apply()`

#### 示例 1
``` javascript
var a = {
    user:"我是谁",
    fn:function(){
        console.log(this.user); //我是谁
    }
}
var b = a.fn;
b.apply(a);
```

#### 示例 2
##### `不同的 call() 是，第二个参数必须是一个数组`，如下：
``` javascript
var a = {
    user:"我是谁",
    fn:function(e,ee){ // 10, 1
        console.log(this.user); //我是谁
        console.log(e+ee); //11
    }
}
var b = a.fn;
b.apply(a,[10,1]);
```

#### 示例 3
``` javascript
var a = {
    user:"我是谁",
    fn:function(e,ee){ // 500, 20
        console.log(this.user); //我是谁
        console.log(e+ee); //520
    }
}
var b = a.fn;
var arr = [500,20];
b.apply(a,arr);
```

#### `注意如果call和apply的第一个参数写的是null，那么this指向的是window对象`

``` javascript
var a = {
    user:"我是谁",
    fn:function(e,ee){ // 10, 1
        console.log(this); //Window {external: Object, chrome: Object…}
        console.log(e+ee); // 11
    }
}
var b = a.fn;
b.apply(null, [10, 1]); // b.call(null);
```

### `>>> bind()`
##### `bind方法和call、apply方法有些不同，它们都可以用来改变this的指向`
    bind() 返回的是一个修改过后的函数

#### 示例 1
``` javascript
var a = {
    user:"我是谁",
    fn:function(){
        console.log(this.user);
    }
}
var b = a.fn;
b.bind(a); // !@#¥%……&* ??? 😂
// b >>  function(){ console.log(this.user); }
```

#### 示例 2
``` javascript
var a = {
    user:"我是谁",
    fn:function(){
        console.log(this.user); //我是谁
    }
}
var b = a.fn;
var c = b.bind(a);
c(); // 执行 a.fn()
```

#### 示例 3
##### `同样bind也可以有多个参数，并且参数可以执行的时候再次添加，但是要注意的是，参数是按照形参的顺序进行的`
``` javascript
var a = {
    user:"我是谁",
    fn:function(e,d,f){
        console.log(this.user); //我是谁
        console.log(e,d,f); //10 1 2
    }
}
var b = a.fn;
var c = b.bind(a,10);
c(1,2);
```

### 总结：call和apply都是改变上下文中的this并立即执行这个函数，bind方法可以让对应的函数想什么时候调就什么时候调用，并且可以将参数在执行的时候添加，这是它们的区别，根据自己的实际情况来选择使用。

---

> js中的回收机制
#### 示例
``` javascript
function a(){
　　var num = 10;
　　return function(){
　　　　num ++;
　　　　console.log(num);
　　}
}
a()(); //11
a()(); //11
```
#### `按理说第二次执行函数a的时候应该打印出12才对，但是打印的却是11，这难道不能说明js在这其中做了什么手脚吗？按照正常逻辑我们一起来分析分析`
    1. 在js中定义的全局变量是不会被销毁的，因为我们随时都可能会用到这个变量，所以不能被销毁。
    2. 但是在函数中定于的变量就不一定了，而且由于在函数的定义的变量的生命周期在执行完这个函数就销毁的原因自然就保存不了上一次的值。
        2.1 但是并不是说函数就真的保存不了上一次的值，因为有的时候我们确实需要上一次的值，所以js判断是否需要保存上一次变量的值的时候就会遵守这样的一个规则。

    规则 -> 
    如果这个函数有被外部的变量引用就不会销毁（这句话说的不够准确，下面代码会一步一步解释），否则销毁。怎么理解这句话呢？
#### 示例
``` javascript
function a(){
    var b = 0;
    return function(){
        b ++;
        console.log(b);
    }
}
var d = a();
d();//1
d();//2
```

#### `函数a被变量变量d引用，更准确的说是函数a里面的那个匿名被变量d所引用，因为变量d等于的是函数a执行完成后的值，而函数a执行完以后又因为函数a返回了那个匿名函数，所以准确的说是变量d等于匿名函数。而这个匿名函数因为使用了函数a中的变量b并且还被变量d所引用，所以就形成了一个闭包，只要这个变量d不等于null的话，那么那个变量b会一直保存到变量d中不会被销毁。`

### 总结：
    1、如果一个对象不被引用，那么这个对象就会被GC回收；
    2、如果两个对象互相引用，但是没有被第3个对象所引用，那么这两个互相引用的对象也会被回收。