---
title: 一些新的Trick
date: 2026-10-31
published: true
updated: "2026-10-31T20:54:25+08:00"
---
### 1.8 Bitmask 集合枚举

默认 𝑛≤30，用 `int` 的低 𝑛 位表示集合；需要更大位宽时把集合变量统一改为 `i64 / u64`。

#### 1.8.1 `<bit>` 与 GNU builtin

C++20 的 `<bit>` 接口只接受无符号整数。默认 `int` 位宽时把参数转为 `unsigned`；使用 `u64` 时直接传入 `u64`，不再区分 builtin 的普通版与 `ll` 版。

- `std::popcount((unsigned)x)` 对应 `__builtin_popcount(x)`；
- `std::countr_zero((unsigned)x)` 对应 `__builtin_ctz(x)`；
- `std::countl_zero((unsigned)x)` 对应 `__builtin_clz(x)`；
- `std::bit_width((unsigned)x) - 1` 对应 `__lg(x)`，要求 𝑥>0；
- `std::has_single_bit((unsigned)x)` 判断是否为 2 的幂；
- `std::bit_floor((unsigned)x)` 和 `std::bit_ceil((unsigned)x)` 分别求不超过、 不小于 𝑥 的 2 的幂。

---

#### 1.8.5 集合二分

枚举有序二分 (𝐴,𝐵)：

```cpp
for (int A = (S - 1) & S; A; A = (A - 1) & S) {
    int B = S ^ A;
}
```

无序二分去重：固定 𝑆 的最低位元素属于 𝐴。

```cpp
int bit = S & -S;

for (int A = (S - 1) & S; A; A = (A - 1) & S) {
    if (!(A & bit))
        continue;

    int B = S ^ A;
}
```

---

#### 1.8.4 枚举元素

```cpp
for (int T = S; T; T &= T - 1) {
    int i = std::countr_zero((unsigned)T);
}
```

---

#### 1.8.6 超集 / 不相交集合

枚举与 𝑆 不相交的所有非空集合：

```cpp
int rest = ALL ^ S;

for (int T = rest; T; T = (T - 1) & rest) {
}
```

枚举 𝑆 的所有超集（包含 𝑆 和 `ALL`）：

```cpp
for (int T = S;; T = (T + 1) | S) {
    // T ⊇ S
    if (T == ALL)
        break;
}
```

---

#### 1.8.7 固定 popcount（Gosper）


```cpp
if (k == 0) {
    int S = 0;  // 唯一状态
} else {
    for (int S = (1LL << k) - 1; S < 1LL << n;) {
        // popcount(S) == k

        int low = S & -S;
        int nxt = S + low;
        if (nxt >= 1LL << n)
            break;

        S = nxt | (((nxt ^ S) >> 2) / low);
    }
}
```

复杂度为 𝑂((𝑛𝑘))。

---

## Intro.

### Prob. A

求 $S = \sum_{i=1}^{n} \sum_{j=1}^{n} \min(a_i, b_j)$ 的值。

### Prob. B

求 $S = \sum_{i=1}^{n} \sum_{j=1}^{n} |a_i - a_j|$ 的值。

---

## Sol.

### Prob. A

显然我们直接求比较难求，但是我们注意到这样的一个数学性质，即 $\min(x,y) = \frac{x + y - |x - y|}{2}$。我们就可以把这个最值求和问题转化为绝对值求和（形如 *Intro. Prob. B*）的问题。

同理，如果我们在这里求的是 $S = \sum_{i=1}^{n} \sum_{j=1}^{n} \max(a_i, b_j)$，我们根据 $\max(x,y) = \frac{x + y + |x - y|}{2}$，也能转化为相似的形式。

### Prob. B

一个办法是直接暴力 $\mathcal{O}(n^2)$ 计算，但是对于比较大的 $n$ 是肯定会超时的。

所以我们不妨利用数学性质：把数字 $a$ 排序，然后 $\mathcal{O}(n)$ 计算 $(i - 1) \times a_i - \sum_{j=1}^{i-1} a_j$ 的总和即可。时间复杂度为 $\mathcal{O}(n \log n)$（排序的时间复杂度），如果范围较小可以使用桶来优化到 $\mathcal{O}(n)$。

