;; Apex Yield Vault
;; A yield-bearing vault for USDCx on Stacks
;; Implements SIP-010 for the share token (apUSDCx)

(impl-trait .sip-010-trait.sip-010-trait)

;; Error codes
(define-constant ERR-ZERO-AMOUNT (err u1001))

;; Constants
;; Target: 10 bps per 100 blocks
(define-constant YIELD-RATE-BPS u10) 
(define-constant BLOCKS-PER-ACCRUE u100)

;; External Contracts
;; For local dev, we point to our mock. 
;; For testnet, we will swap this or use the real address if we deploy dependency.
;; Real Testnet: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx
;; Local: .mock-usdcx
;; Note: Using literal contract reference for compatibility

;; Token Definitions
(define-fungible-token ap-usdcx)

;; Data Vars
(define-data-var total-assets uint u0)
(define-data-var last-accrue-block uint u0)

;; Initialize
(begin
  (var-set last-accrue-block block-height)
)

;; --- Internal Logic ---

;; Accrue yield based on simulated time (returns nothing, just updates state)
(define-private (accrue-yield-internal)
  (let (
    (current-block block-height)
    (last-block (var-get last-accrue-block))
    (blocks-elapsed (- current-block last-block))
    (periods (/ blocks-elapsed BLOCKS-PER-ACCRUE))
  )
    (if (> periods u0)
      (let (
        (assets (var-get total-assets))
        ;; Yield = assets * periods * 10 / 10000
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

;; --- Read-Only Functions ---

(define-read-only (get-total-assets)
  (var-get total-assets)
)

(define-read-only (get-exchange-rate)
  (let ((supply (ft-get-supply ap-usdcx)))
    (if (is-eq supply u0)
      u1000000 ;; 1.0 (6 decimals)
      (/ (* (var-get total-assets) u1000000) supply)
    )
  )
)

(define-read-only (preview-deposit (amount uint))
  (let ((supply (ft-get-supply ap-usdcx)))
    (if (is-eq supply u0)
      amount
      (/ (* amount supply) (var-get total-assets))
    )
  )
)

(define-read-only (preview-withdraw (shares uint))
  (let ((supply (ft-get-supply ap-usdcx)))
    (if (is-eq supply u0)
      u0
      (/ (* shares (var-get total-assets)) supply)
    )
  )
)

(define-read-only (get-last-accrue-block)
  (var-get last-accrue-block)
)

;; --- Public Functions ---

(define-public (deposit (amount uint))
  (let (
    (shares (preview-deposit amount))
    (sender tx-sender)
  )
    (begin (accrue-yield-internal))
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    
    ;; Transfer USDCx from user to vault
    (try! (contract-call? .mock-usdcx transfer amount sender (as-contract tx-sender) none))
    
    ;; Mint shares to user
    (try! (ft-mint? ap-usdcx shares sender))
    
    ;; Update state
    (var-set total-assets (+ (var-get total-assets) amount))
    
    (print { event: "deposit", amount: amount, shares: shares, user: sender })
    (ok shares)
  )
)

(define-public (withdraw (shares uint))
  (let (
    (assets (preview-withdraw shares))
    (sender tx-sender)
  )
    (begin (accrue-yield-internal))
    (asserts! (> shares u0) ERR-ZERO-AMOUNT)
    
    ;; Burn shares
    (try! (ft-burn? ap-usdcx shares sender))
    
    ;; Transfer USDCx to user
    (try! (as-contract (contract-call? .mock-usdcx transfer assets tx-sender sender none)))
    
    ;; Update state
    (var-set total-assets (- (var-get total-assets) assets))
    
    (print { event: "withdraw", amount: assets, shares: shares, user: sender })
    (ok assets)
  )
)

;; Admin function to simulate yield accrual for demo
(define-public (harvest)
  (ok (accrue-yield-internal))
)

;; --- SIP-010 Implementation ---

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) (err u100))
    (try! (ft-transfer? ap-usdcx amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

(define-read-only (get-name)
  (ok "Apex Yield USDC")
)

(define-read-only (get-symbol)
  (ok "apUSDCx")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance ap-usdcx who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply ap-usdcx))
)

(define-read-only (get-token-uri)
  (ok none)
)
