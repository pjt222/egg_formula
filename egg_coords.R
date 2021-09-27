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
    (5.5*L^2 + 11 * L * w + 4 * w^2)^.5 * (3^.5 * B * L - 2 * DL4 * (L^2 + 2 * w * L + 4 * w^2)^.5)
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

x <- seq(0, 4, by = .1)
y <- seq(0, 4, by = .1)

Term2 <- 1 - Term21(x) * Term22(x)

res <- Term1(x) * Term2
z <- res
# plot(x= x, y = y)

rgl::plot3d(
  x = c(-x, x),
  y = c(-x, x),
  z = c(z,z),
  col = rainbow(1000)
)
