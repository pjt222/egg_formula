L <- 5 # Eilänge
w <- 4 # maximalen Breite
B <- 1 # Abstand zwischen dem Bereich der maximalen Breite und der halben Länge des Eies
DL4 <- 2 # Eidurchmesser (ein Viertel der Eilänge vom spitzen Ende entfernt)



Term1 <- function(x, ...) {
  # TODO mind + -
  B / 2 * ((L^2 - 4 * x^2) / (L^2 + 8 * w * x + 4 * w^2))^.5
}

Term21 <- function(x, ...) {
  (
    (55*L^2 + 11 * L * w + 4 * w^2)^.5 * (3^.5 * B * L - 2 * DL4 * (L^2 + 2 * w * L + 4 * w^2)^.5)
  ) /
    (
      3^.5 * B * L * ((5.5 * L^2 + 11 * L * w + 4 * w^2)^.5 - 2 * (L^2 + 2 * w * L + 4 * w^2)^.5)
    )
}
Term22 <- function(x, ...) {
  1 - (
    (
      L * (L^2 + 8 * w * x + 4 * w^2)
    ) /
      (
        2 * (L - 2 * w) * x^2 + (L^2 + 8 * L * w - 4 * w^2) * x + 2 * L * w^2 + L^2 * w + L^3)
  )^.5
}

Term2 <- 1 - Term21(seq(1, 2, by = .1)) * Term22(seq(1, 2, by = .1))

res <- Term1(seq(1, 2, by = .1)) * Term2

plot(x= seq(1, 2, by = .1), y = res)
