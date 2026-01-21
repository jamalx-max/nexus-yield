# Stacks Documentation Navigation Rules for AI Agents

This file tells you how to efficiently navigate the `stacks/` folder to find Stacks blockchain documentation.

---

## Directory Structure

```
stacks/
├── INDEX.md              ← Quick links to key files
├── STACKS_DOCS_RULES.md  ← You are here
├── stacks-shards/        ← 70 topic files (from stacks-llm.txt)
├── stacks_essentials/    ← 75 curated developer files
├── all_shards_list.txt   ← Index of all shard filenames
└── stacks-llm.txt        ← Full document (use for grep/search)
```

---

## Navigation Protocol

### Step 1: Start with INDEX.md

Check `INDEX.md` first for quick links to common topics organized by category.

### Step 2: Search stacks-shards/

The shards folder has 70 files covering all core Stacks topics:

| Topic Range | Files | Description |
|-------------|-------|-------------|
| Overview | `001_*` - `007_*` | Introduction, Stacks 101, Bitcoin connection |
| Network | `008_*` - `017_*` | Network, accounts, auth, BNS, SIPs |
| Block Production | `018_*` - `022_*` | Mining, signing, finality |
| Stacking | `023_*` | Stacking |
| Transactions | `024_*` - `026_*` | Transactions, post-conditions |
| Clarity | `027_*` - `028_*` | Clarity language |
| sBTC | `029_*` - `055_*` | sBTC operations, contracts, walkthroughs |
| Dual Stacking | `056_*` - `063_*` | Dual stacking |
| Bridging | `064_*` - `070_*` | USDCx, bridging |

**Find files by keyword:**
```bash
ls stacks-shards/ | grep -i "sbtc"
ls stacks-shards/ | grep -i "clarity"
```

### Step 3: Check stacks_essentials/ for Developer Guides

For detailed tutorials and code examples:

| Topic | Files |
|-------|-------|
| Clarity Crash Course | `073_*` |
| Tokens (FT/NFT/SFT) | `074_*` - `077_*` |
| Frontend | `078_*`, `129_*` |
| Testing | `108_*`, `109_*` |
| Transactions | `121_*`, `130_*` |
| Full-Stack Tutorial | `417_*` - `427_*` |

### Step 4: Use all_shards_list.txt for Discovery

Scan this file to see all 70 shard filenames before reading files.

### Step 5: Use stacks-llm.txt for Full-Text Search

The monolithic file (7000+ lines) is useful for:
- Searching across ALL documentation
- Finding content not split into shards
- Grep for specific terms

---

## Key Contract Addresses

### Mainnet
| Contract | Address |
|----------|---------|
| sBTC Token | `SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token` |
| sBTC Deposit | `SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-deposit` |
| SIP-010 Trait | `SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard` |

### Testnet
| Contract | Address |
|----------|---------|
| sBTC Token | `ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token` |
| SIP-010 Trait | `ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.sip-010-trait-ft-standard` |

---

## Token-Efficient Reading Strategy

1. **Read filenames first** - Use `ls` or `all_shards_list.txt`
2. **Read only relevant files** - Don't read entire directories
3. **Use line ranges** - If a file is large, read specific line ranges
4. **One topic at a time** - Don't load multiple files unless comparing

---

## File Naming Convention

Files are numbered sequentially: `NNN_topic_name.md`

- Numbers indicate order from original documentation
- Names are lowercase with underscores
- Use number ranges to read related sections
