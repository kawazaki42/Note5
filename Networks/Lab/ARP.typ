// - Hardware Type: 16 bit
//   - всегда 0x0001 (ethernet)
// - Protocol Type: 16 bit
//   - технология сетевого уровня
//   - 0x0800 (IPv4)
//   - для ipv6 не попрет!
//     - 0x86DD
// - Hardware Address Length: 8 bit
//   - длина шизического адреса
//   - ethernet: 0x06 (48 бит)
// - Protocol Address Length: 8 bit
//   - 0x04 (длина адреса ipv4)
// - Operation Code: 16 bit
//   - request: 0x0001
//   - reply: 0x0002
// - Sender Hardware Address: 48 bit
//   - mac адрес отправителя (source address)
// - Sender Protocol Address: 32 bit
// - Target Hardware Address: 48 bit
// - Target Protocol Address: 32 bit

= 1

- 0x0001 0800
- 0x06 04 0001
- 0x23:45:AB:4F:67:CD
- 125.45.23.12
- 0x00:00:00:00:00:00
- 125.11.78.10

= 2

- 0x0001 0800
- 0x06 04 0002
- 0xAA:BB:A2:4F:67:CD
- 125.11.78.10
- 0x23:45:AB:4F:67:CD
- 125.45.23.12

= 3

- преамбула
- 0xFF:FF:FF:FF:FF:FF
- 0x23:45:AB:4F:67:CD
- 0x0806
- 0x0001 0800
- 0x06 04 0002
- 0xAA:BB:A2:4F:67:CD
- 125.11.78.10
- 0x00:00:00:00:00:00
- 125.45.23.12
- crc

= 4

- преамбула
- 0x23:45:AB:4F:67:CD
- 0xAA:BB:A2:4F:67:CD
- 0x0806
- 0x0001 0800
- 0x06 04 0002
- 0xAA:BB:A2:4F:67:CD
- 125.11.78.10
- 0x23:45:AB:4F:67:CD
- 125.45.23.12
- crc

= 5
