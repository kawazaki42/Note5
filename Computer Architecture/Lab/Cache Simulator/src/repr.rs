//! Text representation for memory.

use crate::{Bank, Element, Line, Page};

pub trait Repr {
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
