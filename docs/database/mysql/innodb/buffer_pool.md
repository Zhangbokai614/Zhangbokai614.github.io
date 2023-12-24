---
cover: /assets/images/mysql/0.png
icon: pen-to-square
date: 2023-04-30
category:
  - MySQL
tag:
  - Innodb
  - Buffer pool
star: true
sticky: true
---

# MySQL-Buffer pool

&emsp;&emsp;由于硬盘读写速度等问题，在一般的数据库中进行 **I/O** 操作是非常耗时的，MySQL 为了减少 I/O 操作的次数，使用了 **Buffer pool** 机制，通过它，MySQL 可以把**常用**的数据储存在**内存**中，这样下次操作相同的数据时直接从内存中读取即可，不需要再去硬盘中抽取数据而执行耗时的 I/O 操作

## 规则
&emsp;&emsp;MySQL 使用优化过的 **LRU**（Least Recently Used） 算法管理内存中的数据，管理数据的最小单位是 **page**，而一个 page 中有若干条数据，page 的大小由系统变量 **@@innodb_page_size** 来决定，默认为 **16KB**，存储相关的内容在本章节不再展开讨论

&emsp;&emsp;MySQL 中的 LRU 使用链表来实现，如 [图一](https://dev.mysql.com/doc/refman/8.0/en/innodb-buffer-pool.html) 所示，Buffer pool 分为 **New** 与 **Old** 两部分，它们使用 Midpoint 来分隔，其中 New 部分占大约 5/8 的空间 Old 占大约 3/8 的空间，图的右侧标注了数据的流向，新访问的 page 会储存到 New 中，不常使用的 page 会放到 Old 中，最后 Old 中的内容会被逐渐清出

&emsp;&emsp;要注意的是，与传统 LRU 算法不同，新读取的 page 不会立即插入 New 部分的 Head ，而是插入 Old 部分的 Head ，当这些 page 再次被使用时，才会被放到 New 部分的 Head ，这有效防止了某次不常用的大规模扫描把 New 部分整体替换掉，并且 MySQL 还通过 **@@innodb_old_blocks_time** 对 New 部分进行了保护，在 innodb_old_blocks_time 时间内，不论上述所说的大规模 page 被访问多少次，都不会进入 New 部分

![image.png](/assets/images/mysql/innodb/buffer-pool/1.png)

## 状态
&emsp;&emsp;通过变量 **@@innodb_buffer_pool_size** 可以查看 Buffer pool 的大小，单位是字节，把它除 1024（Bit -> KB） 再除 16 就是我们 Buffer pool 中可以缓存的 page 的大小
```sql
SELECT @@innodb_buffer_pool_size;

+---------------------------+
| @@innodb_buffer_pool_size |
+---------------------------+
|                 134217728 |
+---------------------------+
1 row in set (0.00 sec)
```
&nbsp;

&emsp;&emsp;通过 **SQL-2** 输出中的 **BUFFER POOL AND MEMORY** 部分，我们可以查看 Buffer pool 的状态
```sql
SHOW ENGINE INNODB STATUS;

----------------------
BUFFER POOL AND MEMORY
----------------------
Total large memory allocated 0
Dictionary memory allocated 604739
Buffer pool size   8192
Free buffers       1
Database pages     7914
Old database pages 2939
Modified db pages  0
Pending reads      0
Pending writes: LRU 0, flush list 0, single page 0
Pages made young 249762, not young 452654
0.02 youngs/s, 350.29 non-youngs/s
Pages read 15114, created 173, written 858
54.26 reads/s, 0.00 creates/s, 0.00 writes/s
Buffer pool hit rate 936 / 1000, young-making rate 0 / 1000 not 413 / 1000
Pages read ahead 51.97/s, evicted without access 0.12/s, Random read ahead 0.00/s
LRU len: 7914, unzip_LRU len: 0
I/O sum[135]:cur[0], unzip sum[0]:cur[0]
```
&nbsp;

&emsp;&emsp;**SQL-2 L8** 的 **Buffer pool size** 是分配给 Buffer pool 的总 page 大小（**@@innodb_buffer_pool_size / 1024 / 16**），对应的，Free buffers 属性就是空闲的 page 数量

&emsp;&emsp;我们可以调整 Buffer pool 的大小，但这要符合 **@@innodb_buffer_pool_instances** * **@@innodb_buffer_pool_chunk_size** | **@@innodb_buffer_pool_size** 的条件，如果不满足则会向上取整，直到 Buffer pool 等于两者的乘积或者成为倍数关系，**SQL-3** 展示了这种关系以及设置过程，另外适当设置（大小在几个 G 的情况下） **@@innodb_buffer_pool_instances** 数量可以提高 Buffer pool 在并发使用时的效率，详见官方文档 [Configuring Multiple Buffer Pool Instances](https://dev.mysql.com/doc/refman/8.0/en/innodb-multiple-buffer-pools.html)
```sql
SELECT @@innodb_buffer_pool_instances;

+--------------------------------+
| @@innodb_buffer_pool_instances |
+--------------------------------+
|                              1 |
+--------------------------------+
1 row in set (0.56 sec)


SELECT @@innodb_buffer_pool_chunk_size/1024/1024/1024;
+------------------------------------------------+
| @@innodb_buffer_pool_chunk_size/1024/1024/1024 |
+------------------------------------------------+
|                                 0.125000000000 |
+------------------------------------------------+
1 row in set (0.00 sec)


SELECT @@innodb_buffer_pool_size/1024/1024/1024;
+------------------------------------------+
| @@innodb_buffer_pool_size/1024/1024/1024 |
+------------------------------------------+
|                           0.125000000000 |
+------------------------------------------+
1 row in set (0.00 sec)

---------------------------------------------------------
SET GLOBAL innodb_buffer_pool_size = 201326592; -- 0.125G * 1.5

SELECT @@innodb_buffer_pool_size/1024/1024/1024;
+------------------------------------------+
| @@innodb_buffer_pool_size/1024/1024/1024 |
+------------------------------------------+
|                           0.250000000000 |  -- 0.125G * 2
+------------------------------------------+
1 row in set (0.00 sec)

```
&nbsp;

&emsp;&emsp;**L10** 的 **Database pages** 为 Buffer pool 的 LRU 链表所占的总页面大小，**Old database pages** 为 Buffer pool 中 Old 部分的页面大小，默认在不变动 Midpoint 的情况下 **Old database pages / Database pages** = 3.7 （3/8），读者们可以一根据自己具体需求来进行设置
```sql
SELECT @@innodb_old_blocks_pct;

+-------------------------+
| @@innodb_old_blocks_pct |
+-------------------------+
|                      37 |
+-------------------------+
1 row in set (0.00 sec)
```
&nbsp;

&emsp;&emsp;**L16** 与 **L18**、**L20** 中的 /s 代表每秒平均的值，统计范围是从上次 SHOW ENGINE INNODB STATUS 到这次 SHOW ENGINE INNODB STATUS 之间

&emsp;&emsp;**youngs/s** 表示在作用时间内 Old 部分进入到 New 部分的每秒的平均数量，如果此参数过**低**可能有以下两种情况

1. 近期进行过大规模扫描，这种情况下大规模 page 会可能会占满 Old 部分，而这些大量扫描的 page 大概率不会常用到，所以导致 youngs/s 数值过低
2. 如果没有进行过大规模扫描但是 youngs/s 依然非常低，说明大部分 page 在被再次读取到之前就已经进入 Old 部分的尾部并且清除了，这时可以考虑**增加** Old 部分的大小，这样 page 在 Old 部分停留的时间就会更长，被再次访问的概率也就会更高。另外通过**降低** **@@innodb_old_blocks_time** 也可以增加 Old 部分中 page 被读取到 New 部分的概率

&emsp;&emsp;在 **SQL-5** 的演示中， **@@innodb_old_blocks_time** 默认为 1 秒，我们可以像设置其它变量那样设置它
```sql
SELECT @@innodb_old_blocks_time;
+--------------------------+
| @@innodb_old_blocks_time |
+--------------------------+
|                     1000 |
+--------------------------+
1 row in set (0.00 sec)


SET GLOBAL innodb_old_blocks_time = 1001;

SELECT @@innodb_old_blocks_time;
+--------------------------+
| @@innodb_old_blocks_time |
+--------------------------+
|                     1001 |
+--------------------------+
1 row in set (0.00 sec)
```
&nbsp;

&emsp;&emsp;non-youns/s 表示在作用时间内，page 平均每秒移动到 Old 部分的 page 数量，如果进行大量扫描之后没有看到较高的 non-youns/s，说明  **@@innodb_old_blocks_time** 较低，导致大量不常用数据进入到了 New 部分，所以应该考虑**增加** **@@innodb_old_blocks_time**

&emsp;&emsp;**L19** 的 **Buffer pool hit rate** 代表 Buffer pool 的命中率，**young-making rate** 是因为访问使 page **进入到 New** 部分的命中率，**not** 则是访问 page 之后**没有进入到 New** 部分的命中率，在 page 处于 New 部分前 1/4 或不满足 **@@innodb_old_blocks_time** 设定的时间时会发生这种情况并使 not 值发生变化

&emsp;&emsp;在实际使用中，我们需要结合 MySQL 所处服务器的情况以及具体业务来优化 Buffer pool，保证它的命中率，
其它参数具体说明可以参考官方文档 [InnoDB Buffer Pool Metrics](https://dev.mysql.com/doc/refman/8.0/en/innodb-buffer-pool.html)
