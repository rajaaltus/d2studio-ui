// The registry ships registry/default/ui/pixel-spinner.tsx, which installs to
// this path in a consumer project. In-repo, the generated spinner-* registry
// components import from here, so alias it to the app's own implementation
// rather than keeping a second copy in sync.
export * from "@/components/pixel-spinner";
