//! Randomization convenience method.

use std::fs::File;
use std::io::Write;
use std::path::Path;

use crate::repr::Repr;
use crate::{Bank, Element};

trait Random {
    fn random() -> Self;
}

impl Random for Element {
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

pub fn create_random_pagefile(path: &Path) {
    let mut file = File::create(path).expect("unable to open file");
    let data = Bank::random();

    writeln!(file, "{}", data.repr()).expect("unable to write initial memory");
}
