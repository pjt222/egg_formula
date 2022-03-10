engine_definition_brain <<- paste0(
  c(
    "
    
    <h1 style='color: black;'>Welcome to <em>eggplotr</em></h1>
    <p style='color: black;'>This app aimes to introduce and vizualise the 'egg-formula' presented in <em>Egg and math: introducing a universal formula for egg shape</em> by Valeriy G. Narushin, Michael N. Romanov and Darren K. Griffin (<a href='https://doi.org/10.1111/nyas.14680' style='color: black;' target='_blank' title='Egg and math: introducing a universal formula for egg shape' rel='noopener'>https://doi.org/10.1111/nyas.14680</a>).</p>
    <h2 style='color: black;'>egg-formula</h2>
    ",
    ### formula
    paste0("$$",
           "y=\\pm\\frac{B}{2}\\sqrt{\\frac{L^2-4x^2}{L^2+8wx+4w^2}}\\times\\\\\\left(1-\\frac{\\sqrt{5.5L^2+11Lw+4w^2}\\times\\left(\\sqrt{3}BL-2D_{\\frac{L}{4}}\\sqrt{L^2+2wL+4w^2}\\right)}{\\sqrt{3}BL\\left(\\sqrt{5.5L^2+11Lw+4w^2}-2\\sqrt{L^2+2wL+4w^2}\\right)}\\times\\\\\\left(1-\\sqrt{\\frac{L(L^2+8wx+4w^2)}{2(L-2w)x^2+(L^2+8Lw-4w^2)x+2Lw^2+L^2w+L^3}}\\right)\\right)",
           "$$"),
    ###
    "
    <h2 style='color: black;'>Parameters</h2>
    <h3 style='color: black;'>$$L$$</h3>
    <h3 style='color: black;'>$$w$$</h3>
    <h3 style='color: black;'>$$B$$</h3>
    <h3 style='color: black;'>$$D_{\\frac{L}{4}}$$</h3>
    <h2 style='color: black;'>Parameters: internal</h2>
    <h3 style='color: black;'>$$seq01$$</h3>
    <h3 style='color: black;'>$$seq02$$</h3>
    <h2 style='color: black;'>engines</h2>
    <p style='color: black;'><strong></strong>There are currently four engines implemented to choose from.</p>
    <h3 style='color: black;'>b.r.a.i.n.</h3>
    <p style='color: black;'>The first ist the the <em>b.r.a.i.n.</em> engine (<strong>b</strong>iological <strong>r</strong>einforced <strong>a</strong>rtificial <strong>i</strong>ntelligence <strong>n</strong>etwork) wich is owned by every human, but used by less. To use this engine in conjuction with eggplotr just set <em>savant_mode=true&nbsp;</em>and use the preceding formula and explanation to visualize the result with your inner eye.</p>
    <h3 style='color: black;'>rgl and rgl_persp</h3>
    <p style='color: black;'>The second ('rgl') and third ('rgl_persp') both are based on the R-package <a href='https://dmurdoch.github.io/rgl/' style='color: black;'><em>rgl</em></a> and use the function <em>plot3d</em> to create a 3d scatterplot or the functions <em>shade3d</em>, <em>turn3d</em> an <em>material3d</em> to create an 3d surface plot.</p>
    <h3 style='color: black;'>threejs</h3>
    <p style='color: black;'>The fourth is based on the R-package <em><a href='https://cran.r-project.org/web/packages/threejs/threejs.pdf' style='color: black;'>threejs</a>&nbsp;</em>and the function <em>scatterplot3js</em> to create an scatterplot.</p>
    "
  ),
  sep = "<br>"
)
