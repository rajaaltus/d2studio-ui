const STORAGE_KEY = "theme";

export function ThemeFlashScript({
  defaultTheme = "dark",
}: {
  defaultTheme?: "light" | "dark" | "system";
}) {
  const code = `(function(){try{var d=document.documentElement;var s=localStorage.getItem('${STORAGE_KEY}')||'${defaultTheme}';var r=s==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):s;if(r==='dark')d.classList.add('dark');else d.classList.remove('dark');d.style.colorScheme=r;}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
