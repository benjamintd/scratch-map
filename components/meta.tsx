import Head from "next/head";
import React from "react";

export default function Meta() {
  const title = "Pelica - Scratch Map";
  const description = "How much of the world have you scratched?";
  const ogImageUrl = "https://scratch.pelica.co/og-image.png";
  const url = "https://scratch.pelica.co";

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
        href="https://fonts.googleapis.com/css2?family=Lora:wght@400;700&family=Raleway:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <link href="favicon.png" rel="icon" />
      <link href="/apple-touch-icon.png" rel="apple-touch-icon"></link>
    </Head>
  );
}
