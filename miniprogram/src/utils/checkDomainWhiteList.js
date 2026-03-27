

export function isDomainWhitelisted(url, whitelistArr) {
  const domainMatch = url.match(/^(?:https?:\/\/)?(?:www\.)?([^/:]+)/);
  const domain = domainMatch ? domainMatch[1] : "";
  const normalizedDomain = domain.replace(/^www\./, '');
  
  const isWhitelisted = Object.values(whitelistArr).includes(normalizedDomain) ||
  Object.values(whitelistArr).includes(`www.${normalizedDomain}`);
  
  return isWhitelisted;
}