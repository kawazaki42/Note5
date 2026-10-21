use std::io::Write;
use std::path::Path;

use cache_model::Cache;
use cache_model::rand::create_random_pagefile;
use cache_model::{BANK_SIZE, LINE_SIZE, PAGE_SIZE};

use clap::Parser;
use clap::Subcommand;

#[derive(Parser)]
#[command(multicall = true)]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Read a memory address
    #[command(visible_alias = "r")]
    Read {
        page: usize,
        line: usize,
        elem: usize,
    },

    /// Write to cache
    #[command(visible_alias = "w")]
    Write {
        page: usize,
        line: usize,
        elem: usize,
        new_value: u16,
    },

    /// Unload a cache line (cause main memory write)
    #[command(visible_alias = "u")]
    Unload {
        cache_line: usize,
    },

    /// Show cache status
    #[command(visible_alias = "s")]
    Stat,

    Exit,
}

const FILENAME: &str = "Pagefile.txt";

fn main() -> Result<(), String> {
    let path = Path::new(FILENAME);

    create_random_pagefile(path);

    let mut cache = Cache::for_file(path);

    loop {
        let line = readline()?;

        match respond(&line, &mut cache) {
            Ok(quit) => {
                if quit {
                    break;
                }
            }
            Err(err) => {
                write!(std::io::stderr(), "{err}").map_err(|e| e.to_string())?;
                std::io::stderr().flush().map_err(|e| e.to_string())?;
            }
        }
    }

    Ok(())
}

fn respond(line: &str, cache: &mut Cache) -> Result<bool, String> {
    if line.is_empty() {
        eprintln!();
        return Ok(true);
    }

    if line.trim().is_empty() {
        return Ok(false);
    }

    let args = line.split_whitespace();
    let cli = Cli::try_parse_from(args).map_err(|e| e.to_string())?;

    match cli.command {
        Command::Read { page, line, elem } => {
            validate_address(page, line, elem)?;

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
        Command::Write {
            page,
            line,
            elem,
            new_value,
        } => {
            validate_address(page, line, elem)?;
            if !(1000..=9999).contains(&new_value) {
                return Err("New value has invalid amount of digits\n".into());
            }
            cache.write(page, line, elem, new_value);
        }
        Command::Unload { cache_line } => {
            validate_address(0, cache_line, 0)?;
            cache.unload(cache_line)
        }
        Command::Stat => {
            eprintln!("{}", cache.stat());
        }
        Command::Exit => return Ok(true),
    }

    Ok(false)
}

fn validate_address(page: usize, line: usize, elem: usize) -> Result<(), String> {
    // if !(0..BANK_SIZE).contains(&page) { return Err("".into()); }
    match (page, line, elem) {
        (0..BANK_SIZE, 0..PAGE_SIZE, 0..LINE_SIZE) => Ok(()),
        _ => Err("Invalid address\n".into()),
    }
}

fn readline() -> Result<String, String> {
    write!(std::io::stderr(), "> ").map_err(|e| e.to_string())?;
    std::io::stderr().flush().map_err(|e| e.to_string())?;

    let mut buffer = String::new();
    std::io::stdin()
        .read_line(&mut buffer)
        .map_err(|e| e.to_string())?;

    Ok(buffer)
}
