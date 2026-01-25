import requests
import json

try:
    print("Fetching yields data...")
    response = requests.get("https://yields.llama.fi/pools", timeout=30)
    response.raise_for_status()
    data = response.json()
    
    print(f"Total pools: {len(data['data'])}")
    
    # Filter for Ethereum USDC on Aave/Compound
    eth_usdc = []
    stacks_pools = []
    
    for pool in data['data']:
        chain = pool.get('chain')
        symbol = pool.get('symbol')
        project = pool.get('project')
        
        # Ethereum USDC
        if chain == 'Ethereum' and symbol == 'USDC':
            if 'aave-v3' in project.lower() or 'compound-v3' in project.lower():
                eth_usdc.append(pool)
        
        # Stacks Pools (Check chain or project)
        if chain == 'Stacks' or 'zest' in project.lower() or 'bitflow' in project.lower():
            stacks_pools.append(pool)

    print("\n--- Ethereum USDC Yields ---")
    for p in eth_usdc[:5]:
        print(f"Project: {p['project']}, Symbol: {p['symbol']}, APY: {p['apy']}%, TVL: ${p['tvlUsd']:,.2f}")

    print("\n--- Stacks Yields ---")
    for p in stacks_pools:
        print(f"Project: {p['project']}, Chain: {p['chain']}, Symbol: {p['symbol']}, APY: {p['apy']}%, TVL: ${p['tvlUsd']:,.2f}")

except Exception as e:
    print(f"Error: {e}")
