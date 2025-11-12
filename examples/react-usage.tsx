/**
 * ⚠️ REFERENCE EXAMPLE ONLY - NOT EXECUTABLE IN THIS PROJECT
 *
 * React Example: Framework-agnostic usage in React
 * Works with React, Next.js, or any React-based framework
 *
 * TO USE THIS EXAMPLE IN YOUR REACT PROJECT:
 * ------------------------------------------
 * 1. Install dependencies:
 *    npm install react react-dom @types/react m-seo
 *
 * 2. Copy this code to your React project
 *
 * 3. The imports are already correct - just use as-is!
 *
 * This file shows how the library integrates with React.
 * The TypeScript errors here are expected since React is not
 * installed in the library project itself.
 */

// @ts-nocheck - This is a reference example, not compiled code
import React, { useEffect } from 'react';
import { SeoEngine, StructuredDataManager } from 'm-seo';

interface SeoHeadProps {
  title: string;
  description: string;
  image?: string;
  keywords?: string[];
}

/**
 * React component using framework-agnostic SEO core
 */
export function SeoHead({ title, description, image, keywords }: SeoHeadProps) {
  useEffect(() => {
    // Create SEO engine (framework-agnostic)
    const seo = new SeoEngine({
      title,
      description,
      ogImage: image,
      keywords,
      canonical: window.location.href
    });

    // Update document head
    const metaTags = seo.generateMetaTags();

    // Update title
    document.title = title;

    // Remove old meta tags
    document.querySelectorAll('meta[data-mseo]').forEach(el => el.remove());

    // Add new meta tags
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('data-mseo', 'true');

      if (tag.name) meta.setAttribute('name', tag.name);
      if (tag.property) meta.setAttribute('property', tag.property);
      meta.setAttribute('content', tag.content);

      document.head.appendChild(meta);
    });

    // Cleanup
    return () => {
      document.querySelectorAll('meta[data-mseo]').forEach(el => el.remove());
    };
  }, [title, description, image, keywords]);

  return null; // This component doesn't render anything
}

/**
 * Example usage in a React component
 */
export function HomePage() {
  return (
    <div>
      <SeoHead
        title="Home - My React App"
        description="Welcome to my React application"
        keywords={['react', 'seo', 'typescript']}
        image="https://example.com/home-og.jpg"
      />

      <h1>Home Page</h1>
      <p>SEO tags are managed by the framework-agnostic m-seo library!</p>
    </div>
  );
}

/**
 * Component with structured data
 */
export function BlogPost({ title, content, author, publishDate }: any) {
  useEffect(() => {
    const structuredData = new StructuredDataManager();

    structuredData.addArticle({
      headline: title,
      description: content.substring(0, 160),
      datePublished: publishDate,
      author: { name: author }
    });

    // Add JSON-LD script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(structuredData.toJson());
    script.setAttribute('data-mseo-ld', 'true');
    document.head.appendChild(script);

    return () => {
      document.querySelectorAll('script[data-mseo-ld]').forEach(el => el.remove());
    };
  }, [title, content, author, publishDate]);

  return (
    <article>
      <SeoHead
        title={`${title} - My Blog`}
        description={content.substring(0, 160)}
      />

      <h1>{title}</h1>
      <p>By {author} on {publishDate}</p>
      <div>{content}</div>
    </article>
  );
}
