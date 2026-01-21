;; Mock USDCx for Apex Yield Testing
(impl-trait .sip-010-trait.sip-010-trait)

(define-fungible-token usdcx)

(define-constant err-not-token-owner (err u101))

(define-public (mint (amount uint) (recipient principal))
  (begin
    (ft-mint? usdcx amount recipient)
  )
)

;; SIP-010 Standard

(define-read-only (get-name)
  (ok "USDCx")
)

(define-read-only (get-symbol)
  (ok "USDCx")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance usdcx who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply usdcx))
)

(define-read-only (get-token-uri)
  (ok none)
)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (try! (ft-transfer? usdcx amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)
