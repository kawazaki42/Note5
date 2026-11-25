use std::hint::black_box; // prevent optimizations
use std::time;
use rand::random;
use rand::fill;

const SAMPLE_ARRAY_SIZE: usize = 1e6 as usize;
const RETRIES: usize = 10;

type SampleItem = u64;
type SampleArray = [SampleItem; SAMPLE_ARRAY_SIZE];

fn array_access_times(sample: &mut SampleArray) -> Box<[time::Duration; SAMPLE_ARRAY_SIZE]> {
    println!("67");

    let mut result = Box::new([time::Duration::default(); SAMPLE_ARRAY_SIZE]);

    for i in 0..SAMPLE_ARRAY_SIZE {
        let start = time::Instant::now();

        let item = black_box(sample[i]);

        let modified_item = item + 0x55_55_55_55;

        sample[i] = modified_item;

        let bench = start.elapsed();
        result[i] = bench;
    }

    result
}

fn main() {
    // let mut sample: [SampleItem; SAMPLE_ARRAY_SIZE] = random();

    // let mut sample: Box<SampleArray> = Box::new(random());

    let mut sample = Box::new([0; SAMPLE_ARRAY_SIZE]);
    
    
    fill(sample.as_mut_slice());
    
    // for _ in 0..RETRIES {
        // }
        // println!("{:#?}", array_access_times(&mut sample));
        
        
    for i in array_access_times(&mut sample) {
        println!("{i:?}")
    }



    // println!("Hello, world!");
}
