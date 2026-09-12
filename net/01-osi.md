OSIRM

open system interaction reference model

эталонная модель взаимодействия открытых систем (ЭМВОС)

4-уровневая модель DOD
- выйграла
- более практическая

department of defense

- 7\. Application (telnet, ssh, http, dns?, dhcp?)
   - 0.0.0.0
   - кричать всем: 255.255.255.255
   - id транзакции
- 6\. Presentation (шифрование, сжатие)
- 5\. Session
- 4\. Transport (tcp)
- 3\. Network (ip)
  - маршрутизаторы
  - коммутаторы (свичи)
- 2\. Data Link (канальный уровень)
  - LLC (logical link control; управление логическими связями)
    - более высокий подуровень
    - опциональный
    - для коммутаторов
  - MAC (media access control; управление доступа к среде)
  - коммутаторы (свичи)
- 1\. Physical
  - ЦАП и АЦП
  - модемы
  - хабы (концентраторы)
  - мосты

GRE-туннель

TLS (transport-layer security)

просто канал не путать с data link

переход по уровням как по этажам

но при этом равные уровни разных компьютеров работают друг с другом

(горизонтальное (виртуальное) взаимодействие)

заголовки с метаданными складываются с разных уровней

при этом граница между данными и метаданными разная

I-triple-E

IEEE 802 - 1, 2 уровни

IEEE 802.3 - ethernet

IEEE 802.11ac - wifi

IEEE 802.16 - bluetooth

802.2 - LLC

802.1d - stp - ... tree protocol

802.1q - 

RFC (reference for comment): ip, tcp, udp, tls, gre (все что выше 2го)

dns: port 53

ICANN, IANA

иерархия адресных пространств

lldp
