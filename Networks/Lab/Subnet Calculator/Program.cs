using System;
using System.Net;
using System.Numerics;

class Program
{
    static void Main(string[] args)
    {
        if (args is not [var mainNetworkArg, .. var subnetDescs])
            throw new ArgumentException("Should specify main network and subnets");

        var mainNetwork = IPNetwork.Parse(mainNetworkArg);

        var subnets =
            from arg in subnetDescs
            let desc = SubnetDescription.Parse(arg)
            orderby desc.Size descending
            select desc;

        Calculate(mainNetwork, subnets.ToArray());
    }

    static void Calculate(IPNetwork mainNetwork, SubnetDescription[] subnets)
    {
        foreach (var s in subnets)
        {
            Console.WriteLine($"{s}");
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
        if (s.Split(':') is not [var name, var size])
            throw new FormatException($"Invalid subnetwork description: {s}");

        return new SubnetDescription(name, uint.Parse(size));
    }
}
