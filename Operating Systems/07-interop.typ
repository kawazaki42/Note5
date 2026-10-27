#title[механизмы межпроцессного взаимодействия]

#outline()

aka ipc

= основные модели ipc

== модель общей памяти

требуется синхронизация

== модель передачи сообщений

= основные механизмы ipc

== shared memory

```c
fd = shm_open("/myshm", ...);
ptr = mmap(NULL, size, ...);

// это отображение файла или не файла
hMap = CreateFileMapping(...);
hMap = OpenFileMapping(...);
ptr = MapViewOfFile(hMap, ...);
```

синхру сами делаем дополнительно

== anonymous pipes (анонимные каналы)

```sh |```

== named pipes

mkfifo (спец. файл)

== sockets (локальные сокеты)

иногда инетовский

```c AF_UNIX, AF_INET```

== message queues

unix-only

структурированные данные (заданные внутри приложения)

mtype

встроенная синхронизация

== mailslots

windows-only

ларпит message queue

полудуплекс

нинужен

== rpc

удаленный вызов процедур

windows-only

нужон rpc-клиент (библеотека)


язык idl

= сигналы

unix-only

похоже на прерывания

асинхронный

sigterm например

^C

== примеры

- sigint (^C) - выключить выполняемую команду в консоли
- sigsegv - ошибка памяти
- sigkill - жесткое завершение
- sigterm - мягкое завершение
- sigchld - завершение дочернего процесса

виндовс: ```c SetConsoleCtrlHandler```
