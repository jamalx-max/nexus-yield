;; title: mock-usdcx
;; version: 1.0.0
;; summary: Mock USDCx Token for Testing
;; description: A mock implementation of the USDCx token for local development and testing

;; traits
(impl-trait .sip-010-trait.sip-010-trait)

;; token definitions
(define-fungible-token usdcx)

;; constants
(define-constant ERR-NOT-TOKEN-OWNER (err u101))
(define-constant ERR-INSUFFICIENT-BALANCE (err u102))
(define-constant ERR-INVALID-AMOUNT (err u103))
(define-constant ERR-UNAUTHORIZED (err u104))
(define-constant ERR-ALREADY-APPROVED (err u105))
(define-constant ERR-APPROVAL-NOT-FOUND (err u106))

;; data vars
(define-data-var token-name (string-ascii 32) "USDCx")
(define-data-var token-symbol (string-ascii 10) "USDCx")
(define-data-var token-decimals uint u6)
(define-data-var token-uri (optional (string-utf8 256)) none)
(define-data-var paused bool false)
(define-data-var minter-role principal tx-sender)

;; data maps
;; Track allowances (approvals)
(define-map allowances
  { owner: principal, spender: principal }
  { amount: uint }
)

;; Track blacklisted addresses
(define-map blacklist
  { address: principal }
  { blocked: bool }
)

;; Track minting events for testing
(define-map mint-events
  { id: uint }
  {
    recipient: principal,
    amount: uint,
    timestamp: uint,
    tx-sender: principal
  }
)
(define-data-var mint-event-counter uint u0)

;; Track transfer events for testing
(define-map transfer-events
  { id: uint }
  {
    sender: principal,
    recipient: principal,
    amount: uint,
    memo: (optional (buff 34)),
    timestamp: uint
  }
)
(define-data-var transfer-event-counter uint u0)

;; Track burn events for testing
(define-map burn-events
  { id: uint }
  {
    burner: principal,
    amount: uint,
    timestamp: uint
  }
)
(define-data-var burn-event-counter uint u0)

;; public functions
;;

;; Mint tokens (for testing only)
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (is-eq tx-sender (var-get minter-role)) ERR-UNAUTHORIZED)
    (asserts! (not (var-get paused)) ERR-UNAUTHORIZED)
    (asserts! (is-none (map-get? blacklist { address: recipient })) ERR-UNAUTHORIZED)
    
    (try! (ft-mint? usdcx amount recipient))
    
    ;; Record mint event
    (let ((event-id (+ (var-get mint-event-counter) u1)))
      (map-set mint-events { id: event-id } {
        recipient: recipient,
        amount: amount,
        timestamp: block-height,
        tx-sender: tx-sender
      })
      (var-set mint-event-counter event-id)
    )
    
    (print {
      event: "mint",
      amount: amount,
      recipient: recipient,
      timestamp: block-height
    })
    
    (ok true)
  )
)

;; Burn tokens
(define-public (burn (amount uint))
  (begin
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (>= (ft-get-balance usdcx tx-sender) amount) ERR-INSUFFICIENT-BALANCE)
    (asserts! (not (var-get paused)) ERR-UNAUTHORIZED)
    
    (try! (ft-burn? usdcx amount tx-sender))
    
    ;; Record burn event
    (let ((event-id (+ (var-get burn-event-counter) u1)))
      (map-set burn-events { id: event-id } {
        burner: tx-sender,
        amount: amount,
        timestamp: block-height
      })
      (var-set burn-event-counter event-id)
    )
    
    (print {
      event: "burn",
      amount: amount,
      burner: tx-sender,
      timestamp: block-height
    })
    
    (ok true)
  )
)

;; Approve spender to spend tokens on behalf of owner
(define-public (approve (spender principal) (amount uint))
  (begin
    (asserts! (not (var-get paused)) ERR-UNAUTHORIZED)
    (asserts! (>= (ft-get-balance usdcx tx-sender) amount) ERR-INSUFFICIENT-BALANCE)
    
    (map-set allowances 
      { owner: tx-sender, spender: spender } 
      { amount: amount }
    )
    
    (print {
      event: "approve",
      owner: tx-sender,
      spender: spender,
      amount: amount,
      timestamp: block-height
    })
    
    (ok true)
  )
)

;; Transfer from approved spender
(define-public (transfer-from (sender principal) (recipient principal) (amount uint))
  (let (
    (allowance (default-to { amount: u0 } 
      (map-get? allowances { owner: sender, spender: tx-sender })))
  )
    (begin
      (asserts! (not (var-get paused)) ERR-UNAUTHORIZED)
      (asserts! (>= (get amount allowance) amount) ERR-INSUFFICIENT-BALANCE)
      (asserts! (is-none (map-get? blacklist { address: sender })) ERR-UNAUTHORIZED)
      (asserts! (is-none (map-get? blacklist { address: recipient })) ERR-UNAUTHORIZED)
      
      (try! (ft-transfer? usdcx amount sender recipient))
      
      ;; Update allowance
      (map-set allowances { owner: sender, spender: tx-sender } {
        amount: (- (get amount allowance) amount)
      })
      
      (print {
        event: "transfer-from",
        from: sender,
        to: recipient,
        amount: amount,
        spender: tx-sender,
        timestamp: block-height
      })
      
      (ok true)
    )
  )
)

;; Increase allowance
(define-public (increase-allowance (spender principal) (amount uint))
  (let (
    (current (default-to { amount: u0 } 
      (map-get? allowances { owner: tx-sender, spender: spender })))
  )
    (begin
      (asserts! (not (var-get paused)) ERR-UNAUTHORIZED)
      (asserts! (>= (ft-get-balance usdcx tx-sender) (+ (get amount current) amount)) 
        ERR-INSUFFICIENT-BALANCE)
      
      (map-set allowances { owner: tx-sender, spender: spender } {
        amount: (+ (get amount current) amount)
      })
      
      (print {
        event: "increase-allowance",
        spender: spender,
        increase: amount,
        new-amount: (+ (get amount current) amount),
        timestamp: block-height
      })
      
      (ok true)
    )
  )
)

;; Decrease allowance
(define-public (decrease-allowance (spender principal) (amount uint))
  (let (
    (current (default-to { amount: u0 } 
      (map-get? allowances { owner: tx-sender, spender: spender })))
    (new-amount (if (>= (get amount current) amount)
                  (- (get amount current) amount)
                  u0))
  )
    (begin
      (asserts! (not (var-get paused)) ERR-UNAUTHORIZED)
      
      (map-set allowances { owner: tx-sender, spender: spender } {
        amount: new-amount
      })
      
      (print {
        event: "decrease-allowance",
        spender: spender,
        decrease: amount,
        new-amount: new-amount,
        timestamp: block-height
      })
      
      (ok true)
    )
  )
)

;; SIP-010: Transfer
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-TOKEN-OWNER)
    (asserts! (not (var-get paused)) ERR-UNAUTHORIZED)
    (asserts! (is-none (map-get? blacklist { address: sender })) ERR-UNAUTHORIZED)
    (asserts! (is-none (map-get? blacklist { address: recipient })) ERR-UNAUTHORIZED)
    (asserts! (>= (ft-get-balance usdcx sender) amount) ERR-INSUFFICIENT-BALANCE)
    
    (try! (ft-transfer? usdcx amount sender recipient))
    
    ;; Record transfer event
    (let ((event-id (+ (var-get transfer-event-counter) u1)))
      (map-set transfer-events { id: event-id } {
        sender: sender,
        recipient: recipient,
        amount: amount,
        memo: memo,
        timestamp: block-height
      })
      (var-set transfer-event-counter event-id)
    )
    
    (match memo to-print (print to-print) 0x)
    
    (print {
      event: "transfer",
      from: sender,
      to: recipient,
      amount: amount,
      timestamp: block-height
    })
    
    (ok true)
  )
)

;; Admin functions
;;

;; Set paused state (emergency stop)
(define-public (set-paused (state bool))
  (begin
    (asserts! (is-eq tx-sender (var-get minter-role)) ERR-UNAUTHORIZED)
    (var-set paused state)
    (print {
      event: "pause",
      state: state,
      timestamp: block-height
    })
    (ok state)
  )
)

;; Add to blacklist
(define-public (blacklist-address (address principal))
  (begin
    (asserts! (is-eq tx-sender (var-get minter-role)) ERR-UNAUTHORIZED)
    (map-set blacklist { address: address } { blocked: true })
    (print {
      event: "blacklist",
      address: address,
      action: "added",
      timestamp: block-height
    })
    (ok true)
  )
)

;; Remove from blacklist
(define-public (unblacklist-address (address principal))
  (begin
    (asserts! (is-eq tx-sender (var-get minter-role)) ERR-UNAUTHORIZED)
    (map-delete blacklist { address: address })
    (print {
      event: "blacklist",
      address: address,
      action: "removed",
      timestamp: block-height
    })
    (ok true)
  )
)

;; Transfer minter role
(define-public (transfer-minter-role (new-minter principal))
  (begin
    (asserts! (is-eq tx-sender (var-get minter-role)) ERR-UNAUTHORIZED)
    (var-set minter-role new-minter)
    (print {
      event: "minter-role-transferred",
      old-minter: tx-sender,
      new-minter: new-minter,
      timestamp: block-height
    })
    (ok true)
  )
)

;; Set token metadata
(define-public (set-metadata 
  (name (string-ascii 32)) 
  (symbol (string-ascii 10)) 
  (decimals uint)
  (uri (optional (string-utf8 256)))
)
  (begin
    (asserts! (is-eq tx-sender (var-get minter-role)) ERR-UNAUTHORIZED)
    (var-set token-name name)
    (var-set token-symbol symbol)
    (var-set token-decimals decimals)
    (var-set token-uri uri)
    (print {
      event: "metadata-updated",
      name: name,
      symbol: symbol,
      decimals: decimals,
      timestamp: block-height
    })
    (ok true)
  )
)

;; Batch mint
(define-public (batch-mint (recipients (list 10 principal)) (amounts (list 10 uint)))
  (begin
    (asserts! (is-eq (len recipients) (len amounts)) ERR-INVALID-AMOUNT)
    (asserts! (is-eq tx-sender (var-get minter-role)) ERR-UNAUTHORIZED)
    (asserts! (not (var-get paused)) ERR-UNAUTHORIZED)
    
    (fold batch-mint-helper 
      (zip recipients amounts) 
      { success: true, index: u0 }
    )
    
    (print {
      event: "batch-mint",
      count: (len recipients),
      timestamp: block-height
    })
    
    (ok true)
  )
)

;; Helper for batch mint
(define-private (batch-mint-helper 
  (item { recipient: principal, amount: uint })
  (acc { success: bool, index: uint })
)
  (if (get success acc)
    (begin
      (unwrap! (ft-mint? usdcx (get amount item) (get recipient item)) (err false))
      { success: true, index: (+ (get index acc) u1) }
    )
    acc
  )
)

;; read only functions
;;

;; SIP-010: Get name
(define-read-only (get-name)
  (ok (var-get token-name))
)

;; SIP-010: Get symbol
(define-read-only (get-symbol)
  (ok (var-get token-symbol))
)

;; SIP-010: Get decimals
(define-read-only (get-decimals)
  (ok (var-get token-decimals))
)

;; SIP-010: Get balance
(define-read-only (get-balance (who principal))
  (ok (ft-get-balance usdcx who))
)

;; SIP-010: Get total supply
(define-read-only (get-total-supply)
  (ok (ft-get-supply usdcx))
)

;; SIP-010: Get token URI
(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

;; Get allowance
(define-read-only (get-allowance (owner principal) (spender principal))
  (ok (default-to { amount: u0 } 
    (map-get? allowances { owner: owner, spender: spender })))
)

;; Check if address is blacklisted
(define-read-only (is-blacklisted (address principal))
  (is-some (map-get? blacklist { address: address }))
)

;; Get paused state
(define-read-only (is-paused)
  (var-get paused)
)

;; Get minter role
(define-read-only (get-minter-role)
  (var-get minter-role)
)

;; Get mint event
(define-read-only (get-mint-event (id uint))
  (map-get? mint-events { id: id })
)

;; Get transfer event
(define-read-only (get-transfer-event (id uint))
  (map-get? transfer-events { id: id })
)

;; Get burn event
(define-read-only (get-burn-event (id uint))
  (map-get? burn-events { id: id })
)

;; Get mint event count
(define-read-only (get-mint-event-count)
  (var-get mint-event-counter)
)

;; Get transfer event count
(define-read-only (get-transfer-event-count)
  (var-get transfer-event-counter)
)

;; Get burn event count
(define-read-only (get-burn-event-count)
  (var-get burn-event-counter)
)

;; Helper function to zip two lists
(define-private (zip 
  (recipients (list 10 principal)) 
  (amounts (list 10 uint))
)
  (if (and (> (len recipients) u0) (> (len amounts) u0))
    (let (
      (recipient (unwrap-panic (element-at recipients u0)))
      (amount (unwrap-panic (element-at amounts u0)))
      (rest-recipients (unwrap-panic (as-max-len? (rest recipients) u9)))
      (rest-amounts (unwrap-panic (as-max-len? (rest amounts) u9)))
    )
      (if (> (len rest-recipients) u0)
        (concat 
          (list { recipient: recipient, amount: amount }) 
          (zip rest-recipients rest-amounts)
        )
        (list { recipient: recipient, amount: amount })
      )
    )
    (list)
  )
)

;; private functions
;;
