import { ProductOverviewCard } from "@/components/sections/ProductOverviewCard";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import type { ProductCategory } from "@/data/homepage";

interface CategorySectionProps {
  category: ProductCategory;
  categoryIndex: number;
}

const accentBorderMap = {
  blue: "border-accent-blue",
  emerald: "border-accent-emerald",
  amber: "border-accent-amber",
};

export function CategorySection({ category, categoryIndex }: CategorySectionProps) {
  const gridCols =
    category.products.length === 1 ? "md:grid-cols-1 max-w-2xl" : "md:grid-cols-2";

  return (
    <div id={category.id}>
      <AnimateOnScroll delay={categoryIndex * 0.1}>
        <div className={`border-l-2 ${accentBorderMap[category.accentColor]} pl-6 mb-8`}>
          <h3 className="text-2xl font-bold text-text-primary sm:text-3xl">
            {category.category}
          </h3>
          <p className="mt-2 text-text-secondary max-w-2xl">
            {category.description}
          </p>
        </div>
      </AnimateOnScroll>

      <div className={`grid gap-8 ${gridCols}`}>
        {category.products.map((product, i) => (
          <ProductOverviewCard
            key={product.title}
            {...product}
            index={categoryIndex * 2 + i}
          />
        ))}
      </div>
    </div>
  );
}
