---
title: Conclusions
date: 2026-08-20
updated: "2026-10-07T12:56:45+08:00"
tags:
  - 笔记
  - Conclusion
published: true
---
## Math

### Raney 引理

$$
对于 x_1,x_2,\dots,x_m，如果 \sum_{i=1}x_i=1 ,则其所有循环位移中恰好有一个满足所有的前缀和都是正数。
$$

### 生成函数常用封闭形式（原函数）

#### 1. 有限和

$$
\sum_{i=1}^{n}x^i=\frac{x(1-x^n)}{1-x}=\frac{x-x^{n+1}}{1-x}
$$

从 $0$ 开始：

$$
\sum_{i=0}^{n}x^i=\frac{1-x^{n+1}}{1-x}
$$

用途：生成函数中表示“取 $0\sim n$ 个”的有限约束。

#### 2. 无穷和

当 $|x|<1$，或形式幂级数意义下：

$$
\sum_{i=0}^{\infty}x^i=\frac{1}{1-x}
$$

常用派生：

| 形式幂级数 | 封闭形式 |
|---|---|
| $\sum_{i=0}^{\infty}x^i$ | $\frac{1}{1-x}$ |
| $\sum_{i=0}^{\infty}(i+1)x^i$ | $\frac{1}{(1-x)^2}$ |
| $\sum_{i=0}^{\infty}ix^i$ | $\frac{x}{(1-x)^2}$ |
| $\sum_{i=0}^{\infty}x^{2i}$ | $\frac{1}{1-x^2}$ |
| $\sum_{i=0}^{\infty}x^{2i+1}$ | $\frac{x}{1-x^2}$ |
| $\sum_{i=0}^{\infty}\alpha^ix^i$ | $\frac{1}{1-\alpha x}$ |
| $\sum_{i=0}^{\infty}\binom{n+i}{i}x^i$ | $\frac{1}{(1-x)^{n+1}}$ |
| $\sum_{i=0}^{\infty}\frac{x^i}{i!}$ | $e^x$ |
| $\sum_{i=1}^{\infty}\frac{x^i}{i}$ | $-\ln(1-x)$ |

#### 3. 求导法

从

$$
\frac{1}{1-x}=\sum_{i=0}^{\infty}x^i
$$

求导得：

$$
\frac{1}{(1-x)^2}=\sum_{i=0}^{\infty}(i+1)x^i
$$

两边乘 $x$：

$$
\frac{x}{(1-x)^2}=\sum_{i=0}^{\infty}ix^i
$$

这是求“算术级数求和”和“期望 $E[X]=\sum k p_k$”的常用手段。

#### 4. 概率生成函数 PGF

设 $X$ 为非负整数值随机变量：

$$
G_X(s)=E[s^X]=\sum_{k=0}^{\infty}P(X=k)s^k
$$

期望与方差：

$$
E[X]=G_X'(1)
$$

$$
\operatorname{Var}(X)=G_X''(1)+G_X'(1)-[G_X'(1)]^2
$$

核心性质：

- 独立时卷积性：$G_{X+Y}(s)=G_X(s)G_Y(s)$
- 随机和套娃：若 $S_N=\sum_{i=1}^{N}X_i$，且 $X_i$ 独立同分布，与 $N$ 独立，则  
  $$
  G_{S_N}(s)=G_N(G_X(s))
  $$

例：几何分布 $P(X=k)=(1-p)^{k-1}p,\ k\ge1$

$$
G_X(s)=\frac{ps}{1-(1-p)s}
$$

$$
E[X]=G_X'(1)=\frac{1}{p}
$$

---

### 概率论与数理统计常见分布

#### 1. 离散型分布

| 分布 | 参数 | $P(X=k)$ | 期望 | 方差 | 概率母函数 $G(s)$ |
|---|---|---|---|---|---|
| 两点 / Bernoulli | $p$ | $p$ 或 $1-p$ | $p$ | $p(1-p)$ | $1-p+ps$ |
| 二项 $B(n,p)$ | $n,p$ | $\binom{n}{k}p^k(1-p)^{n-k}$ | $np$ | $np(1-p)$ | $(1-p+ps)^n$ |
| 泊松 $\operatorname{Pois}(\lambda)$ | $\lambda$ | $e^{-\lambda}\frac{\lambda^k}{k!}$ | $\lambda$ | $\lambda$ | $e^{\lambda(s-1)}$ |
| 几何 $\operatorname{Geom}(p)$ | $p$ | $(1-p)^{k-1}p,\ k\ge1$ | $\frac{1}{p}$ | $\frac{1-p}{p^2}$ | $\frac{ps}{1-(1-p)s}$ |
| 负二项 $\operatorname{NB}(r,p)$ | $r,p$ | $\binom{k-1}{r-1}p^r(1-p)^{k-r},\ k\ge r$ | $\frac{r}{p}$ | $\frac{r(1-p)}{p^2}$ | $\left(\frac{ps}{1-(1-p)s}\right)^r$ |
| 超几何 | $N,M,K$ | $\frac{\binom{M}{k}\binom{N-M}{K-k}}{\binom{N}{K}}$ | $\frac{KM}{N}$ | $\frac{KM(N-M)(N-K)}{N^2(N-1)}$ | — |

#### 2. 连续型分布

| 分布 | 参数 | 密度 $f(x)$ | 期望 | 方差 | MGF / 特征函数 |
|---|---|---|---|---|---|
| 均匀 $U(a,b)$ | $a<b$ | $\frac{1}{b-a},\ a<x<b$ | $\frac{a+b}{2}$ | $\frac{(b-a)^2}{12}$ | $M(t)=\frac{e^{tb}-e^{ta}}{t(b-a)},\ t\ne0$ |
| 指数 $\operatorname{Exp}(\lambda)$ | $\lambda>0$ | $\lambda e^{-\lambda x},\ x>0$ | $\frac{1}{\lambda}$ | $\frac{1}{\lambda^2}$ | $M(t)=\frac{\lambda}{\lambda-t},\ t<\lambda$ |
| 伽马 $\Gamma(\alpha,\beta)$ | $\alpha,\beta>0$ | $\frac{\beta^\alpha}{\Gamma(\alpha)}x^{\alpha-1}e^{-\beta x}$ | $\frac{\alpha}{\beta}$ | $\frac{\alpha}{\beta^2}$ | $M(t)=\left(\frac{\beta}{\beta-t}\right)^\alpha,\ t<\beta$ |
| 正态 $N(\mu,\sigma^2)$ | $\mu,\sigma^2$ | $\frac{1}{\sqrt{2\pi}\sigma}e^{-\frac{(x-\mu)^2}{2\sigma^2}}$ | $\mu$ | $\sigma^2$ | $M(t)=e^{\mu t+\frac12\sigma^2t^2}$ |
| 卡方 $\chi^2(k)$ | $k$ | $\frac{1}{2^{k/2}\Gamma(k/2)}x^{k/2-1}e^{-x/2}$ | $k$ | $2k$ | $M(t)=(1-2t)^{-k/2},\ t<\frac12$ |
| Beta $B(a,b)$ | $a,b>0$ | $\frac{\Gamma(a+b)}{\Gamma(a)\Gamma(b)}x^{a-1}(1-x)^{b-1},\ 0<x<1$ | $\frac{a}{a+b}$ | $\frac{ab}{(a+b)^2(a+b+1)}$ | — |
| 柯西 | $x_0,\gamma$ | $\frac{1}{\pi\gamma[1+((x-x_0)/\gamma)^2]}$ | 不存在 | 不存在 | $\varphi(t)=e^{ix_0t-\gamma\lvert t\rvert}$ |

#### 3. 常用关系

- 指数分布是伽马分布 $\Gamma(1,\lambda)$
- 卡方分布是伽马分布 $\Gamma(k/2,1/2)$
- 几何分布是负二项分布 $r=1$ 的特例
- 负二项分布可看作 $r$ 个独立几何分布之和
- 二项分布逼近泊松：$n\to\infty,\ np\to\lambda$ 时  
  $$
  (1-p+ps)^n\to e^{\lambda(s-1)}
  $$
- 可加性：
  - 独立泊松：$\operatorname{Pois}(\lambda_1)+\operatorname{Pois}(\lambda_2)=\operatorname{Pois}(\lambda_1+\lambda_2)$
  - 同 $p$ 独立二项：$B(n_1,p)+B(n_2,p)=B(n_1+n_2,p)$
  - 同 $\beta$ 独立伽马：$\Gamma(\alpha_1,\beta)+\Gamma(\alpha_2,\beta)=\Gamma(\alpha_1+\alpha_2,\beta)$
  - 独立正态：$N(\mu_1,\sigma_1^2)+N(\mu_2,\sigma_2^2)=N(\mu_1+\mu_2,\sigma_1^2+\sigma_2^2)$
  - 独立卡方：$\chi^2(k_1)+\chi^2(k_2)=\chi^2(k_1+k_2)$

一句话总结：**有限和用错位相减，无穷和用等比极限，概率期望用 PGF 求导；离散看 PGF，连续看 MGF / 特征函数。**