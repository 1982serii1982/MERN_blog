import { createTheme } from "@mui/material";

export const colorTokens = {
  primary: {
    50: "#f3e5f5",
    100: "#e1bee7",
    200: "#ce93d8",
    300: "#ba68c8",
    400: "#ab47bc",
    500: "#9c27b0",
    600: "#8e24aa",
    700: "#7b1fa2",
    800: "#6a1b9a",
    900: "#4a148c",
  },
  complementary: {
    50: "#f2f8e7",
    100: "#deedc3",
    200: "#c9e19c",
    300: "#b2d574",
    400: "#a1cc53",
    500: "#90c331",
    600: "#80b429",
    700: "#6ba01e",
    800: "#568c14",
    900: "#2f6a00",
  },
};

// mui theme settings
export const themeSettings = (mode) => {
  //aici are loc crearea temei noastre customizate, care va fi apoi pusa in themeprovider
  //ne rescriind tema de default(in paralel noi putem folosi si variabile din tema de default ex: color="primary.light" dar
  //unde dorim sa folosim tema noastra vom scrie color=theme.palette.primary.light).
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              dark: colorTokens.primary[200],
              main: colorTokens.primary[500],
              light: colorTokens.primary[800],
            },
          }
        : {
            // palette values for light mode
            primary: {
              dark_dark: colorTokens.primary[900],
              dark: colorTokens.primary[800],
              dark_light: colorTokens.primary[700],
              main_dark: colorTokens.primary[600],
              main: colorTokens.primary[500],
              main_light: colorTokens.primary[400],
              light_dark: colorTokens.primary[300],
              light: colorTokens.primary[200],
              light_light: colorTokens.primary[100],
              light_xlight: colorTokens.primary[50],
            },
            complementary: {
              dark_dark: colorTokens.complementary[900],
              dark: colorTokens.complementary[800],
              dark_light: colorTokens.complementary[700],
              main_dark: colorTokens.complementary[600],
              main: colorTokens.complementary[500],
              main_light: colorTokens.complementary[400],
              light_dark: colorTokens.complementary[300],
              light: colorTokens.complementary[200],
              light_light: colorTokens.complementary[100],
              light_xlight: colorTokens.complementary[50],
            },
          }),
    },
    breakpoints: {
      keys: ["xs", "sm", "md", "lg", "xl", "xxl"],
      values: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400,
      },
    },
  };
};
