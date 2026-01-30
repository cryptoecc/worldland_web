# Token Vesting

WorldLand implements staged vesting schedules to ensure long-term alignment between all stakeholders.

## Vesting Overview

| Category                  | TGE Unlock | Cliff     | Vesting Schedule               |
| ------------------------- | ---------- | --------- | ------------------------------ |
| **Compute Resources**     | Ongoing    | None      | Continuous emission via mining |
| **Core Builders**         | 0%         | 12 months | 10% every 3 months             |
| **Ecosystem**             | 0%         | 12 months | 10% every 3 months             |
| **Community & Liquidity** | 100%       | None      | Fully unlocked at TGE          |

## Detailed Vesting Schedules

### Compute Resources (50.46%)

```
Mining Emission Schedule:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ Continuous emission through PoW mining                │
│ ~5.184M WL minted every 30 days (D+30)               │
│ Until 504.6M allocation is exhausted                  │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

- No cliff or vesting
- Distributed based on mining participation
- Aligns issuance with sustained network security

### Core Builders (15%)

```
Month:    0    6    12   15   18   21   24   27   30   33   36   39
          │    │    │    │    │    │    │    │    │    │    │    │
Unlock:   0%   0%   0%  10%  20%  30%  40%  50%  60%  70%  80%  90%
          └────────────┘
           12-month cliff
```

| Period               | Unlock             | Cumulative |
| -------------------- | ------------------ | ---------- |
| TGE                  | 0%                 | 0%         |
| Month 12 (Cliff End) | 0%                 | 0%         |
| Month 15             | 10%                | 10%        |
| Month 18             | 10%                | 20%        |
| Month 21             | 10%                | 30%        |
| ...                  | 10% every 3 months | ...        |

### Ecosystem (20%)

```
Month:    0    6    12   15   18   21   24   27   30   33   36   39
          │    │    │    │    │    │    │    │    │    │    │    │
Unlock:   0%   0%   0%  10%  20%  30%  40%  50%  60%  70%  80%  90%
          └────────────┘
           12-month cliff
```

| Period               | Unlock             | Cumulative |
| -------------------- | ------------------ | ---------- |
| TGE                  | 0%                 | 0%         |
| Month 12 (Cliff End) | 0%                 | 0%         |
| Month 15             | 10%                | 10%        |
| Month 18             | 10%                | 20%        |
| Month 21             | 10%                | 30%        |
| ...                  | 10% every 3 months | ...        |

::: tip Ecosystem Pool Usage
The 20% Ecosystem allocation supports R&D, mainnet alpha mining swap program, ecosystem application growth, initial development contributions, and governance-driven future allocations.
:::

### Community & Liquidity (14.54%)

::: info Immediate Availability
**100% unlocked at TGE** to enhance visibility and facilitate trading on initial exchanges and community platforms.
:::

## Vesting Rationale

| Stakeholder       | Cliff Purpose               | Vesting Purpose               |
| ----------------- | --------------------------- | ----------------------------- |
| **Core Builders** | Ensure long-term commitment | Align with project milestones |
| **Ecosystem**     | Build reserve first         | Sustainable ecosystem growth  |

## TGE Definition

::: info What is TGE?
**TGE (Token Generation Event)** refers to the token generation event / initial exchange listing point used for unlock schedules.
:::

## Next Steps

- [Token Utility](/tokenomics/utility) - How WL is used
- [Provider Rewards](/tokenomics/provider-rewards) - Earning through contribution
