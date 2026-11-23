using System.Collections;
using System.Collections.Specialized;
using System.Net;
using System.Net.NetworkInformation;
using System.Numerics;
using System.Text.Json;
using System.Text.Json.Serialization;

// using LabeledNetwork = (string Name, System.Net.IPNetwork Network);

// class DomainSpecificNames : JsonNamingPolicy
// {
//     public override string ConvertName(string name)
//     {
//         if (name == "Value")
//     }
// }

class IPNetworkToString : JsonConverter<IPNetwork>
{
    public override IPNetwork Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => IPNetwork.Parse(reader.GetString()!);

    public override void Write(Utf8JsonWriter writer, IPNetwork value, JsonSerializerOptions options) =>
        writer.WriteStringValue(value.ToString());
}


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

        Calculate(mainNetwork, new Queue<SubnetDescription>(subnets));
    }

    static readonly JsonSerializerOptions jsonOpts = new()
    {
        WriteIndented = true
    };

    static void Calculate(IPNetwork mainNetwork, Queue<SubnetDescription> subnets)
    {
        foreach (var s in subnets)
        {
            Console.WriteLine($"{s}");
        }

        if (!subnets.Any())
            throw new ArgumentException("No subnetworks specified");

        // mainNetwork.PrefixLength

        // var root = new LabeledNetwork("root", mainNetwork);
        // string[] root = ["root", mainNetwork.ToString()];

        // var networkTree = new BinaryTree<string[]?> // <LabeledNetwork?>
        // {
        //     Value = root
        // };

        var networkTree = new SubnetBinaryTree
        {
            Label = "root",
            Address = mainNetwork,
        };

        // var cursor = networkTree;

        var todo = new Queue<SubnetBinaryTree>();

        todo.Enqueue(networkTree);

        var cur = subnets.Dequeue();

        // if (cur.PrefixLength == mainNetwork.PrefixLength)

        // foreach (var subnet in subnets)
        // {
        //     // if (subnet.PrefixLength == todo.TryPeek)
        // }

        while (todo.TryDequeue(out var cursor))
        {
            var bytes = cursor.Address.BaseAddress.GetAddressBytes();

            // Console.WriteLine(string.Join(", ", new BitArray(bytes)));

            // new Span();

            // cursor.Address.BaseAddress.TryWriteBytes(bytes, out var _);

            // Console.WriteLine(BitConverter.ToInt32(leftAddress));

            // BitConverter.IsLittleEndian = false;

            // new BitConverter();

            // BitConverter.TryWriteBytes()

            // var left = new SubnetBinaryTree {
            //     Label = "unused",
            //     Address = 
            // }
            // todo.Enqueue(new SubnetBinaryTree)
        }

        // new JsonSerializerOptions{  }

        // var repr = JsonSerializer.Serialize<BinaryTree<LabeledNetwork?>>(networkTree);
        // Console.WriteLine(typeof(BinaryTree<LabeledNetwork?>));

        var repr = JsonSerializer.Serialize(
            networkTree,
            // typeof(BinaryTree<LabeledNetwork?>),
            // JsonContext.Default
            jsonOpts
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

// record LabeledNetwork(string Label, IPNetwork Network);

// class BinaryTree<T>
// {
//     [JsonInclude]
//     public required T Value;

//     [JsonInclude]
//     public BinaryTree<T>? Left = null, Right = null;

//     // public BinaryTree(T value) => Value = value;
// }

internal class SubnetBinaryTree
{
    [JsonInclude]
    public required string Label;

    [JsonInclude]
    [JsonConverter(typeof(IPNetworkToString))]
    public required IPNetwork Address;

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    SubnetBinaryTree? Left, Right;
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
