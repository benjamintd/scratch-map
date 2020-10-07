import Head from "next/head";
import React from "react";

export default function Meta() {
  const title = "Pelica - Fog Of War";
  const description = "How much of the world have you scratched?";
  const ogImageUrl = "https://benmaps.fr/og-image.png";
  const url = "https://benmaps.fr ";

  return (
    <Head>
      <title>{title}</title>
      <meta content={description} name="description" />
      <link href="/icon-192.png" rel="shortcut icon" />
      <meta content={title} property="og:title" />
      <meta content={description} property="og:description" />
      <meta content={ogImageUrl} property="og:image" />
      <meta content={url} property="og:url" />
      <meta content={title} name="twitter:title" />
      <meta content={description} name="twitter:description" />
      <meta content={ogImageUrl} name="twitter:image" />
      <meta content="summary_large_image" name="twitter:card"></meta>
      <meta content="#f7fafc" name="theme-color"></meta>
      <link
        href="https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <link href="favicon.ico" rel="icon" />
      <link href="/icon-512.png" rel="apple-touch-icon"></link>
    </Head>
  );
}
