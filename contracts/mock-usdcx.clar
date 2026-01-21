;; title: mock-usdcx
;; version: 1.0.0
;; summary: Mock USDCx Token for Testing
;; description: A mock implementation of the USDCx token for local development and testing

;; traits
;;
(impl-trait .sip-010-trait.sip-010-trait)

;; token definitions
;;
(define-fungible-token usdcx)

;; constants
;;
(define-constant ERR-NOT-TOKEN-OWNER (err u101))

;; data vars
;;

;; data maps
;;

;; public functions
;;

;; Mint tokens (for testing only)
(define-public (mint (amount uint) (recipient principal))
  (ft-mint? usdcx amount recipient)
)

;; SIP-010: Transfer
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-TOKEN-OWNER)
    (try! (ft-transfer? usdcx amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

;; read only functions
;;

;; SIP-010: Get name
(define-read-only (get-name)
  (ok "USDCx")
)

;; SIP-010: Get symbol
(define-read-only (get-symbol)
  (ok "USDCx")
)

;; SIP-010: Get decimals
(define-read-only (get-decimals)
  (ok u6)
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
  (ok none)
)

;; private functions
;;
