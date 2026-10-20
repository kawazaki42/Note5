use rand::{self, Fill, distr::uniform::SampleRange};
use std::{eprintln, fs::File, io::Write};

// #[derive(Debug)]
// struct Element(u16);

const LINE_SIZE: usize = 4;
const PAGE_SIZE: usize = 10;
const BANK_SIZE: usize = 10;

type Element = u16;
type Line = [Element; LINE_SIZE];
type Page = [Line; PAGE_SIZE];
type Bank = [Page; BANK_SIZE];

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

// impl Random for Line {
//     fn random() -> Self {
//         std::array::from_fn(|_| Element::random())
//     }
// }

// impl Random for Page {
//     fn random() -> Self {
//         std::array::from_fn(|_| )
//     }
// }

// impl Fill for Element {
//     fn fill_slice<R: rand::prelude::Rng + ?Sized>(this: &mut [Self], rng: &mut R) {

//     }
// }

// impl SampleRange

// type Element = u16;

trait Repr {
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

// fn repr(this: &Bank) {

// }

fn main() {
    let mut f = File::create("Memory.txt").expect("unable to open file");

    // File::
    // let b = <[u8; 8]>::
    // rand::fill(&);
    // let b: Bank = rand::random();
    let b = Bank::random();

    // println!("{}", b.repr());
    writeln!(f, "{}", b.repr()).expect("unable to write initial memory");

    loop {
        eprint!("> ");

        let mut buf = String::new();
        std::io::stdin().read_line(&mut buf).expect("i/o error");

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

        // match page.parse() {
        //     Ok(page @ 0..BANK_SIZE) => (),
        // }

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

        eprintln!("you win");
    }
}
