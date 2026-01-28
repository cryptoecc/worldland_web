# Reward Emissions

WorldLand's emission schedule is designed to align token issuance with sustained network security and resource contribution.

## Emission Overview

| Parameter                  | Value                    |
| -------------------------- | ------------------------ |
| **Total Supply**           | 1,000,000,000 WL        |
| **Compute Resources Pool** | 504,600,000 WL (50.46%) |
| **Block Reward**           | 20 WL                   |
| **Block Time**             | 10 seconds               |

## Block Reward Structure

Every block (10 seconds):

```
Block Reward: 20 WL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│                                         │
│  Miner Reward:    16 WL (80%)         │
│  Treasury:         4 WL (20%)         │
│                                         │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Emission Timeline

### Daily Emission

```
Blocks per day = 86,400 seconds ÷ 10 seconds = 8,640 blocks
Daily emission = 8,640 × 20 WL = 172,800 WL
```

### Monthly Emission

```
Monthly blocks = 8,640 × 30 = 259,200 blocks
Monthly emission = 259,200 × 20 WL ≈ 5,184,000 WL
```

### Yearly Emission

```
Yearly blocks = 8,640 × 365 = 3,153,600 blocks
Yearly emission = 3,153,600 × 20 WL ≈ 63,072,000 WL
```

## Emission Distribution

| Recipient    | Share | Daily       | Monthly       | Yearly         |
| ------------ | ----- | ----------- | ------------- | -------------- |
| **Miners**   | 80%   | 138,240 WL | 4,147,200 WL | 50,457,600 WL |
| **Treasury** | 20%   | 34,560 WL  | 1,036,800 WL | 12,614,400 WL |
| **Total**    | 100%  | 172,800 WL | 5,184,000 WL | 63,072,000 WL |

## Compute Pool Exhaustion

```
Time to exhaust Compute Resources pool:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
504,600,000 WL ÷ 63,072,000 WL/year ≈ 8 years
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

::: info Long-term Sustainability
The Compute Resources allocation is designed to support mining rewards for approximately **8 years** at the current emission rate.
:::

## Emission Curve

```
Year:    1      2      3      4      5      6      7      8
         │      │      │      │      │      │      │      │
Pool:  ████████████████████████████████████████████████░░░░
       100%   87%    75%    62%    50%    37%    25%   12%

       ─────────────────────────────────────────────────────▶
                   Gradual Reduction of Pool
```

## Treasury Growth

The treasury receives continuous funding through:

1. **Initial Allocation**: 10% (100,000,000 WL)
2. **Block Rewards**: 20% of each block (4 WL/block)

### Projected Treasury Balance

| Year | Block Reward Inflow | Cumulative (Rewards only) |
| ---- | ------------------- | ------------------------- |
| 1    | 12,614,400 WL      | 12,614,400 WL            |
| 2    | 12,614,400 WL      | 25,228,800 WL            |
| 3    | 12,614,400 WL      | 37,843,200 WL            |
| 5    | 12,614,400 WL      | 63,072,000 WL            |

## Comparison with Other Projects

| Project            | Block Time | Initial Block Reward | Halving       |
| ------------------ | ---------- | -------------------- | ------------- |
| **WorldLand**      | 10s        | 20 WL               | TBD           |
| Bitcoin            | 10min      | 50 BTC → 3.125 BTC   | Every 4 years |
| Ethereum (PoW era) | ~13s       | Variable             | N/A           |

## Future Considerations

::: warning Governance Decisions
The emission schedule may be adjusted through governance proposals. Potential changes include:

- Halving mechanisms
- Dynamic difficulty adjustment
- Reward distribution modifications
  :::

## Next Steps

- [Circulating Supply](/tokenomics/circulating-supply) - Current supply metrics
- [Token Distribution](/tokenomics/distribution) - Full allocation breakdown
