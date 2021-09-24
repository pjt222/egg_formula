L = 5 # Eilänge
w = 4 # maximalen Breite
B = 1 # Abstand zwischen dem Bereich der maximalen Breite und der halben Länge des Eies 
DL4 = 2 # Eidurchmesser (ein Viertel der Eilänge vom spitzen Ende entfernt)

Term1 <- function(x,...) {
  # TODO mind + - 
  B/2*((L^2-4*x^2)/(L^2+8*w*x+4*w^2))^.5
  }

Term21 <- function(x,...) {
  1 - (()^.5) /()
}
Term22 <- function(x,...) {
  1- (() / ())^.5
}

Term2 <- Term21 * Term22

res <- Term1 * Term2

Term1(seq(1, 2, by = .1))

