---
title: 2026“钉耙编程”中国大学生算法设计暑期联赛（2）
tags:
  - 杭电多校
  - HDU
published: true
---
### 1001 xyz 问题

### Problem Description

河灵和胖胖龙正在玩一款逻辑推理类游戏。

游戏桌上摆放着 $n$ 张数字牌 $x_1, x_2, \dots, x_n$，其中 $x_i$ 表示第 $i$ 张数字牌上的数字，每张数字牌上只能填写数字 $0$ 或 $1$。

桌上还摆放着 $m$ 张运算牌 $op_1, op_2, \dots, op_m$，其中 $op_j$ 表示第 $j$ 张运算牌上的运算符，每张运算牌上只能填写以下三种运算符之一：
- `&`：按位与。
- `|`：按位或。
- `^`：按位异或。

现在，胖胖龙向河灵发起了挑战。

他给出了 $k$ 个条件，其中每个条件都包含四个整数 $i, j, y, z$ ($1 \le i \le n$, $1 \le j \le m$, $0 \le y, z \le 1$)，表示河灵的填写结果需要满足等式 $x_i \text{ op}_j \ y = z$。

请你帮帮河灵，为每张数字牌填写 $0$ 或 $1$，并为每张运算牌填写 `&`, `|`, `^` 的其中一种，使得填写方案满足胖胖龙给出的所有条件。或判断不存在满足条件的填写方案。

### Input

每个测试点中包含多组测试数据。输入的第一行包含一个正整数 $T$ ($1 \le T \le 5 \times 10^4$)，表示数据组数。对于每组测试数据：

第一行三个正整数 $n, m, k$ ($1 \le n, m, k \le 3 \times 10^5$)，分别表示数字牌个数、运算牌个数以及条件个数。

接下来 $k$ 行，每行四个整数 $i, j, y, z$ ($1 \le i \le n$, $1 \le j \le m$, $0 \le y, z \le 1$)，表示河灵的填写结果需要满足等式 $x_i \text{ op}_j \ y = z$。

一张数字牌或运算牌可以不出现在任何条件中；同一张数字牌或运算牌可能同时出现在多个条件中。

保证所有测试数据中 $\sum n$、$\sum m$ 与 $\sum k$ 均不超过 $2 \times 10^6$。

### Output

对于每组测试数据：若存在满足条件的填写方案，输出的第一行包含一个字符串 `YES`。

第二行输出一个长度为 $n$ 的 01 串，其中第 $i$ 个字符表示第 $i$ 张数字牌上的数字 $x_i$。

第三行输出一个长度为 $m$ 的字符串，其中第 $j$ 个字符表示第 $j$ 张运算牌上的运算符 $op_j$，字符只能是 `&`, `|`, `^` 的其中一种。

若存在多种满足条件的填写方案，输出任意一种即可。

若不存在满足条件的填写方案，输出一行一个字符串 `NO`。

### Sample Input

```txt
2
3 2 4
1 1 0 0
2 1 1 1
2 2 0 1
3 2 1 0
1 1 2
1 1 0 0
1 1 0 1
```

### Sample Output

```txt
YES
011
&^
NO
```

### Solution

2-SAT 神秘编码题目，甚至这个 2-SAT 编码比 adhoc 还 adhoc。

题目看起来是一个很标准的逻辑限制：

$$ 
x_i\ op_j\ y = z 
$$

其中 $x_i$ 是 $0/1$，这部分天然是布尔变量。真正恶心的是 $op_j$，因为它有三种取值：`&|^`

如果朴素地开三个变量：

```txt
a: op 是 &
b: op 是 |
c: op 是 ^
```

那我们很容易写出“最多选一个”：

```txt
a -> !b, a -> !c
b -> !a, b -> !c
c -> !a, c -> !b
```

但是“三个里面至少选一个”是：

$$
a \lor b \lor c
$$

这是三元子句，不是 2-SAT。

所以这个方向看起来很自然，但是最后会卡在一个非常别扭的地方：  
**你排除了所有不合法的，却没有保证它一定选了一个合法的。**

关键就在于重新编码运算符。

我们用两个布尔变量 $P,Q$ 表示一个运算符：

```txt
P Q   op
0 0   &
0 1   |
1 1   ^
1 0   禁用
```

这个编码很神秘，但妙就妙在：三个合法状态不是随便摆的。

它有两个非常好用的性质：

```txt
Q = 0 时，只可能是 &
Q = 1 时，可能是 | 或 ^
P = 1 且 Q = 1 时，是 ^
P = 0 且 Q = 0 时，是 &
```

唯一非法状态是：

```txt
P=1,Q=0
```

所以全局加：

$$ 
\neg P \lor Q 
$$

建边：

```cpp
add(p[j], q[j]);
add(nq[j], np[j]);
```

这一步相当于把“三选一”硬塞进了两个变量里。

接下来对每个限制分类讨论。

设：

```txt
X = x_i
P = p_j
Q = q_j
```

#### 1. y=0,z=0

也就是：

$$
X\ op\ 0 = 0
$$

真值表：

```txt
X=0: 0&0=0, 0|0=0, 0^0=0   全部可以
X=1: 1&0=0, 1|0=1, 1^0=1   只能 &
```

所以唯一不合法的情况是：

```txt
X=1 且 op 不是 &
```

在这个神秘编码里，`op 不是 &` 等价于：

```txt
Q=1
```

因为 `&` 是 `00`，另外两个合法运算符都是 `Q=1`。

所以禁止：

$$ 
X \land Q
$$

转成：

$$
\neg X \lor \neg Q
$$

建边：

```cpp
add(x[u], nq[v]);
add(q[v], nx[u]);
```

#### 2. y=0,z=1

也就是：

$$ 
X\ op\ 0 = 1
$$

真值表：

```txt
X=0: 0&0=0, 0|0=0, 0^0=0   全部不行
X=1: 1&0=0, 1|0=1, 1^0=1   只能 | 或 ^
```

所以只有一种合法情况：

```txt
X=1 且 op 不是 &
```

而 `op 不是 &` 仍然等价于：

```txt
Q=1
```

所以直接强制：

$$ 
X,\quad Q
$$

建边：

```cpp
add(nx[u], x[u]);
add(nq[v], q[v]);
```

#### 3. y=1,z=0

也就是：

$$ 
X\ op\ 1 = 0
$$

真值表：

```txt
X=0: 0&1=0, 0|1=1, 0^1=1   只能 &
X=1: 1&1=1, 1|1=1, 1^1=0   只能 ^
```

所以：

```txt
X=0 时，op 必须是 &
X=1 时，op 必须是 ^
```

根据编码：

```txt
& = 00
^ = 11
```

所以这一下变成了非常舒服的：

$$ 
P=X,\quad Q=X
$$

这里就是这个编码最 adhoc 的地方。  
如果 `&` 和 `^` 没有放在 `00` 和 `11`，这一类条件就会变得非常难看。

建边就是两个等价关系：

```cpp
// P == X
add(x[u], p[v]);
add(p[v], x[u]);
add(nx[u], np[v]);
add(np[v], nx[u]);

// Q == X
add(x[u], q[v]);
add(q[v], x[u]);
add(nx[u], nq[v]);
add(nq[v], nx[u]);
```

#### 4. y=1,z=1

也就是：

$$ 
X\ op\ 1 = 1
$$

真值表：

```txt
X=0: 0&1=0, 0|1=1, 0^1=1   不能 &
X=1: 1&1=1, 1|1=1, 1^1=0   不能 ^
```

非法情况是：

```txt
X=0 且 op=&
X=1 且 op=^
```

编码后：

```txt
op=&  是 P=0,Q=0
op=^  是 P=1,Q=1
```

看起来会出现三元限制：

```txt
X=0 且 P=0 且 Q=0
X=1 且 P=1 且 Q=1
```

但是因为我们已经有全局合法编码，所以可以压成二元子句：

- 禁止 `X=0 且 op=&`

由于合法状态里，`Q=0` 只可能是 `&`，所以禁止：

```txt
X=0 且 Q=0
```

也就是：

$$ 
X \lor Q
$$

- 禁止 `X=1 且 op=^`

由于 `^` 是 `P=1,Q=1`，并且非法状态 `10` 已经被禁掉，所以 `P=1` 时合法状态只能是 `^`，所以禁止：

```txt
X=1 且 P=1
```

也就是：

$$ 
\neg X \lor \neg P
$$

建边：

```cpp
add(nx[u], q[v]);
add(nq[v], x[u]);

add(x[u], np[v]);
add(p[v], nx[u]);
```

于是完整编码表就是：

```txt
P Q   op
0 0   &
0 1   |
1 1   ^
1 0   禁用
```

完整条件表：

| y   | z   | 限制                   |
| --- | --- | -------------------- |
| 0   | 0   | `!X \| !Q`           |
| 0   | 1   | `X && Q`             |
| 1   | 0   | `P == X \|\| Q == X` |
| 1   | 1   | `X \| Q && !X \| !P` |

这题的重点不在 Tarjan，而在这个编码。  

Tarjan 只是收尾，编码才是真正的构造。

最后跑 SCC。

如果变量和它的反变量在同一个 SCC 中，无解：

```cpp
scc[x[i]] == scc[nx[i]]
scc[p[j]] == scc[np[j]]
scc[q[j]] == scc[nq[j]]
```

否则有解。

取值时注意 SCC 编号方向。对于当前这种 Tarjan 写法，应该用：

```cpp
value = scc[var] < scc[not_var]
```

`P=1,Q=0` 已经被全局限制禁掉，所以不会出现。

复杂度：$O(n+m+k)$

### Solution(STD)

**我愿称之为 2-SAT 分类降维**

竟然可以根据是否出现过 $(y, z) = (1, 0)$ 分别分为两类然后

- 出现过：排除 `|` 操作
- 未出现：用 `|` 代替 `^`

至此，2-SAT 每一个候选集合都 $\le 2$ 了，可以直接建图。

### Code

```cpp
#include<bits/stdc++.h>
using namespace std;

const int N = 3e5 + 5;

int n, m, k;

// p q
// 0 0 and
// 0 1 or
// 1 1 xor
// 1 0 禁用  即 !p | q : p->q and !q->!p
int x[N], nx[N], p[N], q[N], np[N], nq[N];
int tot;
vector<int> e[N*6];
int dfn[N*6], scc[N*6], sc, stk[N*6], tp, low[N*6];
int dfncnt, ins[N*6];

void tarjan(int u) {
    dfn[u] = low[u] = ++dfncnt;
    stk[++tp] = u; ins[u] = 1;
    for(auto v:e[u]) {
        if(!dfn[v]) {
            tarjan(v);
            low[u] = min(low[u], low[v]);
        } else if(ins[v]) {
            low[u] = min(low[u], dfn[v]);
        }
    }
    if (low[u] == dfn[u]) {
        ++sc;
        do {
            int u = stk[tp];
            scc[u] = sc;
            ins[u] = 0; 
        }while(stk[tp--]!=u);
    }
}

void add(int u,int v) {
    e[u].push_back(v);
}

void solve() {
    cin >> n >> m >> k;
    sc = dfncnt = tp = tot = 0;
    for (int i = 1; i <= n; i++) {
        x[i] = ++tot;
        nx[i] = ++tot;
    }
    for (int i = 1; i <= m; i++) {
        add(p[i]=++tot, q[i]=++tot);
        add(nq[i]=++tot, np[i]=++tot);
    }
    for (int i = 1; i <= k; i++) {
        int u, v, y, z;
        cin >> u >> v >> y >> z;
        // x[u] op[v] y = z
        if (y==0&&z==0) {
            // 如果是 0 都可以
            // 如果是 1 一定是 and(0, 0) 根据 表格，合法的状态中，可以用 q=0 直接代表
            // 综上，只有一种非法情况，就是 x == 1 && q == 1 其取反是我们需要的，即
            // !x | !q : x->!q and q->!x
            add(x[u], nq[v]);
            add(q[v], nx[u]);
        } else if(y==0&&z==1) {
            // 如果是 0 不可能
            // 如果是 1 一定不是 and 不是 q=0 而是 or 或者 xor q=1
            // 综上，只有一种合法情况 x == 1 && q == 1 加两条语句
            add(nx[u], x[u]);
            add(nq[v], q[v]);
        } else if(y==1&&z==0) {
            // 这里编码太 tm 妙了
            // 如果是 0 一定是 and(0, 0)
            // 如果是 1 一定是 xor(1, 1)
            // 综上，只有一种合法情况 x == p && x == q
            // 注意这里 其实是枚举各种 x -> p and !x -> !p and p -> x and !p -> !x
            add(x[u], p[v]);
            add(nx[u], np[v]);
            add(p[v], x[u]);
            add(np[v], nx[u]);
            add(x[u], q[v]);
            add(nx[u], nq[v]);
            add(q[v], x[u]);
            add(nq[v], nx[u]);
        } else if(y==1&&z==1){
            // 如果是 0 不可能 and(0, 0)
            // 如果是 1 不可能 xor(1, 1)
            // 综上，唯一的非法情况 (x == 0 && p == 0 && q == 0) or (x == 1 && p == 1 && q == 1)
            // 需要的是： (x == 1 || p == 1 || q == 1) && (x == 0 || p == 0 || q == 0)
            // (x == 1 | q == 1) and (x == 0 | p == 0)
            add(nx[u], q[v]);
            add(nq[v], x[u]);
            add(x[u], np[v]);
            add(p[v], nx[u]);
        }
    }
    fill(dfn,dfn+1+tot,0);
    for (int i = 1; i <= tot; i++) {
        if(!dfn[i]) {
            tarjan(i);
        }
    }
    bool ok = true;
    for (int i = 1; i<=n;i++) {
        ok &= scc[x[i]] != scc[nx[i]];
    }
    for (int i = 1; i <=m;i++) {
        ok &= scc[p[i]] != scc[np[i]];
        ok &= scc[q[i]] != scc[nq[i]];
    }
    if(!ok) {
        cout << "NO\n";
    }  else {
        cout << "YES\n";
        for(int i = 1;i<=n;i++) {
            // 快速理解为什么是 < 号：
            // 永真式 A | A: !A -> A
            // 对应的 scc 序，显然 A 的 scc 编号较小，小了，就真了
            cout << (scc[x[i]] < scc[nx[i]]);
        }cout << "\n";
        for (int i = 1;i <=m;i++) {
            int pp = scc[p[i]] < scc[np[i]];
            int qq = scc[q[i]] < scc[nq[i]];
            if (!pp&&!qq) {
                cout << "&";
            } else if(!pp&&qq) {
                cout << "|";
            } else if(pp&&qq) {
                cout << "^";
            }
        }
        cout << "\n";   
    }
    for (int i = 1; i<= tot;i++) e[i].clear();
}

int main() {
    ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
    int T = 1;
    cin >> T;
    while (T--) solve();
}
```

## 1006 合成大hdu

### Problem Description

河灵是 hdu 的狂热粉丝。在他眼中，一切的一切都是 hdu 的模样。

有一天晚上，河灵在草稿纸上涂鸦时发现，他居然可以在一个字符串中窥见 hdu 的影子！对于一个字符串 $S$，河灵可以一下子就数出字符串 $S$ 的不同子序列 `hdu` 的个数。

简单的数数已经不能满足河灵了。河灵有一个正整数 $n$ ($1 \le n \le 10^9$)，河灵很想知道拥有不同子序列 `hdu` 个数恰好为 $n$ 的字符串 $S$ 是什么样的。

请你帮帮河灵，你需要构造一个仅包含 `h`, `d`, `u` 三种字符的字符串 $S$，使得字符串 $S$ 的不同子序列 `hdu` 的个数恰好等于 $n$。但是河灵的草稿纸大小有限，所以你构造的字符串长度不能超过 $3001$。

可以证明，对于所有满足 $1 \le n \le 10^9$ 的正整数 $n$，至少存在一种满足要求的构造方案。

*注：*
- **子序列**：如果 $S'$ 可以通过 $S$ 删除若干个（可能是零个或全部）元素，且不改变剩余元素的相对顺序得到，则称 $S'$ 是 $S$ 的子序列。
- **不同的子序列**：两个子序列 $S_1, S_2$ 不同，当且仅当原序列中至少存在一个位置在一个子序列中出现，在另一个子序列中被删除。

### Input

每个测试点中包含多组测试数据。输入的第一行包含一个正整数 $T$ ($1 \le T \le 10^3$)，表示数据组数。对于每组测试数据：

一行一个正整数 $n$ ($1 \le n \le 10^9$)，表示构造的字符串 $S$ 需要包含的不同子序列 `hdu` 的个数。

### Output

对于每组测试数据：输出一行一个字符串 $S$ ($1 \le |S| \le 3001$)，表示你构造的字符串。你需要保证字符串 $S$ 仅包含 `h`, `d`, `u` 三种字符。

若存在多种满足条件的字符串 $S$，输出任意一种即可。

### Sample Input

```txt
3
1
3
27
```

### Sample Output

```txt
hdu
hdhdu
hhhddduuu
```

### Solution

adhoc 神秘构造题目，基于 **基数表示法 + 数轴关系分配的充分利用**

如果数值范围很小，我们考虑的是，把它表示为 $n = B \times q + r$ 的形式

$$
h^r d h^{B-r} d^q u
$$

- 理解方式：从 $d$ 向两边扩展 $h, u$ ，发现，他们的和即为 $r + (r + B-r) \times q$  
- 关键在于： $1$ 权值的卡墙
- 约束条件：所有的字母数量 $B+q+2 \le 3001$ 即需要限制：
	- $B =1500 , 0 \le q \le 1499 , 0 \le r \le 1500(可以取等)$  
	- 最大表示的数字大约为： $1500 \times 1499 + 1499 = 1500^2 > 10^6$ 

如果过大，这种构造最多只能构造出来 平方级别的数字，对于立方级别，显然需要尽量均分，大约 $1000$ ，于是有：

$$
h^r d h^{B-r} d^q u^{C-s} d u^s
$$

- 公式：$B \times (C q + s) + C \times r$ 
- 理解方式：以 $3$ 个 d 为中心，分别向两侧对称式的扩展
- 关在在于：$3$ 平均变量
- 约束条件：$B+C+q+2 \le 3001$ 
	- 隐约构造丢番图方程：$Bx + Cy = n$ 
	- 所以：$B = 1000, C = 999, 0 \le q \le 1000, 1(不是0) \le r \le 1000, 0 \le s \le 999(必须取等)$ 
	- 最大表示的数字约为：$1000 \times (999 \times 1000 + 999) + 999 \times 1000 = 10^9 - 10^3 + 10^6 - 10^3 = 10^9 + 10^6 - 2 \times 10^3 > 10^9$
	- 因此足够了，但是需要注意这里的精度是否每一个都被考虑到，并且预测它的下限
	- 如果 $n = 1000 \times (999 \times q + s) + 999 \times r$ 那么
		- $n - 999 \times r \equiv 0 \pmod{1000}$
		- $n + r\equiv 0 \pmod{1000}$
		- 所以可行的解只有： $r = 1000 - (n \mod{1000})$
		- 则 $999 \times q + s = \frac{n - 999 \times r}{1000} = m$
		- 需要求解这个方程，其中约束条件是 $0 \le q \le 1000, 0 \le s \le 999$，且 $999 \times q + s \le 10^6 - 1$，而必然有 $\frac{n - 999 \times r}{1000} \lt 10^6$
		- 故该方程有解：$\begin{cases}q = \lfloor \frac{m}{999} \rfloor \\ s = m \bmod 999\end{cases}$
- 下限估计？：
	- 隐含的条件是：$\begin{cases}n - 999 \times r \equiv 0 \pmod{1000} \\n - 999 \times r \ge 0\end{cases}$
	- 根据丢番图方程：$999 r + 1000 k = n, (0 \le r \le 1000, k \in \mathbb{Z})$ 这个方程的解， $r$ 的周期为 $1000$
	- 所以，只要 $n \ge 10^6 \ge 999 \times 1000$ ， $r$ 的解就一定合法
	- 所以该方法对于 $n \ge 10^6$ 成立

### Code

```cpp
#include<bits/stdc++.h>
using namespace std;

bool check(string s, int ans) {
    int a = 0, b = 0, c = 0;
    for(auto _: s) {
        if (_ == 'h') a++;
        else if (_ == 'd') b += a;
        else c += b;
    }
    // cout << a << " " << b << " " << c << "\n";
    return c == ans && s.size() <= 3001;
}

string cal1(int n) {
	// n <= 1e6
	int B = 1500;
	int q = n / B, r = n % B;
	return string(r, 'h') + "d" + string(B - r, 'h') + string(q, 'd') + "u";
}

string cal2(int n) {
	// n > 1e6
	int B = 1000, C = 999;
	int r = B - n % B, m = (n - C * r) / B, q = m / C, s = m % C;
    // ??? 神秘特判，要不然 999999999 的时候 q = 1001, s = 0
    if (!s && q) q--, s+=C; 
	return string(r, 'h') + "d" + string(B - r, 'h') + string(q, 'd') + string(C - s, 'u') + "d" + string(s, 'u');
}

void solve() {
	int n;
	cin >> n;
    string res = (n <= 1e6 + 5? cal1(n) : cal2(n));
    // if (!check(res, n)) {
        // cout << n << ":";
        // cout << res.size() << "\n";
    // }
    cout << res << "\n";
}
int main() {
	ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
	int T = 1;
	cin >> T;
	while (T--) solve();
}
```

## 1007 另一个 shu 论问题

### Problem Description

随着对算法竞赛研究的不断深入，河灵逐渐对“数论”与“树论”产生了浓厚的兴趣。

现在，河灵有一棵包含 $n$ 个节点的树，节点编号为 $1 \sim n$，根节点为 $1$。

我们记 $\gcd(x,y)$ 表示整数 $x,y$ 的最大公约数，记 $\operatorname{lca}(x,y)$ 表示节点 $x,y$ 在这棵树中的最近公共祖先的编号。河灵想知道，“数论”和“树论”碰撞在一起，会产生什么样的火花？

所以河灵想请你求出，有多少对 $x,y$ ($1 \le x < y \le n$) 满足 $\gcd(x,y) = \operatorname{lca}(x,y)$。

### Input

每个测试点中包含多组测试数据。输入的第一行包含一个正整数 $T$ ($1 \le T \le 8 \times 10^5$)，表示数据组数。对于每组测试数据：

第一行一个正整数 $n$ ($1 \le n \le 2 \times 10^5$)，表示树的大小。

接下来 $n-1$ 行，每行两个正整数 $x,y$ ($1 \le x,y \le n$)，表示树中存在无向边 $(x,y)$。

保证所有测试数据中 $n$ 之和不超过 $8 \times 10^5$。

### Output

对于每组测试数据：输出一行一个整数，表示答案。

### Sample Input

```txt
2
5
1 2
2 3
1 4
4 5
10
3 9
4 7
6 9
8 5
5 2
9 1
1 2
2 7
7 10
```

### Sample Output

```txt
7
27
```

### Solution

**群友的题解是什么垃圾？莫反你先别急着用除法换元** 

**DSU on Tree 本质上就是 继承为主，从而少读，少写**

考虑子树信息合并，lca 节点 $u$ 新来了一个子树上面的 $x$ 时，需要匹配已有子树中的 $y$ 组成 lca 关系

$$
\begin{align}

\sum_{y \in {T}_{pre}, x \in {T}_{cur}} [ \gcd(x, y) = u ] 

&\xlongequal{将 [\cdot] 提升为约束条件并化简} \sum_{u\mid x,y} \sum_{u \mid x,y} [\gcd(\frac{x}{u}, \frac{y}{u}) = 1] \\

&\xlongequal{对单位函数 \epsilon 反演(莫反)} \sum_{u\mid x,y} \sum_{d\mid \frac{x}{u}, \frac{y}{u}} \mu(d) \\

&\xlongequal{将 \sum 条件提出来，变成 [\cdot]}  [u\mid x] \sum_{d\mid \frac{x}{u}} [u \mid y] \cdot [du \mid y] \cdot \mu(d) \\

&\xlongequal{消去无用的  [u \mid y] } [u\mid x] \sum_{d\mid \frac{x}{u}} [du \mid y] \cdot \mu(d) \\

&\xlongequal{将 [x \mid y] 关系转化为倍数统计} [u \mid x] \sum_{d \mid \frac{x}{u}} \mu(d) \cdot \text{cnt}(du) \\

\end{align} 
$$

- 其中 $\text{cnt}(d) = \sum_{y \in T_{pre}} [d \mid y]$ 
- 即集合 $T_{pre}$ 中 $i$ 的倍数个数
- 通过平均 $O(\ln{n})$ 时间进行维护，具体原因见后文。

**特别注意**

- $\sum_{i=1}^{n} \tau(i) = O(n \ln{n})$ 即 $[1,n]$ 的因子个数的和，是 $O(n\log{n})$ 级别的，而非 $O(n\sqrt{n})$ ！
	- 因此我们可以暴力枚举 $1e6$ 范围内的所有数字的质因子
	- 既然如此，这就需要 $O(n\ln{n})$ 调和级数时间内在 `init` 内预处理所有数字的引子集合
- 计算的时候，每一个 lca 节点，一定要最后插入（贡献为子树中其倍数的个数），否则会被重复计数

### Code

```cpp
#include<bits/stdc++.h>
using namespace std;
using LL = long long;

const int N = 2e5 + 5;

vector<int> F[N];// 因子集合
int primes[N], cntP, mu[N], factor[N];

int n;
vector<int> e[N];// 树
int son[N], sz[N];
int dfncnt, rnk[N];
map<int,int> cnt[N];

LL ans;

void init() {
    mu[1] = 1;
    for (int i = 2; i < N; i++) {
        if (!factor[i]) {
            factor[i] = primes[++cntP] = i;
            mu[i] = -1;
        }
        for (int j = 1; j<=cntP;j++) {
            int p = primes[j];
            int pi = p * i;
            if (pi >= N) break;
            factor[pi] = p;
            if(i%p) {
                mu[pi] = -mu[i];
            } else {
                mu[pi] = 0;
                break;
            }
        }
    }
    for(int i = 1; i <N; i++) {
        for(int j = i;j<N;j+=i) {
            F[j].push_back(i);
        }
    }
}

void dfs0(int u,int f) {
    son[u] = 0;
    sz[u] = 1;
    for(auto v:e[u]) if (v!=f) {
        dfs0(v, u);
        sz[u] += sz[v];
        if (sz[son[u]] < sz[v]) {
            son[u] = v;
        }
    }
}

void dfs(int u,int f) {
    rnk[++dfncnt] = u;
    if (son[u]) {
        dfs(son[u], u);
        // 继承重儿子子树
        cnt[u].swap(cnt[son[u]]);
    } else {
        cnt[u].clear();
    }
    auto& C = cnt[u];
    // 合并
    for(auto v:e[u]) if(v!=f && v!=son[u]){
        // 递归计算
        int st = dfncnt + 1;
        dfs(v, u);
        int ed = dfncnt;
        // 如果遍历到 x 那么就计算
        // x 是 u 的倍数的时候， d 是 x/u 的因子的 mu[d] * C[u * d]
        for (int i = st; i <= ed; i++) {
            int x = rnk[i];
            if (x % u == 0) {
                for (auto d: F[x/u]) {
                    if (C.count(u * d)) ans += mu[d] * C[u * d];
                    // cout << u * d << "\n";
                    // cout << u << "+=" << mu[d] * C[u * d] << "\n";
                }
            }
        }
        // 合并完，加入 u 信息
        for(auto [val, c]: cnt[v]) C[val] += c;
        cnt[v].clear();
    }
    // 一定要最后！ 加入 u 信息
    // cout << "fin: " << u << "+=" << C[u] << "\n";
    if (C.count(u)) ans += C[u];
    for(auto val:F[u]) C[val]++;
}

void solve() {
    dfncnt = ans = 0;
    cin >> n;
    for (int i = 1; i < n ;i++)  {
        int u , v;
        cin >> u >> v;
        e[u].push_back(v);
        e[v].push_back(u);
    }
    dfs0(1, 0);
    dfs(1, 0);
    cout << ans << "\n";
    for (int i = 1; i <= n; i++) e[i].clear();
}

int main() {
    init();
    ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
    int T = 1;
    cin >> T;
    while (T--) solve();
}
```