use std::io::stdin;
use rand::Rng;

fn main() {
  println!("start");

  let mut num = String::new();

  stdin().read_line(&mut num);

  let secret = rand::thread_rng().gen_range(1..10);

  println!("the input {}, anwser = {}", num, secret);

  let guess: u32 = match num.trim().parse() {
    Ok(num) => num,
    Err(e) => {
      println!("{}", e);
      1
    },
  };

    println!("the input {}, s = {}, parsed num = {}", num, secret, guess);
}