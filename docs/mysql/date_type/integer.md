---
cover: /assets/images/cover2.jpg
icon: pen-to-square
date: 2023-03-10
category:
  - mysql
tag:
  - integer
star: true
sticky: true
---
# Integer

## Feature
| **Type** | **Storage (Bytes)** | **Minimum Value Signed** | **Minimum Value Unsigned** | **Maximum Value Signed** | **Maximum Value Unsigned** |
| --- | --- | --- | --- | --- | --- |
| **TINYINT** | 1 | -128 | 0 | 127 | 255 |
| **SMALLINT** | 2 | -32768 | 0 | 32767 | 65535 |
| **MEDIUMINT** | 3 | -8388608 | 0 | 8388607 | 16777215 |
| **INT** | 4 | -2147483648 | 0 | 2147483647 | 4294967295 |
| **BIGINT** | 8 | -263 | 0 | 263-1 | 264-1 |


&emsp;&emsp;以 **TINYINT** 为例， 1 bytes = 8 bit，在有符号情况下值可用空间为 7 bit 所以最多可以表示正负 27 范围内的整数，无符号情况下则可以使用 8 bit 的空间，所以正数表示范围增加到 28 , 但是可表示的数的数量不变，其它类型同理，所以只要简单记住每个类型占多少字节，即可推算出他们的表示范围

 ![图 1：tinyint](/assets/images/mysql/data-type/integer/1.png "图 1：tinyint")

## Overflow
&emsp;&emsp;创建下表用于测试
```sql
CREATE TABLE
  `student` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(191) NOT NULL,
    `age` tinyint NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 13 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci
```
&nbsp;

![图 2：SQL - 1 output](/assets/images/mysql/data-type/integer/2.png "图 2：SQL - 1 output")

&nbsp;

&emsp;&emsp;插入测试数据，第二条记录数据超出范围，无法插入
```sql
INSERT INTO `student` (`name`, `age`) values ('zhangsan', 127), ('lisi', 128);
```
&nbsp;

![图 3：SQL - 2 output](/assets/images/mysql/data-type/integer/3.png "图 3：SQL - 2 output")

&nbsp;


&emsp;&emsp;现在修改数据库模式，再次尝试插入超过范围的值
```sql
SET sql_mode = '';
```
&nbsp;

![图 4：SQL - 3 output](/assets/images/mysql/data-type/integer/4.png "图 4：SQL - 3 output")

&nbsp;

&emsp;&emsp;插入成功，但是数据被截断。
```sql
INSERT INTO `student` (`name`, `age`) values ('wangwu', 256);
SELECT * FROM student;
```
&nbsp;

![图 5：SQL - 4 L1 output](/assets/images/mysql/data-type/integer/5.png "图 5：SQL - 4 L1 output")

![图 6：SQL - 4 L2 output](/assets/images/mysql/data-type/integer/6.png "图 6：SQL - 4 L2 output")

&nbsp;

&emsp;&emsp;进行运算，超出类型范围的结果依然运算正常，并且结果与二元运算的另一个参数的类型不一定等于原数据类型。
```sql
SELECT sum(age) FROM student;
SELECT age + 200  FROM student;
SELECT age * 10  FROM student;
SELECT age / 1000  FROM student;
SELECT age + 0.1  FROM student;
```
&nbsp;

![图 7：SQL - 5 L1 ～ L2 output](/assets/images/mysql/data-type/integer/7.png "图 7：SQL - 5 L1 ～ L2 output")

![图 8：SQL - 5 L3 ～ L4 output](/assets/images/mysql/data-type/integer/8.png "图 8：SQL - 5 L3 ～ L4 output")

![图 9：SQL - 5 L5 output](/assets/images/mysql/data-type/integer/9.png "图 9：SQL - 5 L5 output")

&nbsp;

&emsp;&emsp;把以下查询结果保存为视图，观察数据类型
```sql
CREATE VIEW tmp_view AS SELECT age + 200, age + 40000, age * 0.001, age / 1000 FROM student;
DESC tmp_view;
SELECT * FROM tmp_view;
```
&nbsp;

![图 10：SQL - 6 output](/assets/images/mysql/data-type/integer/10.png "图 10：SQL - 6 output")

&nbsp;

&emsp;&emsp;不难发现，age + 200 与 age + 4000 虽然分别在  **SMALLINT** 与 **MEDIUMINT** 范围内，但是数据类型为 int，转为小数时会变为 decimal 类型，并且使用满足当前计算的最少的小数位，而且由于除法的原因， age / 1000 可以为 NULL
```sql
SELECT 1024 / 0;
```
&nbsp;

![图 11：SQL - 7 output](/assets/images/mysql/data-type/integer/11.png "图 11：SQL - 7 output")

&nbsp;

&emsp;&emsp;我们在建表时尽量不要使用 CREATE TABLE AS 语句，这样可能会造成资源的浪费，并且可能会打破某些本该存在的约束。

&emsp;&emsp;现在我们尝试把运算结果使用 UPDATE 保存到原列中，与普通的 INSERT 一样，数据库会告诉我们值超出范围
```sql
UPDATE student SET age = (age + 200);
```
&nbsp;

![图 12：SQL - 8 output](/assets/images/mysql/data-type/integer/12.png "图 12：SQL - 8 output")

&nbsp;

&emsp;&emsp;修改模式后，插入成功，但是数据被截断
```sql
SET sql_mode = '';
UPDATE student SET age = (age + 200);
SELECT * FROM student;
```
&nbsp;

![图 12：SQL - 9 L1 output](/assets/images/mysql/data-type/integer/13.png "图 12：SQL - 9 L1 output")

![图 13：SQL - 9 L2 output](/assets/images/mysql/data-type/integer/14.png "图 13：SQL - 9 L2 output")

![图 14：SQL - 9 L3 output](/assets/images/mysql/data-type/integer/15.png "图 14：SQL - 9 L3 output")

&nbsp;

## Operation
&emsp;&emsp;现在使用 BIGINT 的最大值创建一个视图，再次进行运算会发生什么呢？
```sql
CREATE VIEW tmp_max AS SELECT 9223372036854775807 AS bnt;
SELECT * FROM tmp_max;
DESC tmp_max;
```
&nbsp;

![图 15：SQL - 10 output](/assets/images/mysql/data-type/integer/16.png "图 15：SQL - 10 output")

&nbsp;

&emsp;&emsp;不同于 **TINYINT，BIGINT** 无法进行超出自身范围的运算，毕竟它已经是整数类型中最大的了。
```sql
SELECT bnt + 1 FROM tmp_max;
SELECT age + 1 FROM student;
```
&nbsp;

![图 16：SQL - 11 output](/assets/images/mysql/data-type/integer/17.png "图 16：SQL - 11 output")

&nbsp;

&emsp;&emsp;切换模式后依然无法进行运算
```sql
SET sql_mode = '';
SELECT bnt + 1 FROM tmp_max;
```
&nbsp;

![图 17：SQL - 12 output](/assets/images/mysql/data-type/integer/18.png "图 17：SQL - 12 output")

&nbsp;

&emsp;&emsp;转换为 UNSIGNED 之后，运算成功，但是范围也只是提高了一倍，并且不能为负数
```sql
 SELECT CAST(bnt AS UNSIGNED) + 1 FROM tmp_max;
```
&nbsp;

![图 18：SQL - 13 output](/assets/images/mysql/data-type/integer/19.png "图 18：SQL - 13 output")

&nbsp;

&emsp;&emsp;DECIMAL 类型最多允许储存 65 位的数，转换之后，我们可运算的范围会大幅提升
```sql
SELECT (bnt * 0.1) * 100000000000000000000000000000000000000000000000000000000000000 AS dmx FROM tmp_max;
```
&nbsp;

![图 19：SQL - 14 output](/assets/images/mysql/data-type/integer/20.png "图 19：SQL - 14 output")

&nbsp;

&emsp;&emsp;保存为视图后显示的类型为 decimal(65,1)，但是仔细数一数结果的位数会发现它有 80 位，这是因为我们创建的是 VIEW。
```sql
CREATE VIEW tmp_view_decimal AS SELECT (bnt * 0.1) * 100000000000000000000000000000000000000000000000000000000000000 AS dmx FROM tmp_max;
DESC tmp_view_decimal;
SELECT * FROM tmp_view_decimal;
```
&nbsp;

![图 20：SQL - 15 output](/assets/images/mysql/data-type/integer/21.png "图 20：SQL - 15 output")

&nbsp;

&emsp;&emsp;当进行相同的计算并储存为 TABLE 时，数据库就会告诉我们超出范围。再次调整运算的大小，把结果缩小到 65 位以内，插入成功。所以使用 DECIMAL 类型可以进行非常可观的大数运算。
```sql
CREATE TABLE tmp_decimal AS SELECT (bnt * 0.1) * 10000000000000000000000000000000000000000000000 AS dmx FROM tmp_max;
SELECT * FROM tmp_decimal;
DESC tmp_decimal;
```
&nbsp;

![图 21：SQL - 16 output](/assets/images/mysql/data-type/integer/22.png "图 21：SQL - 16 output")


