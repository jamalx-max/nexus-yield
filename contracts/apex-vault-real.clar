;; title: apex-vault-real
;; version: 2.0.0
;; summary: Apex Yield Vault - Yield-bearing vault for USDCx
;; description: A DeFi vault that accepts USDCx deposits and issues apUSDCx share tokens.
;;              Implements block-based yield simulation for demo purposes.
;;              Integrates with the official Circle USDCx token on Stacks.
;;              Written for Clarity 4 with asset restriction safety.

;; traits
;;
(impl-trait .sip-010-trait.sip-010-trait)

;; token definitions
;;
(define-fungible-token ap-usdcx)

;; constants
;;
(define-constant ERR-ZERO-AMOUNT (err u1001))
(define-constant ERR-NOT-TOKEN-OWNER (err u100))

;; USDCx token contract (official Circle deployment on Stacks Testnet)
(define-constant USDCX-CONTRACT 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx)

;; Yield parameters: 10 basis points per 100 blocks (~13.5% APY at 10min blocks)
;; NOTE: This is simulated yield for demo. Production would integrate with Zest/Bitflow.
(define-constant YIELD-RATE-BPS u10)
(define-constant BLOCKS-PER-ACCRUE u100)

;; data vars
;;
(define-data-var total-assets uint u0)
(define-data-var last-accrue-block uint stacks-block-height)

;; data maps
;;

;; private functions
;;

;; Accrue yield based on elapsed blocks
(define-private (accrue-yield-internal)
  (let (
    (current-block stacks-block-height)
    (last-block (var-get last-accrue-block))
    (blocks-elapsed (- current-block last-block))
    (periods (/ blocks-elapsed BLOCKS-PER-ACCRUE))
  )
    (if (> periods u0)
      (let (
        (assets (var-get total-assets))
        ;; Yield = assets * periods * YIELD-RATE-BPS / 10000
        (yield-amount (/ (* assets (* periods YIELD-RATE-BPS)) u10000))
      )
        (var-set total-assets (+ assets yield-amount))
        (var-set last-accrue-block current-block)
        true
      )
      false
    )
  )
)

;; read only functions
;;

;; Get total assets in vault
(define-read-only (get-total-assets)
  (var-get total-assets)
)

;; Get current exchange rate (assets per share, 6 decimals)
(define-read-only (get-exchange-rate)
  (let ((supply (ft-get-supply ap-usdcx)))
    (if (is-eq supply u0)
      u1000000 ;; 1.0 with 6 decimals
      (/ (* (var-get total-assets) u1000000) supply)
    )
  )
)

;; Preview shares received for deposit amount
(define-read-only (preview-deposit (amount uint))
  (let ((supply (ft-get-supply ap-usdcx)))
    (if (is-eq supply u0)
      amount
      (/ (* amount supply) (var-get total-assets))
    )
  )
)

;; Preview assets received for share amount
(define-read-only (preview-withdraw (shares uint))
  (let ((supply (ft-get-supply ap-usdcx)))
    (if (is-eq supply u0)
      u0
      (/ (* shares (var-get total-assets)) supply)
    )
  )
)

;; Get last accrue block
(define-read-only (get-last-accrue-block)
  (var-get last-accrue-block)
)

;; Get contract principal (Clarity 4)
(define-read-only (get-vault-principal)
  current-contract
)

;; SIP-010: Get name
(define-read-only (get-name)
  (ok "Apex Yield USDC")
)

;; SIP-010: Get symbol
(define-read-only (get-symbol)
  (ok "apUSDCx")
)

;; SIP-010: Get decimals
(define-read-only (get-decimals)
  (ok u6)
)

;; SIP-010: Get balance
(define-read-only (get-balance (who principal))
  (ok (ft-get-balance ap-usdcx who))
)

;; SIP-010: Get total supply
(define-read-only (get-total-supply)
  (ok (ft-get-supply ap-usdcx))
)

;; SIP-010: Get token URI
(define-read-only (get-token-uri)
  (ok none)
)

;; public functions
;;

;; Deposit USDCx and receive apUSDCx shares
;; Uses the official Circle USDCx token deployed at ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx
(define-public (deposit (amount uint))
  (let (
    (shares (preview-deposit amount))
    (sender tx-sender)
    (vault-principal current-contract)
  )
    (begin (accrue-yield-internal))
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    
    ;; Transfer USDCx from user to vault (using real Circle USDCx token)
    (try! (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx transfer amount sender vault-principal none))
    
    ;; Mint shares to user
    (try! (ft-mint? ap-usdcx shares sender))
    
    ;; Update total assets
    (var-set total-assets (+ (var-get total-assets) amount))
    
    (print { event: "deposit", amount: amount, shares: shares, user: sender })
    (ok shares)
  )
)

;; Withdraw USDCx by burning apUSDCx shares
;; Uses Clarity 4 as-contract? with explicit asset allowances for security
(define-public (withdraw (shares uint))
  (let (
    (assets (preview-withdraw shares))
    (sender tx-sender)
  )
    (begin (accrue-yield-internal))
    (asserts! (> shares u0) ERR-ZERO-AMOUNT)
    
    ;; Burn shares from user
    (try! (ft-burn? ap-usdcx shares sender))
    
    ;; Transfer USDCx from vault to user using Clarity 4 as-contract? with FT allowance
    ;; Uses the real Circle USDCx token
    (try! (as-contract? 
      ((with-ft 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx "usdcx" assets))
      (unwrap-panic (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx transfer assets tx-sender sender none))
    ))
    
    ;; Update total assets
    (var-set total-assets (- (var-get total-assets) assets))
    
    (print { event: "withdraw", amount: assets, shares: shares, user: sender })
    (ok assets)
  )
)

;; Manually trigger yield accrual (for demo/testing)
(define-public (harvest)
  (ok (accrue-yield-internal))
)

;; SIP-010: Transfer shares between users
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-TOKEN-OWNER)
    (try! (ft-transfer? ap-usdcx amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)
