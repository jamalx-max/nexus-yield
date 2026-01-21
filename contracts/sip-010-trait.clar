;; title: sip-010-trait
;; version: 1.0.0
;; summary: SIP-010 Fungible Token Standard Trait
;; description: Standard trait definition for fungible tokens on Stacks

;; traits
;;

;; SIP-010 Fungible Token Trait
(define-trait sip-010-trait
  (
    ;; Transfer tokens from sender to recipient
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))
    
    ;; Get the human-readable name of the token
    (get-name () (response (string-ascii 32) uint))
    
    ;; Get the ticker symbol
    (get-symbol () (response (string-ascii 32) uint))
    
    ;; Get the number of decimals
    (get-decimals () (response uint uint))
    
    ;; Get the balance of a principal
    (get-balance (principal) (response uint uint))
    
    ;; Get total supply
    (get-total-supply () (response uint uint))
    
    ;; Get token URI for metadata
    (get-token-uri () (response (optional (string-utf8 256)) uint))
  )
)
