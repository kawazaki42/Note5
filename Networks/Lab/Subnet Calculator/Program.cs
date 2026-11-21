using System;
using System.Net;
using System.Numerics;

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
    const int RESERVED_ADDRESS_COUNT = 2;

    uint addressesToReserve() => Size + RESERVED_ADDRESS_COUNT;

    uint maxIndexInSubnet() => addressesToReserve() - 1;

    public int PrefixLength
    {
        get => BitOperations.LeadingZeroCount(maxIndexInSubnet());
    }

    public static SubnetDescription Parse(string s)
    {
        switch (s.Split(':'))
        {
            case [string name, string size]:
                return new SubnetDescription(name, uint.Parse(size));
            default:
                throw new FormatException($"Invalid subnetwork description: {s}");
        }
    }

    public override string ToString() => $"{Name}: {Size}";
}
