---
title: 2026牛客暑期多校训练营2
tags:
  - 牛客多校
  - NC
published: true
---
## F

### Problem Description

大小为 $n$ 的树是一个有 $n - 1$ 条双向边的连通图。带标签的树是指每个顶点和每条边都被赋予一个非负整数值的树。

顶点 $u$ 被赋予的值为 $a_u$，$u$ 与 $v$ 之间的边被赋予的值为 $w_{u,v}$。若对于每对存在边的 $(u, v)$，均满足

$$
w_{u,v} = |a_u - a_v|,
$$

则称该带标签的树为神奇的树。

对于一棵树，其复杂度定义为所有顶点被赋予的值中最大值与最小值之差。

给定一棵以 $1$ 为根的带标签树，但各顶点的值缺失。对于从 $1$ 到 $n$ 的每个 $i$，若将顶点 $i$ 对应的子树的顶点赋值，使其成为一棵神奇的树，该子树的最小复杂度是多少？注意各子树的问题需独立求解。即某子树复杂度的最小化并不意味着其他子树的复杂度也一定达到最小。

顶点 $u$ 的子树包含且仅包含所有满足“从 $1$ 到 $v$ 的最短路径经过顶点 $u$”的顶点 $v$，并保留原树的连接关系。

### Input

每个测试包含多组测试用例。第一行包含测试用例数 $T$（$1 \leqslant T \leqslant 10^4$）。接下来是每组测试用例的描述。

每组测试用例的第一行包含一个整数 $n$（$3 \leqslant n \leqslant 10^5$）——树的顶点数。

接下来 $n - 1$ 行，第 $i$ 行包含三个整数 $u_i$, $v_i$ 和 $w_{u_i,v_i}$（$1 \leqslant u_i, v_i \leqslant n$, $u_i \neq v_i$, $0 \leqslant w_{u_i,v_i} \leqslant 5000$）——树中第 $i$ 条边的两个端点及其被赋予的值。保证给定的边构成一棵树。

记 $W$ 为同一测试中所有测试用例的 $w_{u_i,v_i}$ 最大值。保证 $n$ 的总和不超过

$$
\min\left(\frac{3 \times 10^7}{\max(1, W)},\ 10^5\right).
$$

### Output

对于每组测试用例，输出 $n$ 个整数，分别表示顶点 $1, 2, \ldots, n$ 各自子树的最小复杂度。

### Sample Input

```txt
3
3
1 2 1
2 3 1
4
1 2 2
2 3 1
3 4 2
5
1 2 4
1 3 1
2 4 2
2 5 1
```

### Sample Output

```txt
1 1 0
3 2 2 0
4 2 0 0
```

### Solution

**对 定一限一 这种 dp 定义方式的重视** 

**这种定义的树形 DP 转移是 $O(m)$ 的**

**父子之间取的 max 或者 min 的运算结合顺序要理清**

**由于 父亲 在某一定条件下的答案，是基于所有 儿子 的答案的 RMQ**

**不妨加一层 tmp 层，缓存 儿子 带给父亲的 最小 代价，这是因为上层具体一种状态，需要下层的充分布置（特别是转移条件有多种方式的时候）**

现在分析一下 该题 dp 转移的合理性

- 定义 `dp[u][i]` 表示 节点 `u` 允许下跌 `i` 大小的情况下，最小最大上升值
- 故分析从各种 `v -> u` 的转移方式
- 必然是 `u` 选定一个 `i` 让所有 `v` 布置好 **自己的** 最优状态从而从各种最优状态中，选取最差（最大）的，从而在 `i` 的前提下，而容纳所有子树
	- 先说一下答案按布置方法
		- 每一个 `v` 都是为 `u` 根据 `i` 的值，提供此时可以提供的最优（最小）的答案
		- 且 每一个 `v` 在最终的答案中，只能选择一个状态
		- 故 `v` 其实是在自己的各种可能状态中，选择所有映射到对应的 `i` 的备选答案中，最优（最小）的那一个 min 即可
	- `-w` 的情况
		- 从下跌出发
		- 此时下跌至少为 `w` ，最大是 `W*2 - 1` ，故据此枚举 `i in [w, W*2 - 1)`
		- `v` 相对于 `u` 已经下跌了 `w` ，故将 `dp[v]` 的所有值，平移 `-w` 并且与 `0` 取 max，得到最大上升值
	- `+w` 的情况
		- 从上升出发
		- 此时，至少上升 `w`，最大是 `W*2 - 1`
		- 而对于下跌来说，由于有预先上升，故将 `dp[v]` 中的下跌变化值，均映射到 `-w` 并且与 `0` 取 max，故据此，依然通过枚举 `[0, W*2 - 1)` ，只不过前几和由于取 max 导致多对一的 min 竞争映射

### Code

```cpp
#include<bits/stdc++.h>
using namespace std;

const int N = 1e5 + 5;

int n, W;
vector<pair<int,int>> e[N];
// dp[i][x] 表示 最小值与 根 i 的距离不大于 x 的时候，最大值与 根 i 的距离的最小值 
vector<int> dp[N]; 
int tmp[10001];

void dfs(int u,int f) {
    dp[u].assign(W*2, 0);
    for (auto [v,w]: e[u]) if (v != f) {
        dfs(v, u);
        fill(tmp,tmp+W*2, 1e9);
        // 这么想： 
        // tmp 是 u 的儿子们根据 u 提供的一个指标
        // 由于 u 定了，所以 v 只有一个可选状态，所以可以反复重试取 min 
        // 为父亲 提供一个 最优解 
        for (int i = w; i < W * 2; i++) {
            // 当 -w
            tmp[i] = min(tmp[i], max(0, dp[v][i-w] - w));
        }
        for (int i = 0; i < W * 2; i++) {
            // 当 +w
            int tk = max(0, i - w);
            tmp[tk] = min(tmp[tk], w + dp[v][i]);
        }
        for (int i = 0; i < W * 2; i++) {
            dp[u][i] = max(dp[u][i], tmp[i]);
        }
    }
}

void solve() {
    cin >> n;
    W = 0;
    for (int i = 2; i <= n; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        W = max(W, w);
        e[u].push_back({v, w});
        e[v].push_back({u, w});
    }
    dfs(1, 0);
    for (int i = 1; i <= n; i++) {
        int ans = 1e9;
        for (int j = 0; j < W*2; j++) {
            ans = min(ans, dp[i][j] + j);
        }
        cout << ans << " ";
    }cout << "\n";
    for (int i = 1; i <= n; i++) e[i].clear();
}

int main() {
    ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
    int T = 1;
    cin >> T;
    while (T--) solve();
}
```

## L 懒得打乱

### Problem Description

小羊被分配了一个打乱长度为 $n$ 的排列的任务。一个排列就是一个长度为 $n$ 的包含 $1, 2, \ldots, n$ 中的数各一次的序列。

小羊的领导会通过比较打乱前后数组的逆序对数量来评价小羊的工作。也就是说，我们定义一个排列 $A = [A_1, A_2, \ldots, A_n]$ 的逆序对数量为

$$
f(A) = \sum_{1 \leqslant i < j \leqslant n} \mathbf{1}_{A_i > A_j},
$$

而打乱前后的排列分别是 $A$ 和 $A'$。那么，小羊的领导会计算

$$
g(A, A') = |f(A) - f(A')|
$$

来检查小羊的工作。领导希望这个数值越大越好。

但小羊是个懒人。他不想真的好好打乱数组，所以他决定使用一个长度为 $n$ 的排列 $p = [p_1, p_2, \ldots, p_n]$，这样，当他工作中遇到一个排列 $A = [A_1, A_2, \ldots, A_n]$ 的时候，他就可以提交

$$
f_p(A) = [A_{p_1}, A_{p_2}, \ldots, A_{p_n}]
$$

作为他的工作成果。可以证明 $f_p(A)$ 也是一个排列。

小羊认为一个排列是幸运的，当且仅当如果他使用上述的“打乱方法”的话，这个排列 $A$ 能最大化 $g(A, f_p(A))$。也就是说，对于任意一个长度为 $n$ 的排列 $A_0$，都有

$$
g(A, f_p(A)) \geqslant g(A_0, f_p(A_0)).
$$

那么有多少幸运的排列呢？鉴于答案可能很大，请将结果关于 $998244353$ 取模后输出。

注意，当 condition 成立时，$\mathbf{1}_{\text{condition}}$ 等于 $1$，否则等于 $0$。

### Input

输入包含两行。

第一行包含一个整数 $n$ ($1 \leqslant n \leqslant 22$) — 排列的长度。

第二行包含 $n$ 个整数 $p_1, p_2, \ldots, p_n$ ($1 \leqslant p_i \leqslant n$) — 小羊用于打乱 $A$ 的排列 $p$。保证 $\forall 1 \leqslant i < j \leqslant n,\ p_i \neq p_j$。

### Output

输出一个整数，表示幸运的排列的数量关于 $998244353$ 取模的结果。

### Sample Input

**Sample 1**

```txt
3
3 1 2
```

**Sample 2**

```txt
3
3 2 1
```

### Sample Output

**Sample 1**

```txt
4
```

**Sample 2**

```txt
2
```

### Solution

**嗅到答案一定与逆序对有关！** 

**根据题目，找出来答案变化的原因，结合逆序对** 

- 根据题目中，**最** 值个数，发现
	- 分析 $p_i, p_j$ 两个下标位置的置换，只有下标产生逆序对才有前后交换 $\pm 1$。
- 提出猜想
	- 所有满足同一类的逆序对，最值个数都相同
	- 所有的逆序对一定可以贡献同向
- 根据逆序对约束限制，可以构建出一个 DAG 图，这是一个关于大小偏序约束的图
	- 显然，DAG 图的解的数量等于其拓扑排序的方案数，因为可以一个个填
	- 同样根据 $n \le 22$ 的数据量提示，发现只能使用 **状压DP** 计算 每一个子集完成排序的方案数.

### Code

```cpp
#include<bits/stdc++.h>
using namespace std;

const int N = 22;
const int mod = 998244353;

int n, p[N];

int f[(1<<N) + 1];
int pre[N];

void solve() {
    cin >> n;
    for (int i = 0 ; i < n; i++) {
        cin >> p[i];
        p[i]--;
    }
    bool flg = true;
    for (int i = 0 ; i < n; i++) {
        int mx = -1;
        for (int j = i+1;j  < n;j++) {
            if (p[i] > p[j] && p[j] > mx) {
                flg = false;
                pre[j] |= 1 << i;
                mx = p[j];
            }
        }
    }
    f[0] = 1;
    for (int s = 0; s < (1 << n); s++) {
        if (f[s])
        for (int j = 0; j < n; j++) {
            if (s >> j & 1^1) {
                if (pre[j] == (pre[j] & s)) {
                    (f[s | (1 << j)] += f[s]) %= mod;
                }
            }
        }
    }
    if (flg) {
        f[(1 << n) - 1] = (long long) f[(1 << n) - 1] * ((mod + 1) / 2) % mod;
    }
    cout << 2 * f[(1 << n) - 1] % mod << "\n";
}

int main() {
    ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
    int T = 1;
    // cin >> T;
    while (T--) solve();
}
```