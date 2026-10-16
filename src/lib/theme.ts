export const THEME_STORAGE_KEY = "theme";

/**
 * Script inline exécuté dans le `<head>` avant le premier rendu : applique le
 * choix enregistré, sinon la préférence du navigateur. Évite tout flash de
 * mauvais thème sans rendre les pages dynamiques.
 */
export const themeInitScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}`;
