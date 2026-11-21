class ArgumentError extends Error {};

const BITS_PER_IPV4_ADDRESS = 32;

type IpAddress = {
    octets: [number, number, number, number],
    maskLength: number,
}

// type IpAddress = [number, number, number, number];

// class Network {
//     ipAddress: IpAddress;
//     maskLength: number;

//     constructor(ipAddress: IpAddress, maskLength: number) {
//         this.ipAddress = ipAddress;
//         this.maskLength = maskLength;
//     }

//     get size() {
//         return 2 ** (BITS_PER_IPV4_ADDRESS - this.maskLength);
//     }
// }

// type Subnet = {
//     name: string,
//     size: number,
// }

class Subnet {
    name: string;
    size: number;

    constructor(name: string, size: number) {
        this.name = name;
        this.size = size;
    }

    get bitLength(): number {
        return closestPow2(this.size + 2)
    }

    get maskLength(): number {
        return BITS_PER_IPV4_ADDRESS - this.bitLength;
    }
}

// function parseIPv4(s: string): [number, number, number, number, number] {
function parseIPv4(s: string): IpAddress | null {
    const int = "(\\d+)";
    const dot = "\\.";

    const re = [int, int, int, int].join(dot) + '/' + int;

    const match = s.match('^' + re + '$');

    if (!match)
        return null;

    // const _full = match.shift();

    // const maskLength = Number(match.pop());

    // danger
    // const octets = match.map(Number) as [number, number, number, number];

    const [, maskLengthStr, ...octetStrs] = match;

    const maskLength = Number(maskLengthStr);
    const octets = octetStrs.map(Number);

    if (octets.length != 4)
        throw new ArgumentError();

    return { octets, maskLength };
}

function parseSubnetDesc(desc: string): Subnet {
    const [name, size] = desc.split(':');

    if (name === undefined)
        throw new ArgumentError("No subnet name specified (should be name:size)");

    if (size === undefined)
        throw new ArgumentError("No subnet size specified (should be name:size)");

    return new Subnet(
        name,
        Number(size),
    );
}

function parseArgs(argv: string[]): [IpAddress, Subnet[]] {
    const args = argv.toSpliced(0, 2);

    // // const ip = args.shift();
    // // const subnets = args.map(Number);

    const [ip, ...subnetDescs] = args;

    // subnets = subnets.map(Number);

    const subnets = subnetDescs.map(desc => parseSubnetDesc(desc));

    const [networkStr, ...subnetStrs] = args;

    console.debug(subnetStrs);

    if (!networkStr) {
        throw new ArgumentError("No toplevel network specified");
    }

    if (subnetStrs.length < 1)
        throw new ArgumentError("No subnetwork sizes specified");

    const network = parseIPv4(networkStr);

    if (!network)
        throw new ArgumentError("Invalid IPv4 address");


    return [network, subnets];
}

function closestPow2(x: number): number {
    const bits = Math.log2(x);
    return Math.ceil(bits);
}

function main() {
    
    // node, .js


    // let parts = network.split('/');

    // if 


    // let it = network.matchAll(re);

    // console.log(it);

    // console.log(match[1]);

    // const [...octets, maskLength] = match;

    // const octets = match.slice(1, 5)

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

    const [network, subnets] = parseArgs(process.argv);

    subnets.sort((a, b) => a.maskLength - b.maskLength);

    if (subnets[0] === undefined)
        throw new ArgumentError("No subnets specified");

    // network.size < subnets[0].size
    if (network.maskLength > subnets[0].maskLength)
        throw new ArgumentError("Subnetwork too big");

    


    // for (const net of subnets) {
    //     if net
    // }


    // const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

    // letters.forEach((letter, index)  )

    // if (subnetSizes.length > letters.length)
        // throw new ArgumentError("Can't assign ");

    // const maskSizes = subnets
    // .map(size => closestPow2(size + 2));
    //   .map(bits => BITS_PER_IPV4_ADDRESS - bits);

    // console.debug(maskSizes.map(it => 2 ** it));
}

main();
