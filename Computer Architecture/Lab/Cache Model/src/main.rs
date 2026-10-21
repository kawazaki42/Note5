use rand;
use std::eprintln;
use std::fs::File;
use std::io::{Read, Seek, SeekFrom, Write};
use std::path::Path;

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
        format!("{self:04}")
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
    /// Mapping of cache line indices to main memory page indices.
    tags: [Option<usize>; PAGE_SIZE],

    /// Cache lines.
    ///
    /// A cache line with index `lineno` is only valid if `tags[lineno]` is not `None`.
    body: [Line; PAGE_SIZE],

    /// The file cached by this struct.
    target: File,
}

impl Cache {
    fn for_file(path: &Path) -> Self {
        let target = File::options()
            .read(true)
            .write(true)
            // .create(true)
            .truncate(false)
            .open(path)
            .expect("couldn't open pagefile");

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
    const BYTES_PER_ELEM: usize = 4 + 1; // separator
    const BYTES_PER_LINE: usize = Self::BYTES_PER_ELEM * LINE_SIZE;
    const BYTES_PER_PAGE: usize = Self::BYTES_PER_LINE * PAGE_SIZE + 1; // second newline

    fn file_location(page: usize, line: usize, elem: usize) -> SeekFrom {
        let bytes = (page * Self::BYTES_PER_PAGE
            + line * Self::BYTES_PER_LINE
            + elem * Self::BYTES_PER_ELEM)
            .try_into()
            .unwrap();

        SeekFrom::Start(bytes)
    }

    fn maybe_load(&mut self, page: usize, line: usize) -> bool {
        for (cached_line, cached_page) in self.tags.iter().enumerate() {
            if *cached_page == Some(page) && cached_line == line {
                // let line = &self.body[line];
                // return (&line[elem], line, true);
                return false;
            }
        }

        // let offset = page * bytes_per_page + line * BYTES_PER_LINE;
        let offset = Self::file_location(page, line, 0);

        self.target
            // .seek(SeekFrom::Start(offset.try_into().unwrap()))
            .seek(offset)
            .expect("couldn't navigate inside file");

        let mut buf = [0; Self::BYTES_PER_LINE];

        self.target.read_exact(&mut buf).expect("read error");

        let loaded_line = str::from_utf8(&buf)
            .expect("encoding error")
            .split_ascii_whitespace()
            .map(|it| it.parse())
            .collect::<Result<Vec<u16>, _>>()
            .expect("not a number")
            .try_into() // [_; _]
            .expect("malformed pagefile");

        self.unload(line);

        self.tags[line] = Some(page);
        self.body[line] = loaded_line;

        true
    }

    /// # Returns
    /// - element (member of line)
    /// - line
    /// - whether it's found in cache
    // /
    // / (element is member of line)
    fn get(&mut self, page: usize, line: usize, elem: usize) -> (&Element, &Line, bool) {
        let is_new = self.maybe_load(page, line);

        let line = &self.body[line];

        (&line[elem], line, !is_new)
    }

    fn write(&mut self, page: usize, line: usize, elem: usize, value: Element) {
        self.maybe_load(page, line);

        self.body[line][elem] = value;
    }

    fn unload(&mut self, line: usize) {
        // self.tags[line] = None;
        let Some(page) = self.tags[line].take() else {
            return;
        };

        self.target
            .seek(Self::file_location(page, line, 0))
            .expect("couldn't navigate inside file");

        write!(self.target, "{}", self.body[line].repr()).expect("pagefile write error");
    }

    fn stat(&self) -> String {
        let mut result = String::new();

        for (i, x) in self.tags.iter().enumerate() {
            let Some(x) = x else { continue };

            result += &format!("Cache line {i} used for page {x}: {:?}\n", self.body[i]);
        }

        result
    }
}

const HELP: &str = "Available commands:
help
read <page> <line> <elem>
write <page> <line> <elem> <new_value>
stat
exit";

fn main() {
    init_pagefile();

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
