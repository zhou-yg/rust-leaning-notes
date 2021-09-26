use std::io::stdin;
use rand::Rng;

fn main() {
  let mut s = String::from("hello");

  let r1 = &s;
  let r2 = &s;

  println!("{} and {}", r1, r2);

  let r3 = &mut s;
  println!("r3 is {}", r3);


  testSlice();
}

fn testSlice() {
  let mut s  = String::from("hello");
  let word = &s[..3];

  // s.clear(); // no!

  println!("word is {}", word);
}
