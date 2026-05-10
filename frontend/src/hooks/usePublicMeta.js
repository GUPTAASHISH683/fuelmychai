import { useEffect } from 'react';

import { PUBLIC_BASE_URL } from '../utils/api.js';

const siteName = 'Fuel My Chai';
const defaultDescription = 'Support Indian creators directly with UPI';

function getAbsoluteUrl(path) {
  return new URL(path, PUBLIC_BASE_URL).toString();
}

function setMetaTag(attribute, key, content) {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
}

export function usePublicMeta(creator, username) {
  useEffect(() => {
    const title = creator ? `Buy ${creator.name} a Chai ☕` : siteName;
    const description =
      creator?.bio || (creator ? `Support ${creator.name} with a chai` : defaultDescription);
    const image = creator?.profile_image || getAbsoluteUrl('/default-og.svg');
    const url = username ? getAbsoluteUrl(`/${username}`) : window.location.href;

    document.title = title;
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', siteName);
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);
  }, [creator, username]);
}
