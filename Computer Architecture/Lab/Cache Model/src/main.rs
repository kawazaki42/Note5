// use rand;
use std::path::Path;

use cache_model::rand::create_random_pagefile;
use cache_model::{BANK_SIZE, LINE_SIZE, PAGE_SIZE};
use cache_model::{Cache, Element};

const FILENAME: &str = "Pagefile.txt";

const HELP: &str = "Available commands:
help
read <page> <line> <elem>
write <page> <line> <elem> <new_value>
stat
exit";

fn main() {
    create_random_pagefile(Path::new(FILENAME));

    // let file = File::open(FILENAME).expect("couldn't open pagefile");

    let mut cache = Cache::for_file(Path::new(FILENAME));

    eprintln!("{HELP}");
    loop {
        eprint!("> ");

        let mut buf = String::new();

        let bytes_read = std::io::stdin().read_line(&mut buf).expect("i/o error");

        if bytes_read == 0 {
            eprintln!();
            return;
        }

        let mut words = buf.split_whitespace();

        match words.next() {
            Some("exit") => return,

            Some("help") => {
                eprintln!("{HELP}");
                continue;
            }

            Some("read" | "r") => {
                fn invalid_address() {
                    eprintln!("Invalid address!");
                    eprintln!("Should be: <page> <line> <elem>");
                }

                let Ok(address): Result<[&str; 3], _> = words.collect::<Vec<_>>().try_into() else {
                    invalid_address();
                    continue;
                };

                let [
                    Ok(page @ 0..BANK_SIZE),
                    Ok(line @ 0..PAGE_SIZE),
                    Ok(elem @ 0..LINE_SIZE),
                ] = address.map(|it| it.parse())
                else {
                    invalid_address();
                    continue;
                };

                let start = std::time::Instant::now();
                let (elem, line, hit) = cache.get(page, line, elem);
                let time = start.elapsed();

                eprintln!(
                    "Reading from: {}",
                    if hit { "CACHE" } else { "MAIN MEMORY" }
                );
                eprintln!("Reading took: {time:?}");
                eprintln!("Read element: {elem}",);
                eprintln!("In line: {:?}", line);
            }

            Some("write" | "w") => {
                fn invalid_arguments() {
                    eprintln!("Invalid arguments");
                }

                let Ok(args): Result<[&str; 4], _> = words.collect::<Vec<_>>().try_into() else {
                    invalid_arguments();
                    continue;
                };

                let (
                    Ok(page @ 0..BANK_SIZE),
                    Ok(line @ 0..PAGE_SIZE),
                    Ok(elem @ 0..PAGE_SIZE),
                    Ok(value @ 1000..=9999),
                ) = (
                    args[0].parse(),
                    args[1].parse(),
                    args[2].parse(),
                    args[3].parse::<Element>(),
                )
                else {
                    invalid_arguments();
                    continue;
                };

                cache.write(page, line, elem, value);
            }

            Some("stat" | "s") => {
                // eprintln!("Tags: {:?}", cache.tags);
                eprintln!("{}", cache.stat())
            }

            None => {}

            Some(c) => {
                eprintln!("No such command: {c}");
                continue;
            }
        }
    }
}
