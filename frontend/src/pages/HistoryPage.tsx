import emptyHistory from "@/assets/history.svg";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/product/ProductCard";
import ProductCardMobile from "@/components/product/ProductCardMobile";
import ProductListCard from "@/components/product/ProductListCard";
import Button from "@/components/ui/Button";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useViewedProducts } from "@/hooks/useViewedProducts";
import clsx from "clsx";
import React, { useEffect, useState } from "react";

const HistoryPage: React.FC = () => {
  const { viewed, clearViewed } = useViewedProducts();
  const isMobile = useBreakpoint() === "mobile";
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="container mx-auto pb-6 md:py-6 md:px-4">
      {viewed.length > 0 && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-gray-100">
            Lịch sử đã xem
          </h1>
          <Button
            onClick={clearViewed}
            ghost
            className="text-red-600 hover:bg-red-700/20"
          >
            Xóa lịch sử
          </Button>
        </div>
      )}

      {viewed.length === 0 ? (
        <EmptyState
          imageSrc={emptyHistory}
          description="Bạn chưa xem sản phẩm nào."
        />
      ) : loading ? (
        <div
          className={clsx({
            "grid grid-cols-2 lg:grid-cols-3 gap-6": !isMobile,
            "space-y-2 flex flex-col": isMobile,
          })}
        >
          {Array.from({ length: 6 }).map((_, i) =>
            !isMobile ? (
              <ProductCard key={i} loading />
            ) : (
              <ProductListCard key={i} loading />
            )
          )}
        </div>
      ) : isMobile ? (
        <div className="space-y-4">
          {viewed.map((entry) => (
            <div key={entry.product.id} className="relative">
              <ProductListCard
                product={entry.product}
                onDetailClick={() => {}}
              />
              <div className="text-xs text-gray-500 mt-1 dark:text-gray-100">
                Xem {entry.viewedTimes} lần • lần cuối:{" "}
                {new Date(entry.lastViewedAt).toLocaleString("vi-VN")}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {viewed.map((entry) => (
            <div key={entry.product.id} className="relative">
              <ProductCardMobile
                product={entry.product}
                onDetailClick={() => {}}
              />
              <div className="text-xs text-gray-500 dark:text-gray-100">
                Xem {entry.viewedTimes} lần • lần cuối:{" "}
                {new Date(entry.lastViewedAt).toLocaleString("vi-VN")}
              </div>
            </div>
          ))}
        </div>
        // )(
        //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        //     {viewed.map((entry) => (
        //       <div key={entry.product.id} className="relative">
        //         <ProductListCard
        //           product={entry.product}
        //           onDetailClick={() => {}}
        //         />
        //         <div className="text-xs text-gray-500 mt-1">
        //           Xem {entry.viewedTimes} lần • lần cuối:{" "}
        //           {new Date(entry.lastViewedAt).toLocaleString("vi-VN")}
        //         </div>
        //       </div>
        //     ))}
        //   </div>
      )}
    </div>
  );
};

export default HistoryPage;
