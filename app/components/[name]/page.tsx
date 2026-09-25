import { ItemPage, shelfMetadata, shelfParams } from "@/components/blocks/item-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return shelfParams("components");
}

export function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  return shelfMetadata(params);
}

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  return <ItemPage name={(await params).name} shelf="components" />;
}
