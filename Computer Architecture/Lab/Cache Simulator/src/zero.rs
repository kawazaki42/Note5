//! Convenience method for zero-fill.

use crate::Element;
pub trait Zero {
    fn zero() -> Self;
}

impl<T: Zero + Copy, const S: usize> Zero for [T; S] {
    fn zero() -> Self {
        [T::zero(); S]
    }
}

impl Zero for Element {
    fn zero() -> Self {
        0
    }
}
