"use client";

import { ComponentWithCode } from "@/components/showcase/component-with-code";
import dynamic from "next/dynamic";
import registryData from "@/registry.json";

interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  categories?: string[];
}

interface FeaturedComponent {
  name: string;
  title: string;
  description: string;
  categories: string[];
}

// Get featured components from registry (marketing and pricing categories)
const getFeaturedComponents = (): FeaturedComponent[] => {
  return (registryData.items as RegistryItem[])
    .filter(
      (item) =>
        item.type === "registry:component" &&
        (item.categories?.includes("marketing") ||
          item.categories?.includes("pricing")),
    )
    .map((item) => ({
      name: item.name,
      title: item.title || item.name,
      description: item.description || "",
      categories: item.categories || [],
    }));
};

const featuredComponents = getFeaturedComponents();

// Dynamic imports for components
const componentMap = featuredComponents.reduce(
  (acc, item) => {
    acc[item.name] = dynamic(
      () => import(`@/registry/default/components/${item.name}`),
      {
        loading: () => (
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        ),
        ssr: true,
      },
    );
    return acc;
  },
  {} as Record<string, React.ComponentType>,
);

export function FeaturedComponents() {
  return (
    <section className="w-full">
      <div className="border-x mx-auto">
        <div className="space-y-16 mx-auto">
          {featuredComponents.map((item) => {
            const Component = componentMap[item.name];

            if (!Component) return null;

            return (
              <div key={item.name} className="space-y-8 screen-line-after">
                {/* Component Preview with Code */}
                <div className="w-full ">
                  <ComponentWithCode
                    componentName={item.name}
                    component={Component}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
