use rand;
use std::fs::File;
use std::io::{Read, Seek, SeekFrom, Write};

// #[derive(Debug)]
// struct Element(u16);

const LINE_SIZE: usize = 4;
const PAGE_SIZE: usize = 10;
const BANK_SIZE: usize = 10;

type Element = u16;
type Line = [Element; LINE_SIZE];
type Page = [Line; PAGE_SIZE];
type Bank = [Page; BANK_SIZE];

const FILENAME: &str = "Pagefile.txt";

trait Random {
    fn random() -> Self;
}

impl Random for u16 {
    fn random() -> Self {
        // Self(rand::random_range(1000u16..=9999))
        rand::random_range(1000u16..=9999)
    }
}

impl<T: Random, const S: usize> Random for [T; S] {
    fn random() -> Self {
        std::array::from_fn(|_| T::random())
    }
}

trait Repr {
    // const SEPARATOR: &str;

    fn repr(&self) -> String;
}

impl Repr for Element {
    fn repr(&self) -> String {
        format!("{self}")
    }
}

impl Repr for Line {
    fn repr(&self) -> String {
        self.iter().map(Element::repr).collect::<Vec<_>>().join(" ")
    }
}

impl Repr for Page {
    fn repr(&self) -> String {
        self.iter().map(Line::repr).collect::<Vec<_>>().join("\n")
    }
}

impl Repr for Bank {
    fn repr(&self) -> String {
        self.iter().map(Page::repr).collect::<Vec<_>>().join("\n\n")
    }
}

fn init_pagefile() {
    let mut file = File::create(FILENAME).expect("unable to open file");
    let data = Bank::random();

    writeln!(file, "{}", data.repr()).expect("unable to write initial memory");
}

// enum CacheLine {
//     Empty,
//     Loaded {
//         page: usize,
//         data: Line,
//     }
// }

// impl Default for CacheLine {
//     fn default() -> Self {
//         Self::Empty
//     }
// }

trait Zero {
    fn zero() -> Self;
}

impl<T: Zero + Copy, const S: usize> Zero for [T; S] {
    fn zero() -> Self {
        [T::zero(); S]
    }
}

impl Zero for u16 {
    fn zero() -> Self {
        0
    }
}

struct Cache {
    // let tags = [Option::<usize>::None; PAGE_SIZE];
    // let cache_body = Page::zero();
    tags: [Option<usize>; PAGE_SIZE],
    body: [Line; PAGE_SIZE],
    target: File,
}

impl Cache {
    fn for_file(target: File) -> Self {
        Self {
            tags: [None; _],
            body: Page::zero(),
            target,
        }
    }
}

// impl Default for Cache {
//     fn default() -> Self {
//         Self { tags: [None; _], body: Page::zero(), target: () }
//     }
// }

impl Cache {
    fn get(&mut self, page: usize, line: usize, elem: usize) -> (&Element, &Line, bool) {
        for (cached_line, cached_page) in self.tags.iter().enumerate() {
            if *cached_page == Some(page) && cached_line == line {
                let line = &self.body[line];
                return (&line[elem], line, true);
            }
        }

        const BYTES_PER_ELEM: usize = 4 + 1; // separator
        const BYTES_PER_LINE: usize = BYTES_PER_ELEM * LINE_SIZE;
        let bytes_per_page = BYTES_PER_LINE * PAGE_SIZE + 1; // second newline

        let offset = page * bytes_per_page + line * BYTES_PER_LINE;

        self.target
            .seek(SeekFrom::Start(offset.try_into().unwrap()))
            .expect("couldn't navigate inside file");

        let mut buf = [0; BYTES_PER_LINE];

        self.target.read_exact(&mut buf).expect("read error");

        let loaded_line = str::from_utf8(&buf)
            .expect("encoding error")
            .split_ascii_whitespace()
            .map(|it| it.parse())
            .collect::<Result<Vec<u16>, _>>()
            .expect("not a number");

        self.tags[line] = Some(page);
        self.body[line] = loaded_line.try_into().expect("malformed pagefile");

        let line = &self.body[line];
        return (&line[elem], line, false);
    }
}

const HELP: &str = "Available commands:
help
read <page> <line> <elem>
exit";

fn main() {
    init_pagefile();

    let file = File::open(FILENAME).expect("couldn't open pagefile");

    let mut cache = Cache::for_file(file);

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

                eprintln!("Found in cache: {hit}; {time:?}");
                eprintln!(
                    "Read: {elem}",
                    // if hit { "cached" } else { "not found in cache" }
                );
                eprintln!("In line: {:?}", line);
            }
            None => {}
            Some(c) => {
                eprintln!("No such command: {c}");
                continue;
            }
        }
    }
}
