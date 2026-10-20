use rand;
use std::eprintln;
// use std::eprintln;
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
        // self.iter().map(|it| format!("{}", it)).join(" ")
        // format!("{} {} {} {}", self[0], self[1], self[2], self[3])
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

        // File::open(FILENAME)
        const BYTES_PER_ELEM: usize = 4 + 1; // separator
        const BYTES_PER_LINE: usize = BYTES_PER_ELEM * LINE_SIZE;
        let bytes_per_page = BYTES_PER_LINE * PAGE_SIZE + 1; // second newline

        let offset = page * bytes_per_page + line * BYTES_PER_LINE;

        self.target
            .seek(SeekFrom::Start(offset.try_into().unwrap()))
            .expect("couldn't navigate inside file");

        let mut buf = [0; BYTES_PER_LINE];

        self.target.read_exact(&mut buf).expect("read error");

        // let mut cursor = &buf;

        // let line = Line::zero();

        // let (this, cursor) = cursor.split_at(4);

        // buf.chunks(BYTES_PER_ELEM).flat_map(|it| &str::);
        let loaded_line = str::from_utf8(&buf)
            .expect("encoding error")
            .split_ascii_whitespace()
            .map(|it| it.parse())
            .collect::<Result<Vec<u16>, _>>()
            .expect("not a number");
        // .collect<Vec<u16>>()

        // let line = std::array::from_fn(|_| iter.next());

        // let line: &Line = &line[..4];

        // line.

        self.tags[line] = Some(page);
        self.body[line] = loaded_line.try_into().expect("malformed pagefile");

        let line = &self.body[line];
        return (&line[elem], line, false);

        // self.target.bytes().find
    }
}

fn main() {
    init_pagefile();

    // let tags: [Option<Line>] = [None; PAGE_SIZE];
    // let cache = [CacheLine::default(); PAGE_SIZE];
    // let cache: [_; PAGE_SIZE] = std::array::from_fn(|_| CacheLine::Empty);

    let file = File::open(FILENAME).expect("couldn't open pagefile");

    let mut cache = Cache::for_file(file);

    eprintln!("Enter three integers to get an element: <page> <line> <elem>");
    loop {
        eprint!("> ");

        let mut buf = String::new();

        std::io::stdin().read_line(&mut buf).expect("i/o error");

        if buf == "exit" {
            return;
        }

        let words: Vec<&str> = buf.split_whitespace().collect();

        let [page, line, elem] = words[..] else {
            eprintln!("Invalid address!");
            eprintln!("Should be <page> <line> <elem>");
            continue;
        };

        let Ok(page @ 0..BANK_SIZE) = page.parse::<usize>() else {
            eprintln!("Invalid page index!");
            eprintln!("Should be integer between 0 and {}", BANK_SIZE - 1);
            continue;
        };

        let Ok(line @ 0..PAGE_SIZE) = line.parse::<usize>() else {
            eprintln!("Invalid line index!");
            eprintln!("Should be integer between 0 and {}", PAGE_SIZE - 1);
            continue;
        };

        let Ok(elem @ 0..LINE_SIZE) = elem.parse::<usize>() else {
            eprintln!("Invalid element index!");
            eprintln!("Should be integer between 0 and {}", LINE_SIZE - 1);
            continue;
        };

        // eprintln!("you win");
        // if tags.contains(&Some(page)) {

        // }

        let (elem, line, hit) = cache.get(page, line, elem);

        eprintln!("Cache {}", if hit { "hit" } else { "miss" });
        eprintln!("Read: {}", elem);
        eprintln!("In line: {:?}", line);
    }
}
