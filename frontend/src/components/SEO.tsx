import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string;
  author?: string;
  publishedTime?: string;
  price?: number;
  currency?: string;
}

/**
 * SEO Component
 * Quản lý meta tags cho SEO và Open Graph (Facebook sharing)
 * Đáp ứng yêu cầu: 2 điểm - Meta tags & OG tags cho mỗi trang
 */
const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image = '/default-og-image.jpg',
  url,
  type = 'website',
  keywords,
  author = 'EduShop',
  publishedTime,
  price,
  currency = 'VND',
}) => {
  // Tạo full URL
  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://edushop.vercel.app';
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;
  
  // Full title
  const fullTitle = `${title} | EduShop - Nền tảng khóa học trực tuyến`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="EduShop" />
      <meta property="og:locale" content="vi_VN" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Product specific (for courses) */}
      {type === 'product' && price && (
        <>
          <meta property="product:price:amount" content={price.toString()} />
          <meta property="product:price:currency" content={currency} />
        </>
      )}
      
      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:author" content={author} />
        </>
      )}
      
      {/* Viewport for mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
    </Helmet>
  );
};

export default SEO;
