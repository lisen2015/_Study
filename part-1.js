// !@#¥%……&*
var names = '宋老师'
var obj = {
    names: '张老师',
    showName: function () {
        // 这里的this.names 指的是 obj 对象里面的 names 属性值
        console.log(this.names)
    },
    returnName: function () {
        // 这里是调用这个方法的时候 返回对象里的 names 属性
        return this.names
    },
    returnFunctionName: function () {
        // this.XXXXX   写在这里的this 指的才是 obj 对象
        // 这里是调用此方法的时候 返回一个方法
        return function () {
            // 这里需注意 下面的 this 并非 obj 这个对象、而是 window 对象
            // 调用此方法后会发现 这里的 this.names 输出的是 宋老师 并非 张老师
            // 因为最上面的 宋老师 定义的是全局的属性、也就是说这个属性是定义在 window 对象里的、所以输出的值并非 张老师 而是 宋老师
            console.log(this.names)
        }
    }
}
// 这里是调用上面的showName方法、方法内本身就有输出obj里面的names
obj.showName() 

// 这里调用了这个方法、但是上面的这个方法是有返回的、如果此处直接调用 并没有做参数返回接收的话、是不会有输出的
obj.returnName() 

// 这里注意 方法最后有两个括弧、是因为方法本身就是一个方法、所以调用后面需要有一个括弧、但是方法又返回了一个方法、再加括弧执行次方法、这里调用对象为window、因此方法内的this指向的是window
obj.returnFunctionName()() 

/**
 * call方法: 
 * 语法：call([thisObj[,arg1[, arg2[,   [,.argN]]]]]) 
 * 定义：调用一个对象的一个方法，以另一个对象替换当前对象。 
 * 说明： 
 * call 方法可以用来代替另一个对象调用一个方法。call 方法可将一个函数的对象上下文从初始的上下文改变为由 thisObj 指定的新对象。 
 * 如果没有提供 thisObj 参数，那么 Global 对象被用作 thisObj。 
 * 
 * 这里不理解的话 自己百度查询了解
 */
// 此处输出为 undefined 是因为 传入的并非一个对象、 因为上面定义的 names 并非一个对象、他传入进对应方法后、方法里面会去获取当前对象里的 names 属性、由于传入的并非一个对象、因此不存在 names 属性、所以输出undefined
obj.showName.call(names) 
// 此处同理 如上所述
obj.returnName.call(names)
// 此处同理 如上所述
obj.returnFunctionName().call(names)

// 此处先将 returnFunctionName 方法绑定给 window 对象、接收方法返回的方法参数暂不执行
var newObj = obj.returnFunctionName().bind(window)
// 接收方法返回的方法、然后将 obj 对象传入、 此处就会发现执行会有输出、因为传入的obj对象里面包含了 returnFunctionName 方法所需的 names 属性
newObj.call(obj)


// 前面三个好理解、 最后的几个牵扯到 call 方法、这个你自己百度查询理解下、文字一两句说不清楚




// call 方法解释
var obj = {
    name: '章三',
    getName: function () {
        console.log(this.name); //  这里需要获取 this 对象 里面的 name 属性
    }
};
obj.getName(); // 调用 obj 的 getName 方法、输出为 ‘章三’

// 定义对象 没有 name 属性的 对象
var obj1 = {
    name1: '里斯' // 注意 这个对象里面的是 name1  并非 name
}
obj.getName.call(obj1); // 调用 obj 的 getName 方法 传入一个没有 name 属性的对象、输出为 undefined

// 定义对象 有 name 属性的 对象
var obj2 = {
    name: '我是name' // 注意 这个对象里面的是 name
}
obj.getName.call(obj2); // 调用 obj 的 getName 方法 传入一个有 name 属性的对象、输出为 '我是name'

