import Banner from "@/components/pages/landing_pages/Banner/Banner";
import Category from "@/components/pages/landing_pages/Category/Category";
import HomeProduct from "@/components/pages/landing_pages/HomeProduct/HomeProduct";
import { getBestDealProducts, getBestSellerProducts, getPopularProducts } from "@/services/products";
import Campaign from "@/components/pages/landing_pages/Campaign/Campaign";
import { getCampaign } from "@/services/campaign";
export const dynamic = "force-dynamic";

const page = async () => {


  const bestSellerRes = await getBestSellerProducts();
  const bestDealRes = await getBestDealProducts();
  const popularRes = await getPopularProducts();

  // ------for campaign----
  const campaign = await getCampaign();

  return (
    <>
      <div className="Container">
        <Banner banners={[]} />
        <Category />

        {/*  Best Deal */}
        {bestDealRes?.data?.length > 0 && (
          <HomeProduct
            title="Best Deals"
            products={bestDealRes.data}
            type="bestDeal"
          />
        )}

        {/*  Best Seller */}
        {bestSellerRes?.data?.length > 0 && (
          <HomeProduct
            title="Best Sellers"
            products={bestSellerRes.data}
            type="bestSeller"
          />
        )}

        {/*  Popular */}
        {popularRes?.data?.length > 0 && (
          <HomeProduct
            title="Popular Products"
            products={popularRes.data}
            type="popular"
          />
        )}

        {/* {campaign && campaign.length > 0 && <Campaign campaign={campaign[0]} />} */}

        <Campaign campaign={campaign[0]} />

      </div>
    </>
  );
};

export default page;
