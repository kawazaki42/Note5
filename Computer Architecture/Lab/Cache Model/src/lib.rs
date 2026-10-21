use std::fs::File;
use std::io::SeekFrom;
use std::io::{Read, Seek, Write};
use std::path::Path;

pub mod rand;
pub mod repr;
pub mod zero;

use repr::Repr;
use zero::Zero;

pub const LINE_SIZE: usize = 4;
pub const PAGE_SIZE: usize = 10;
pub const BANK_SIZE: usize = 10;

// #[derive(Debug)]
// struct Element(u16);

pub type Element = u16;
pub type Line = [Element; LINE_SIZE];
pub type Page = [Line; PAGE_SIZE];
pub type Bank = [Page; BANK_SIZE];

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

pub struct Cache {
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

// impl Default for Cache {
//     fn default() -> Self {
//         Self { tags: [None; _], body: Page::zero(), target: () }
//     }
// }

impl Cache {
    const BYTES_PER_ELEM: usize = 4 + 1; // separator
    const BYTES_PER_LINE: usize = Self::BYTES_PER_ELEM * LINE_SIZE;
    const BYTES_PER_PAGE: usize = Self::BYTES_PER_LINE * PAGE_SIZE + 1; // second newline

    pub fn for_file(path: &Path) -> Self {
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
    pub fn get(&mut self, page: usize, line: usize, elem: usize) -> (&Element, &Line, bool) {
        let is_new = self.maybe_load(page, line);

        let line = &self.body[line];

        (&line[elem], line, !is_new)
    }

    pub fn write(&mut self, page: usize, line: usize, elem: usize, value: Element) {
        self.maybe_load(page, line);

        self.body[line][elem] = value;
    }

    pub fn unload(&mut self, line: usize) {
        // self.tags[line] = None;
        let Some(page) = self.tags[line].take() else {
            return;
        };

        self.target
            .seek(Self::file_location(page, line, 0))
            .expect("couldn't navigate inside file");

        write!(self.target, "{}", self.body[line].repr()).expect("pagefile write error");
    }

    pub fn stat(&self) -> String {
        let mut result = String::new();

        for (i, x) in self.tags.iter().enumerate() {
            let Some(x) = x else { continue };

            result += &format!("Cache line {i} used for page {x}: {:?}\n", self.body[i]);
        }

        result
    }
}
