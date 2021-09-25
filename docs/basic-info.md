# 基础概念

在基本语句上跟常规的编程语言一样，rust包含了常见的数据类型和条件语句，但在rust的语言下，但仍有不同的特点

## Mutable

所有可修改的变量，都需要手动加 mut关键词标识

```rust
let a = 1; // immutable
let mut a = 1; // mutable
```

## Shadowing

在rust中变量可以重复定义，并使用的时候覆盖当前作用域的变量名，rust的作用域是{ 和 }包裹的块级作用域

```rust
let x = 5;
let x = x + 1;
{
  let x = x + 1;
  // x is 7
}
// x is 6
```

## Expression vs Statement

rust中借助{}和分号来区分逻辑执行语句和最后返回表达式，分号是隔绝语句的拼接方式，不然在编译层面，没有分号的隔离的代码，rust会视作一条语句进行编译

```rust
let a = 5;
let a = { 5 };
let a = { 
  let a = a + 1;
  a + 5
};
```

在{}的块级作用域中，rust会把最后一条不含分号(;)的语句视作expression并作为块级作用域的返回值，这点在rust函数中也试用

```rust

fn foo() {
  5
}
let  a = foo();

```
> 这种时候跨级作用域类似于JavaScript中的立即执行函数 (function(){ /* code */ })()

以此推导，所以rust的if语句也能够作为expression执行，因为if语句的条件执行体也是一个{}的块级作用域

```rust
let a = if true { 1 } else { 2 };
```