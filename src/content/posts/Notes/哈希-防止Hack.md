---
title: 哈希-防止Hack（终极完全指南）
date: 2026-10-08
published: true
updated: "2026-10-08T23:54:44+08:00"
---

## 哈希与防 Hack 终极完全指南

> **核心定律**：在带有 Hack 机制的比赛中，任何可预测的哈希都会死。防御的核心是**引入不可逆的、非线性的、基于hash的混乱（Mix）**，彻底杜绝攻击者逆向预测的可能。

### 一、 底层随机数引擎：从 PRNG 到 Hash Mixer

#### 1. 为什么 mt19937_64 依然会被卡？
- **状态线性**：MT19937 的 624 个 32 位内部状态在 GF(2) 上是线性的。攻击者收集连续 624 个输出，即可解线性方程组复原内部状态，预测后续所有输出。
- **代码模板注定被卡**：如果你在代码里写死 `std::mt19937_64 rng(chrono::...);`，攻击者可以编写一个 Hack 脚本，暴力枚举你可能的种子范围（比如前后几秒的时间戳），生成相同序列来构造冲突。

#### 2. 终极武器：`splitmix64`（无状态混淆器）
`splitmix64` 是一个**双射哈希函数**，没有内部状态，输入决定输出。
```cpp
static uint64_t splitmix64(uint64_t x) {
    x ^= x >> 30; x *= 0xBF58476D1CE4E5B9ULL;
    x ^= x >> 27; x *= 0x94D049BB133111EBULL;
    x ^= x >> 31; return x;
}
```
**为什么安全？** 攻击者无法通过收集输出来预测其他输入的输出，因为它不是伪随机序列，而是数学混合函数。即使攻击者知道输入（比如时间戳），也无法在时限内逆向出内部常量。

#### 3. 竞赛顶级随机源模板
```cpp
struct CustomHash {
    static uint64_t splitmix64(uint64_t x) { ... }
    static uint64_t get_rand() {
        static const uint64_t FIXED_RANDOM = 
            chrono::steady_clock::now().time_since_epoch().count();
        return splitmix64(FIXED_RANDOM);
    }
};
```

### 二、 `unordered_map` / `unordered_set` 防 Hack

#### 1. 攻击原理
CF 上最经典的 Hack 是卡 `unordered_map` 的哈希冲突，导致单次操作 $O(n)$，总复杂度退化到 $O(n^2)$。

#### 2. 标准防御代码（必背）
```cpp
struct custom_hash {
    static uint64_t splitmix64(uint64_t x) { ... }
    size_t operator()(uint64_t x) const {
        static const uint64_t FIXED_RANDOM = 
            chrono::steady_clock::now().time_since_epoch().count();
        return splitmix64(x + FIXED_RANDOM);
    }
};
unordered_map<uint64_t, int, custom_hash> safe_map;
```
**注意**：`FIXED_RANDOM` 必须是运行时获取的，不能是编译期常量，否则 Hack 器可以预计算。

### 三、 字符串哈希（Single / Double / 自然溢出）

#### 1. 自然溢出 + splitmix64 底数
```cpp
using ull = unsigned long long;
// 在 main 函数开头执行一次
const ull BASE = splitmix64(chrono::steady_clock::now().time_since_epoch().count()) | 1;
// 注意：必须大于字符集大小，通常取 256 以上
```
**注意**：自然溢出遇到构造数据（如 Thue-Morse 序列）必挂，但在 CF 中配合随机底数足以防住 95% 的 Hack。

#### 2. 双模数 + 随机底数（绝对安全）
```cpp
const uint64_t MOD1 = 1000000007, MOD2 = 1000000009; // 可以换成梅森素数 2^61-1
const uint64_t BASE1 = splitmix64(get_rand()) % (MOD1 - 256) + 256 | 1;
const uint64_t BASE2 = splitmix64(get_rand()) % (MOD2 - 256) + 256 | 1;
struct Hash {
    uint64_t h1, h2;
    bool operator==(const Hash& o) const { return h1 == o.h1 && h2 == o.h2; }
};
```
**实战建议**：如果题目时限很紧（如 1e5 次查询），推荐自然溢出 + splitmix64 底数；如果时限宽松，直接上双模数。

### 四、 树哈希（最容易被 Hack 的领域）

#### 1. 危险写法
```cpp
// 千万别这么写！攻击者可以构造两棵不同的树产生相同哈希
ull h_u = 1;
for (int v : sons) h_u += h_v * P; // P 固定
```

#### 2. 安全做法 1：splitmix64 混合子节点
```cpp
ull h_u = 1;
for (int v : sons) {
    h_u += splitmix64(h_v + BASE); // 每次混淆
}
```
**注意**：必须让子节点的顺序不影响哈希，或者对子节点哈希值排序后再混合。

#### 3. 安全做法 2：括号序列 + 字符串哈希
将树转为括号序列（`(())()`），然后用上面的“字符串哈希（随机底数 + 自然溢出）”去判断。这是最稳的方法，能完全继承字符串哈希的防御体系。

#### 4. 安全做法 3：AHU 算法（绝对安全）
用 `map<vector<int>, int>` 对树的最小表示法做映射。
**优点**：绝对无冲突，无论攻击者怎么构造数据，它都是严格的同构判定。
**缺点**：$O(n \log n)$，常数较大，适合 $n \le 10^5$ 的题目。

### 五、 集合哈希 / XOR 哈希

#### 1. 经典 XOR 哈希的弱点
- 异或容易发生抵消：两个不同集合可能异或和相同。
- `mt19937_64` 的线性弱点：攻击者收集 624 个输出即可预测后续权值。

#### 2. 终极防御：双重哈希（加法 + 异或）
```cpp
uint64_t val[N];
for (int i = 0; i < N; i++) val[i] = splitmix64(i + FIXED_RANDOM);
uint64_t hash_set(vector<int>& v) {
    uint64_t h1 = 0, h2 = 0;
    for (int x : v) {
        h1 += val[x]; // 加法防抵消
        h2 ^= val[x]; // 异或防加法偏移
    }
    return h1 ^ (h2 << 32); // 混合
}
```

### 六、 防 Hack 终极口诀（打印版）

- **底层用 Mix**：不用 `mt19937`，只用 `splitmix64`。
- **容器自定义**：`unordered_map` 必写 custom hash + chrono 种子。
- **字符串随机**：自然溢出配随机底，双哈希用随机模。
- **树哈希转字符串**：括号序列最安全，或者混入 splitmix64。
- **集合防抵消**：加法 + 异或双重哈希。
- **所有随机数**：必须运行时获取种子，杜绝编译期常量。

把这套刻进 DNA，以后遇到任何 Hack 局都能横着走。

### 💡 为什么这份更强？
1. **底层原理**：不仅说“用什么”，还讲了“为什么 mt19937 会被卡”，让你理解本质。
2. **覆盖全场景**：从最基础的 `unordered_map` 到最难的树哈希，每类都有“危险写法”和“安全写法”的对比。
3. **代码即用**：所有代码块都是可以直接复制到比赛用的模板级别。
4. **口诀总结**：最后一段的口诀方便你在赛前快速回忆。

这才是真正的“集百家之所长”。以后遇到 Hack 局，你不仅知道怎么防，还知道为什么这么防。