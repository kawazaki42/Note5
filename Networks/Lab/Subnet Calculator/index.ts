class ArgumentError extends Error {};

// function parseIPv4(s: string): [number, number, number, number, number] {
function parseIPv4(s: string): {
    octets: [number, number, number, number],
    maskLength: number,
} | null {
    const int = "(\\d+)";
    const dot = "\\.";

    const re = [int, int, int, int].join(dot) + '/' + int;

    const match = s.match('^' + re + '$');

    if (!match)
        return null;

    const _full = match.shift();

    const maskLength = Number(match.pop());

    const octets = match.map(Number) as [number, number, number, number];

    return { octets, maskLength };
}

function parseArgs(argv: string[]) {
    const args = argv.toSpliced(0, 2);

    const network = args.shift();
    const subnets = args.map(Number);

    console.debug(subnets);

    if (!network) {
        throw new ArgumentError("No toplevel network specified");
    }

    if (subnets.length < 1)
        throw new ArgumentError("No subnetwork sizes specified");

    const network = parseIPv4(network);

    // return [network, subnets];
}

function main() {// node, .js


    // let parts = network.split('/');

    // if 


    // let it = network.matchAll(re);

    // console.log(it);

    // console.log(match[1]);

    // const [...octets, maskLength] = match;

    // const octets = match.slice(1, 5)

    function closestPow2(x: number): number {
        const bits = Math.log2(x);
        return Math.ceil(bits);
    }

    // function roundUpToPow2(x: number): number {


    //     return 2 ** bits;
    // }

    // for (const ss of subnetSizes) {
    //     // account reserved addresses: all-0 and all-1
    //     const it = roundUpToPow2(ss + 2);
    //     console.log(it);
    // }

    // console.debug([...subnetSizes.entries()]);

    // const subnets = new Map();

    const BITS_PER_IPV4_ADDRESS = 32;

    const maskSizes = subnets
    .map(size => closestPow2(size + 2));
    //   .map(bits => BITS_PER_IPV4_ADDRESS - bits);

    console.debug(maskSizes.map(it => 2 ** it));
}

main();
