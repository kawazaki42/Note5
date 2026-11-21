using System.Net;
using System.Numerics;
using System.Text.Json;
using System.Text.Json.Serialization;

using LabeledNetwork = (string Name, System.Net.IPNetwork Network);

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

        Calculate(mainNetwork, [.. subnets]);
    }

    static void Calculate(IPNetwork mainNetwork, SubnetDescription[] subnets)
    {
        foreach (var s in subnets)
        {
            Console.WriteLine($"{s}");
        }

        if (!subnets.Any())
            throw new ArgumentException("No subnetworks specified");

        // mainNetwork.PrefixLength

        LabeledNetwork root = ("root", mainNetwork);

        var networkTree = new BinaryTree<LabeledNetwork?>
        {
            Value = root
        };

        // new JsonSerializerOptions{  }

        // var repr = JsonSerializer.Serialize<BinaryTree<LabeledNetwork?>>(networkTree);
        // Console.WriteLine(typeof(BinaryTree<LabeledNetwork?>));

        var repr = JsonSerializer.Serialize(
            networkTree
            // typeof(BinaryTree<LabeledNetwork?>),
            // JsonContext.Default
        );

        // Console.WriteLine()

        Console.WriteLine(repr);
    }
}

// [JsonSerializable(typeof(SubnetDescription))]
// [JsonSerializable(typeof(BinaryTree<LabeledNetwork?>))]
// [JsonSerializable(typeof(LabeledNetwork))]
// [JsonSerializable(typeof(IPNetwork))]
// partial class JsonContext : JsonSerializerContext;

class BinaryTree<T>
{
    [JsonInclude]
    public required T Value;

    [JsonInclude]
    public BinaryTree<T>? Left = null, Right = null;

    // public BinaryTree(T value) => Value = value;
}



internal record struct SubnetDescription(string Name, uint Size)
{
    const int RESERVED_ADDRESS_COUNT = 2;

    private readonly uint AddressesToReserve() => Size + RESERVED_ADDRESS_COUNT;

    uint MaxIndexInSubnet() => AddressesToReserve() - 1;

    public int PrefixLength
    {
        get => BitOperations.LeadingZeroCount(MaxIndexInSubnet());
    }

    public static SubnetDescription Parse(string s)
    {
        if (s.Split(':') is not [var name, var size])
            throw new FormatException($"Invalid subnetwork description: {s}");

        return new SubnetDescription(name, uint.Parse(size));
    }
}
