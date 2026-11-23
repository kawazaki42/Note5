class ArgumentError extends Error { };

const BITS_PER_IPV4_ADDRESS = 32;

class IPNetwork {
    octets: [number, number, number, number];
    prefixLength: number;

    get suffixLength(): number {
        return BITS_PER_IPV4_ADDRESS - this.prefixLength;
    }

    constructor(octets: [number, number, number, number], maskLength: number) {
        this.octets = octets;
        this.prefixLength = maskLength;
    }

    asInt32(): number {
        let result = 0;

        for (const byte of this.octets) {
            result |= byte;
            result << 8;
        }

        return result;
    }
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

interface BinaryTree<T> {
    value: T;
    left: BinaryTree<T> | null;
    right: BinaryTree<T> | null;
}

// function parseIPv4(s: string): [number, number, number, number, number] {
function parseIPv4(s: string): IPNetwork | null {
    const int = "(\\d+)";
    const dot = "\\.";

    const re = [int, int, int, int].join(dot) + '/' + int;

    const match = s.match('^' + re + '$');

    if (match === null)
        return null;

    // const _full = match.shift();

    // const maskLength = Number(match.pop());

    // danger
    // const octets = match.map(Number) as [number, number, number, number];

    const [, maskLengthStr, ...octetStrs] = match;

    const maskLength = Number(maskLengthStr);
    const octets = octetStrs.map(Number) as [number, number, number, number];

    if (octets.length != 4)
        throw new ArgumentError();

    return new IPNetwork(octets, maskLength);
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

function parseArgs(argv: string[]): [IPNetwork, Subnet[]] {
    const args = argv.toSpliced(0, 2);

    const [networkStr, ...subnetStrs] = args;

    const subnets = subnetStrs.map(desc => parseSubnetDesc(desc));

    // const [networkStr, ...subnetStrs] = args;

    console.debug(subnetStrs);

    if (networkStr === undefined) {
        throw new ArgumentError("No toplevel network specified");
    }

    if (subnetStrs.length < 1)
        throw new ArgumentError("No subnetwork sizes specified");

    const network = parseIPv4(networkStr);

    if (network === null)
        throw new ArgumentError("Invalid IPv4 address");

    return [network, subnets];
}

function closestPow2(x: number): number {
    const bits = Math.log2(x);
    return Math.ceil(bits);
}

function main() {
    const [network, subnets] = parseArgs(process.argv);

    subnets.sort((a, b) => a.maskLength - b.maskLength);

    if (subnets[0] === undefined)
        throw new ArgumentError("No subnets specified");

    // network.size < subnets[0].size
    if (network.prefixLength > subnets[0].maskLength)
        throw new ArgumentError("Subnetwork too big");

    // let { maskLength } = network;

    const tree = { value: network };



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
