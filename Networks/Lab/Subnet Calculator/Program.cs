// Console.WriteLine(string.Join(", ", args));

// #r "System.CommandLine"

using System;
using System.Net;

var main = IPNetwork.Parse(args[0]);

var subnets =
    from arg in args[1..]
    let desc = SubnetDescription.Parse(arg)
    orderby desc.Size descending
    select desc;

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

// class Program
// {
//     static void Main(string[] args)
//     {
//         switch (args)
//         {
//             case [var mainNetwork, var subnets]:
//                 return Calculate(mainNetwork, subnets);
//             default:
//                 Console.Error
//         }
//     }

//     static void Calculate
// }

internal record struct SubnetDescription(string Name, int Size)
{
    // internal int bytesNeeded() => 

    internal static int closestPow2(int i)
    {
        var log = Math.Log2(i);
        return (int)Math.Round(log, MidpointRounding.ToPositiveInfinity);
    }

    internal const int BITS_PER_IPV4_ADDRESS = 32;

    public int PrefixLength
    {
        get => BITS_PER_IPV4_ADDRESS - closestPow2(Size + 2);
    }

    public static SubnetDescription Parse(string s)
    {
        // var pair = s.Split(':');
        return s.Split(':') switch
        {
            [string name, string size] =>
                new SubnetDescription(name, int.Parse(size)),
            _ =>
                throw new FormatException($"Invalid subnetwork description: {s}"),
        };

        // if (pair.Length != 2)
    }
}
