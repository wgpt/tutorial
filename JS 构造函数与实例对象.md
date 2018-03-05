  构造函数        ————————> (new fun()) ---->           实例对象
     |                                                    |
     |                                                    |—————— this ( 指向自己的 new Object  [注意 不会调用直接属性 fun.a != object.a ])
     |                                                    |
     |___原型对象( fun.prtototype )    === (eq)             ——————  __proto__ 原型属性 ( object.__proto__ == fun.protototype )
     |                                                    |
     |                                                    |
     |___直接属性( fun.a )             === (eq)             ———————  constructor 构造属性 ( object.constructor.a === fun.a )
