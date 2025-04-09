export function useThemeCssVars() {
  const setCssVars = ({
    themeId = 'theme-vars',
    lightVars,
    darkVars,
  }: {
    themeId?: string
    lightVars: Record<string, string | undefined>
    darkVars?: Record<string, string | undefined>
  }) => {
    if (!document) return // no document in ssr

    const toCssVars = (vars: Record<string, string | undefined>) =>
      Object.entries(vars)
        .filter(([, val]) => val)
        .map(([key, val]) => `  --${key}: #${val};`)
        .join('\n')

    let styleEl = document.getElementById(themeId) as HTMLStyleElement | null

    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = themeId
      document.head.appendChild(styleEl)
    }

    const lightCss = toCssVars(lightVars)
    const darkCss = darkVars ? toCssVars(darkVars) : ''

    styleEl.innerHTML = `:root {${lightCss}} \n html.dark {${darkCss}}`.trim()
  }

  return {
    setCssVars,
  }
}
