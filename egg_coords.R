library(tidyverse)

L <- 8 # Eilänge
w <- 3.5 * 2 # maximalen Breite
B <- 1.7 * 2 # Abstand zwischen dem Bereich der maximalen Breite und der halben Länge des Eies
DL4 <- 3.3 *2 # Eidurchmesser (ein Viertel der Eilänge vom spitzen Ende entfernt)
x <- seq(-L / 2, L / 2, by = L * 0.01)

Term1 <- function(x, ...) {
  # TODO mind + -
  B / 2 * ((L^2 - 4 * x^2) / (L^2 + 8 * w * x + 4 * w^2))^.5
}

Term21 <- function(x, ...) {
  (
    (5.5 * L^2 + 11 * L * w + 4 * w^2)^.5 * (3^.5 * B * L - 2 * DL4 * (L^2 + 2 * w * L + 4 * w^2)^.5)
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
        2 * (L - 2 * w) * x^2 + (L^2 + 8 * L * w - 4 * w^2) * x + 2 * L * w^2 + L^2 * w + L^3
      )
  )^.5
}

Term2 <- 1 - Term21(x) * Term22(x)

res <- Term1(x) * Term2

egg_slice <- data.frame(
  x = x,
  y_p = res,
  y_n = -res
) %>%
  pivot_longer(
    cols = starts_with("y_"),
    names_to = "y_direction",
    values_to = "y"
  )

# TODO https://stackoverflow.com/questions/67236291/how-to-rotate-vector-time-series

rotx <- function(
  a # in radians, e.g. a = pi/4
  ) {
  # https://www.mathworks.com/help/phased/ref/rotx.html
  # Counterclockwise rotation around x-axis
  matrix(
    c(
      1,0,0,
      0,cos(a),-sin(a),
      0,sin(a),cos(a)
      ),
    nrow = 3,
    ncol = 3,
    byrow = TRUE
  )
}

egg_rotated <- lapply(1:NROW(egg_slice), function(es) {
  new_coords <- lapply(seq.default(0, 2, .25), function(theta) {
    rotated <- c(unname(unlist(egg_slice[es,c("x","y")])),0) * rotx(theta)
    
    data.frame(
      x = round(rowSums(rotated),2)[1],
      y = round(rowSums(rotated),2)[2],
      z = round(rowSums(rotated),2)[3],
      theta = theta
    )
  }
  )
  new_coords <- bind_rows(new_coords)
})

egg_rotated <- bind_rows(egg_rotated) %>% 
  select(-theta) %>% 
  distinct()




ggplot(
  data = egg_slice,
  aes(
    x = x,
    y = y,
    color = y_direction,
    fill = y_direction,
    alpha = .5
  )
) +
  geom_point() +
  scale_x_continuous(limits = c(-L / 2 - 1, L / 2 + 1)) +
  scale_y_continuous(limits = c(-L / 2 - 1, L / 2 + 1)) +
  scale_colour_viridis_d(guide = NULL) +
  scale_fill_viridis_d(guide = NULL) +
  scale_alpha(guide = NULL) +
  theme_dark()

rgl::plot3d(
  x = egg_rotated$x,#egg_slice$x,
  y = egg_rotated$y,#egg_slice$y,
  z = egg_rotated$z,#0,#sin(egg_slice$y*2*pi),
  col = "#696969" #rainbow(1000)
)
#
# y2 <- function(x,...) {
#   B/2*((L^2-4*x^2)/L)^.5*(
#     (65.22*(w/L)^2-4.57*w/L+0.4+(102.61*(w/L)^2-13.67*w/L-0.39)*x/L+(x/L)^2) /
#       (107.91*(w/L)^2 - 9.16*w/L + 0.49+(375.88*(w/L)^2-39.6*w/L+0.31)*x/L+(302.37*(w/L)^2-41.83*w/L+2.07)*(w/L)^2)
#   )^.5
#
# }
#
# y2s <- y2(seq(-L / 2, L / 2, by = .001))
#
# plot(x, y2s)
