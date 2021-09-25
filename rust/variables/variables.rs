use std::io::stdin;
use rand::Rng;

fn main() {
  let mut x = 5;
  println!(" x is {}", x);
  x = 6;
  println!(" x is {}", x);

  let x = x + 1;

  {
    let x = x * 2;
    println!("在{{}}里面的x = {}", x);
  }
  println!("在{{}}外面的x = {}", x);

  const THREE_HOURS: u32 = 3600 * 1000 * 3;

  // 数字类型
  let a = 3.3;
  let b = 1.6;
  let c = a/b;
  let d = a % 3.0;
  println!("c is  {}, d is {}", c, d);
  // char
  let char1 = 'A';
  let char2 = '👌';
  println!("char2 is {}", char2);
  // tuple
  let tup1: (u32, char, bool) = (33, 'z', true);
  let ( t0, t1, t2 ) = tup1;
  println!("tup {} {}", t0, tup1.1);
  // array
  let arr = [3;5];
  println!("arr is {}", arr[0]);

  // let mut inputIndex = String::new();
  // stdin().read_line(&mut inputIndex);
  // let inputIndex: usize = inputIndex.trim().parse().expect("must be number");
  // println!("find value is {} by {}", arr[inputIndex], inputIndex);
  
  // 函数
  let value = myFunc();
  let value2 = {
    let x = 3;
    x + 1
  };
  println!("func return value is {}", value2);

  ifelse();

  mkLoop();
}


fn myFunc() -> u32 {
  return 5;
}

fn ifelse() {
  let a = 3;
  if a == 3 {
    println!("true");
  } else {
    println!("f");
  }

  let bb = if a>3 { 4 } else { 5 };
  println!("bb is {}", bb);
}

fn mkLoop() {
  let mut a = 3;

  let bb = loop {

    if a > 4 {
      break 33;
    }
    a = a + 1;
  };
  println!("bb is {}", bb);

}