"use client";

import { PreviewWrapper } from "@/components/preview/preview-wrapper";

// Featured component imports
import Comp010 from "@/registry/default/components/comp-010";
import Comp012 from "@/registry/default/components/comp-012";
import Comp020 from "@/registry/default/components/comp-020";

const featuredComponents = [
  {
    name: "comp-010",
    title: "Hero Section",
    description:
      "Modern hero section with gradient text and call-to-action buttons",
    component: Comp010,
    category: "marketing",
    tags: ["hero", "marketing", "landing"],
  },
  {
    name: "comp-012",
    title: "Pricing Table",
    description:
      "Three-tier pricing table with feature comparison and popular plan highlighting",
    component: Comp012,
    category: "marketing",
    tags: ["pricing", "marketing", "saas"],
  },
  {
    name: "comp-020",
    title: "Contact Form",
    description:
      "Comprehensive contact form with validation and contact information",
    component: Comp020,
    category: "forms",
    tags: ["form", "contact", "validation"],
  },
];

export function FeaturedComponents() {
  return (
    <section className="w-full">
      <div className="border-x  mx-auto">
        <div className="space-y-16  mx-auto">
          {featuredComponents.map((item) => {
            const Component = item.component;

            return (
              <div key={item.name} className="space-y-8  screen-line-after ">
                {/* Component Preview */}
                <div className="w-full">
                  <PreviewWrapper componentName={item.name} minHeight="500px">
                    <div className="origin-center  w-full">
                      <Component />
                    </div>
                  </PreviewWrapper>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
