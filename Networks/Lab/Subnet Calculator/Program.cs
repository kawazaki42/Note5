// Console.WriteLine(string.Join(", ", args));

// #r "System.CommandLine"

using System;
using System.Net;
using System.Numerics;

// let pair = arg.Split(':', 2)
// select pair;

// let desc = new
// {
//     Name = pair[0],
//     Size = int.Parse(pair.GetValue(1) ?? throw new ArgumentException())
// }

// args[1..]
// .Select(desc => desc.Split(':', 2))
// .Select(pair => );

// foreach (var desc in subnetDescriptions)
// {
//     Console.WriteLine($"{desc.Name}: {desc.Size}");
// }

class Program
{
    static void Main(string[] args)
    {
        switch (args)
        {
            case [var mainNetworkArg, .. var subnetDescs]:
                var mainNetwork = IPNetwork.Parse(mainNetworkArg);

                var subnets =
                    from arg in subnetDescs
                    let desc = SubnetDescription.Parse(arg)
                    orderby desc.Size descending
                    select desc;

                Calculate(mainNetwork, subnets.ToArray());

                break;

            default:
                throw new ArgumentException("Should specify main network and subnets");
        }
    }

    static void Calculate(IPNetwork mainNetwork, SubnetDescription[] subnets)
    {
        foreach (var s in subnets)
        {
            Console.WriteLine($"{s} => {s.PrefixLength}");
        }
    }
}

class BinaryTree<T>
{
    public required T Value;
    public BinaryTree<T>? Left = null, Right = null;
}

internal record struct SubnetDescription(string Name, uint Size)
{
    // internal int bytesNeeded() => 

    // static int closestPow2(uint i)
    // {
    //     var log = Math.Log2(i);
    //     return (int)Math.Round(log, MidpointRounding.ToPositiveInfinity);
    // }

    // const int BITS_PER_IPV4_ADDRESS = 32;

    const int RESERVED_ADDRESS_COUNT = 2;

    uint addressesToReserve() => Size + RESERVED_ADDRESS_COUNT;

    // static uint addressesNeededToReserve(uint hostCount) =>
    //     hostCount + RESERVED_ADDRESS_COUNT - 1;

    // static void watafa() {
    // System.Numerics.BitOperations.RoundUpToPowerOf2()

    // }

    uint maxIndexInSubnet() => addressesToReserve() - 1;

    public int PrefixLength
    {
        get => BitOperations.LeadingZeroCount(maxIndexInSubnet());
    }

    public static SubnetDescription Parse(string s)
    {
        // var pair = s.Split(':');
        switch (s.Split(':'))
        {
            case [string name, string size]:
                return new SubnetDescription(name, uint.Parse(size));
            default:
                throw new FormatException($"Invalid subnetwork description: {s}");
        }
        ;

        // if (pair.Length != 2)
    }

    public override string ToString() => $"{Name}: {Size}";
}
