class ArgumentError extends Error { };

const BITS_PER_IPV4_ADDRESS = 32;

class IPNetwork {
    octets: [number, number, number, number];
    prefixLength: number;

    get suffixLength(): number {
        return BITS_PER_IPV4_ADDRESS - this.prefixLength;
    }

    constructor(octets: [number, number, number, number], maskLength: number) {
        // if (typeof(octets) === 'number')
            

        this.octets = octets;
        this.prefixLength = maskLength;
    }

    static fromInt32(int: number): [number, number, number, number] {
        return [
            (int & 0xff00_0000) >>> 24,
            (int & 0x00ff_0000) >>> 16,
            (int & 0x0000_ff00) >>> 8,
            (int & 0x0000_00ff),
        ];
    }

    static parse(s: string): IPNetwork | null {
        const int = "(\\d+)";
        const dot = "\\.";

        const re = [int, int, int, int].join(dot) + '/' + int;

        const match = s.match('^' + re + '$');

        if (match === null)
            return null;

        const _full = match.shift();
        const maskLengthStr = match.pop();
        const octetStrs = match;

        // const [, maskLengthStr, ...octetStrs] = match;

        const maskLength = Number(maskLengthStr);
        const octets = octetStrs.map(Number) as [number, number, number, number];

        if (octets.length != 4)
            throw new ArgumentError();

        return new IPNetwork(octets, maskLength);
    }

    asInt32(): number {
        let result = 0;

        for (const byte of this.octets) {
            result <<= 8;
            result |= byte;
        }

        return result;
    }

    // bisectLeft(): IPNetwork {
    //     return new IPNetwork(this.octets, this.prefixLength + 1);
    // }

    // bisectRight(): IPNetwork {
    //     const left = this.bisectLeft()
    // }

    bisect(): [IPNetwork, IPNetwork] {
        const left = new IPNetwork(this.octets, this.prefixLength + 1);

        const int = this.asInt32() | (1 << left.suffixLength);
        const rightBytes = IPNetwork.fromInt32(int);
        const right = new IPNetwork(rightBytes, left.prefixLength);

        return [left, right];
    }

    // bisect(direction: boolean): IPNetwork {
    //     // if (!direction)
    //     //     return new IPNetwork(this.octets, this.prefixLength + 1);

    //     const int = this.asInt32() | (1 << (this.suffixLength - 1));
    //     console.assert(int !== this.asInt32());

    // }
}

class Subnet {
    name: string;
    size: number;

    constructor(name: string, size: number) {
        this.name = name;
        this.size = size;
    }

    static parse(desc: string): Subnet {
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

    get bitLength(): number {
        return closestPow2(this.size + 2)
    }

    get maskLength(): number {
        return BITS_PER_IPV4_ADDRESS - this.bitLength;
    }
}

class BinaryTree<T> {
    value: T;
    left: BinaryTree<T> | null = null;
    right: BinaryTree<T> | null = null;

    constructor(value: T) {
        this.value = value;
    }
}

function parseArgs(argv: string[]): [IPNetwork, Subnet[]] {
    const args = argv.toSpliced(0, 2);

    const [networkStr, ...subnetStrs] = args;

    const subnets = subnetStrs.map(desc => Subnet.parse(desc));

    // const [networkStr, ...subnetStrs] = args;

    // console.debug(subnetStrs);

    if (networkStr === undefined) {
        throw new ArgumentError("No toplevel network specified");
    }

    if (subnetStrs.length < 1)
        throw new ArgumentError("No subnetwork sizes specified");

    const network = IPNetwork.parse(networkStr);

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

    // debugger;

    // network.size < subnets[0].size
    if (network.prefixLength >= subnets[0].maskLength)
        throw new ArgumentError("Subnetwork too big");

    // let { maskLength } = network;

    // const tree: {
    //     network: IPNetwork,
    //     assigned: Subnet | null,
    //     left
    // } = { network, assigned: null };

    // const tree: BinaryTree<[IPNetwork, Subnet | null]> = new BinaryTree([network, null]);
    // {
    //     value: [network, null],
    //     left: null,
    //     right: null,
    // };

    // let todo = [tree];
    // let task: Subnet;
    // let arrayTree: [IPNetwork, Subnet | null][] = [[network, null]]
    let arrayTree: [{
        network: IPNetwork,
        task: Subnet | 'unused' | null,
    }] = [{
        network,
        task: null,
    }];
    
    let i = 0;
    // for (let i = 0;; i++) {

    for (const task of subnets) {
        while (true) {
            const [left, right] = arrayTree[i]!.network.bisect();
            arrayTree.push({network: left, task: null});
            arrayTree.push({network: right, task: null});

            arrayTree[i]!.task = 'unused';

            // arrayTree.push([right, null]);
    
            // JSON.stringify(1, null, )
            i++;

            if (
                arrayTree[i]!.network.prefixLength === task.maskLength
                && arrayTree[i]!.task === null
            ) break;
        }
        
        arrayTree[i]!.task = task;


    }


    // while ((task = subnets.shift()) !== undefined)
    // while (true) {
    //     const task = subnets.shift();

    //     if (task === undefined)
    //         break;

    //     for (const node of todo) {
    //         const [left, right] = node.value[0].bisect();
    //         node.left = new BinaryTree([left, null]);
    //         node.right = new BinaryTree([right, null]);

    //         todo.push(node.left, node.right);

    //         if (node.value[0].prefixLength === task.maskLength) {
    //             node.value[1] = task;
    //         }
    //         // break;
    //     }
    // }
    
    // console.debug(Bun.YAML.stringify(tree, null, 2));
    // console.debug(JSON.stringify(tree, null, 2))
    console.debug(JSON.stringify(arrayTree, null, 2))
    // console.debug(tree);

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
